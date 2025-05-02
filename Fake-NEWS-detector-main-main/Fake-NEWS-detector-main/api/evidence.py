from http.server import BaseHTTPRequestHandler
import json
import os
import sys

# Add the ml-backend directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
ml_backend_dir = os.path.join(current_dir, '..', 'ml-backend')
sys.path.append(ml_backend_dir)

EVIDENCE_STORE_PATH = os.path.join(ml_backend_dir, "evidence_store.json")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            with open(EVIDENCE_STORE_PATH, 'r') as f:
                evidence_data = json.load(f)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(evidence_data).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data)
            
            # Load existing evidence
            try:
                with open(EVIDENCE_STORE_PATH, 'r') as f:
                    evidence_data = json.load(f)
            except:
                evidence_data = {"evidence": []}
            
            # Add new evidence
            if "evidence" in data:
                evidence_data["evidence"].append(data["evidence"])
                
                # Save back to file
                with open(EVIDENCE_STORE_PATH, 'w') as f:
                    json.dump(evidence_data, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode())
            else:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No evidence provided"}).encode())
        
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers() 