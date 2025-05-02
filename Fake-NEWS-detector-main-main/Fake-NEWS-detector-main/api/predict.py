from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import joblib
from urllib.parse import parse_qs

# Add the ml-backend directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
ml_backend_dir = os.path.join(current_dir, '..', 'ml-backend')
sys.path.append(ml_backend_dir)

try:
    MODEL_PATH = os.path.join(ml_backend_dir, "fake_news_model.pkl")
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None
    error_msg = str(e)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data)
            text = data.get("text", "")
            
            if not text:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No text provided."}).encode())
                return
            
            if model is None:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Model could not be loaded: {error_msg}"}).encode())
                return
            
            prediction = model.predict([text])[0]
            proba = model.predict_proba([text])[0].max()
            
            result = {
                "result": "Fake" if prediction == 1 else "Real",
                "confidence": float(proba)
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers() 