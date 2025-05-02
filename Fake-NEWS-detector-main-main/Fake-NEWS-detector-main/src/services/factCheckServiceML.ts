// This service connects to your local ML backend for fake news detection
export async function checkFakeNewsML(text: string) {
  const response = await fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return response.json();
}
