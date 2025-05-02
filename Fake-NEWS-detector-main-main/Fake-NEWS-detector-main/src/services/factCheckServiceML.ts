// This service connects to your local ML backend for fake news detection
export async function checkFakeNewsML(text: string) {
  const apiUrl = process.env.NODE_ENV === 'production'
    ? '/api/predict'
    : 'http://localhost:5000/predict';
    
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return response.json();
  } catch (error) {
    console.error("Error calling ML API:", error);
    // Fallback response with a basic classification
    // This is just a simple word-based check for demo purposes
    const lowerText = text.toLowerCase();
    const fakeWords = ['fake', 'hoax', 'conspiracy', 'clickbait', 'shocking', 'secret'];
    const realWords = ['research', 'study', 'evidence', 'according to', 'published', 'verified'];
    
    let fakeScore = fakeWords.reduce((score, word) => 
      lowerText.includes(word) ? score + 0.2 : score, 0);
    let realScore = realWords.reduce((score, word) => 
      lowerText.includes(word) ? score + 0.2 : score, 0);
    
    // Normalize scores
    const total = fakeScore + realScore || 1;
    fakeScore = fakeScore / total;
    realScore = realScore / total;
    
    // Determine result
    const isFake = fakeScore > realScore;
    const confidence = Math.max(fakeScore, realScore);
    
    return {
      result: isFake ? "Fake" : "Real",
      confidence: confidence,
      isFallback: true,
      explanation: [
        { word: "(Offline Mode)", weight: 0 },
        { word: "API unavailable", weight: 0 }
      ]
    };
  }
}
