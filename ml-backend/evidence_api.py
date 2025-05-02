from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from threading import Lock

EVIDENCE_FILE = os.path.join(os.path.dirname(__file__), "evidence_store.json")
app = Flask(__name__)
CORS(app)
lock = Lock()

def load_evidence():
    if not os.path.exists(EVIDENCE_FILE):
        return {}
    with open(EVIDENCE_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return {}

def save_evidence(data):
    with open(EVIDENCE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route("/api/evidence/<query>", methods=["GET"])
def get_evidence(query):
    with lock:
        store = load_evidence()
        return jsonify(store.get(query, []))

@app.route("/api/evidence/<query>", methods=["POST"])
def add_evidence(query):
    new_item = request.get_json()
    if not new_item or not new_item.get("text") or not new_item.get("user_id") or not new_item.get("verdict"):
        return jsonify({"error": "Evidence text, user_id, and verdict required."}), 400
    with lock:
        store = load_evidence()
        items = store.get(query, [])
        new_item["timestamp"] = int(new_item.get("timestamp") or 0) or int(__import__('time').time()*1000)
        new_item["approvals"] = []
        new_item["corrections"] = []
        items.append(new_item)
        store[query] = items
        save_evidence(store)
        return jsonify({"success": True})

@app.route("/api/evidence/<query>/<int:idx>/vote", methods=["POST"])
def vote_evidence(query, idx):
    data = request.get_json()
    user_id = data.get("user_id")
    vote_type = data.get("vote")  # "correct" or "incorrect"
    reason = data.get("reason", "")
    if not user_id or vote_type not in ("correct", "incorrect"):
        return jsonify({"error": "user_id and valid vote required."}), 400
    with lock:
        store = load_evidence()
        items = store.get(query, [])
        if idx < 0 or idx >= len(items):
            return jsonify({"error": "Invalid index."}), 404
        item = items[idx]
        # Init vote lists if not present
        if "correct_votes" not in item:
            item["correct_votes"] = []
        if "incorrect_votes" not in item:
            item["incorrect_votes"] = []
        # Remove user from both lists (retract/change vote)
        item["correct_votes"] = [v for v in item["correct_votes"] if v["user_id"] != user_id]
        item["incorrect_votes"] = [v for v in item["incorrect_votes"] if v["user_id"] != user_id]
        # If this is a new vote (not a retraction), add it
        if data.get("action") != "retract":
            if vote_type == "correct":
                item["correct_votes"].append({"user_id": user_id, "reason": reason})
            else:
                item["incorrect_votes"].append({"user_id": user_id, "reason": reason})
        save_evidence(store)
        return jsonify({
            "success": True,
            "correct_votes": item["correct_votes"],
            "incorrect_votes": item["incorrect_votes"]
        })

@app.route("/api/evidence/<query>/<int:idx>", methods=["PUT"])
def edit_evidence(query, idx):
    new_item = request.get_json()
    user_id = new_item.get("user_id")
    with lock:
        store = load_evidence()
        items = store.get(query, [])
        if idx < 0 or idx >= len(items):
            return jsonify({"error": "Invalid index."}), 404
        if items[idx].get("user_id") != user_id:
            return jsonify({"error": "Forbidden: user_id does not match."}), 403
        items[idx].update({k: v for k, v in new_item.items() if k in ("text", "url", "verdict")})
        save_evidence(store)
        return jsonify({"success": True})

@app.route("/api/evidence/<query>/<int:idx>", methods=["DELETE"])
def delete_evidence(query, idx):
    user_id = request.args.get("user_id")
    with lock:
        store = load_evidence()
        items = store.get(query, [])
        if idx < 0 or idx >= len(items):
            return jsonify({"error": "Invalid index."}), 404
        if items[idx].get("user_id") != user_id:
            return jsonify({"error": "Forbidden: user_id does not match."}), 403
        items.pop(idx)
        store[query] = items
        save_evidence(store)
        return jsonify({"success": True})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
