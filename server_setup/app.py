from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Hardcoded token for verification
API_TOKEN = "43b4178c64f074c22ad8f46d0a3af710d5837c7fb0f2d7301fcf8555ded0e7bf"

# Sample file content (in place of an actual file for simplicity)
sample_data = [
    {
        "packet_data": "0.7882783943365343 0.0 64.97666193316861 -1 55094 443 79 39 64 0 5 PA -1 23 3 3 0 34 140 68 61 73 183 199 175 90 253 15 176 149 79 62 225 143 157 236 24 219 128 70 182 158 182 105 103 20 24 207 50 172 88 101",
        "classification_result": [
            {
                "label": "Normal",
                "score": 0.9999984502792358
            }
        ],
        "source_ip": "192.168.94.133",
        "destination_ip": "103.102.166.240",
        "dropped": True,
        "timestamp": "2024-09-11 12:29:51.558710"
    }
]

@app.route('/get_data', methods=['POST'])
def get_data():
    # Extracting token and IP from the request
    request_data = request.json
    token = request_data.get('token')
    ip = request_data.get('ip')
    
    # Verify token
    if token != API_TOKEN:
        return jsonify({"error": "Invalid token"}), 401
    
    # Search for the IP in the sample data
    result = [entry for entry in sample_data if entry['source_ip'] == ip or entry['destination_ip'] == ip]
    
    if result:
        return jsonify({"status": "success", "data": result}), 200
    else:
        return jsonify({"status": "error", "message": "IP not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
