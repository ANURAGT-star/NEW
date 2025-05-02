from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from lime.lime_text import LimeTextExplainer
import numpy as np

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "fake_news_model.pkl")
model = joblib.load(MODEL_PATH)
explainer = LimeTextExplainer(class_names=["Real", "Fake"])

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided."}), 400
    prediction = model.predict([text])[0]
    proba = model.predict_proba([text])[0].max()

    # LIME explanation
    exp = explainer.explain_instance(
        text,
        model.predict_proba,
        num_features=5,
        labels=[1, 0]  # "Fake" is 1, "Real" is 0
    )
    # Get the explanation for the predicted class
    label = int(prediction)
    words_weights = exp.as_list(label=label)[:5]
    explanation = [
        {"word": w, "weight": float(weight)} for w, weight in words_weights
    ]

    return jsonify({
        "result": "Fake" if prediction == 1 else "Real",
        "confidence": float(proba),
        "explanation": explanation
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
