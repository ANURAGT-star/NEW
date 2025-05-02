import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# Load datasets
fake = pd.read_csv("Fake.csv")
fake['label'] = 1  # Fake
real = pd.read_csv("True.csv")
real['label'] = 0  # Real

data = pd.concat([fake, real], ignore_index=True)

# Preprocessing
X = data['text']
y = data['label']

# Split into train and test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Create pipeline: TF-IDF + Logistic Regression
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', max_df=0.7)),
    ('clf', LogisticRegression(max_iter=1000))
])

pipeline.fit(X_train, y_train)

# Save the pipeline
joblib.dump(pipeline, "fake_news_model.pkl")

print("Model trained and saved as fake_news_model.pkl.")
