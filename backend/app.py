from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib

app = Flask(__name__)
CORS(app)

# Mock data for testing
mock_transactions = [
    {
        "id": 1,
        "from_address": "0x123abc...",
        "to_address": "0x456def...",
        "value_eth": 1.5,
        "gas_price_eth": 0.0002,
        "is_fraud": False,
        "timestamp": "2024-03-12T10:00:00"
    },
    {
        "id": 2,
        "from_address": "0x789ghi...",
        "to_address": "0xjklmno...",
        "value_eth": 10.0,
        "gas_price_eth": 0.0003,
        "is_fraud": True,
        "timestamp": "2024-03-12T10:05:00"
    }
]

def prepare_features(data):
    return {
        'value_eth': float(data.get('value_eth', 0)),
        'gas_price_eth': float(data.get('gas_price_eth', 0)),
        'transaction_count': 1,
        'unique_addresses_interacted': 1,
        'average_transaction_value': float(data.get('value_eth', 0)),
        'gas_price_volatility': 0,
        'median_gas_price': float(data.get('gas_price_eth', 0)),
        'repeated_to_addresses': 1,
        'incoming_outgoing_ratio': 1,
        'transaction_frequency': 1,
        'average_time_between_transactions': 0
    }

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    return jsonify(mock_transactions)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("Received data:", data)
        
        # Prepare features
        features = prepare_features(data)
        
        # Mock prediction for testing
        is_fraud = features['value_eth'] > 5.0
        prediction_result = {
            'is_fraud': is_fraud,
            'confidence': 0.85,
            'anomaly_score': 0.78 if is_fraud else -0.23
        }
        
        # Add transaction to mock data
        new_transaction = {
            "id": len(mock_transactions) + 1,
            "from_address": data.get('from_address', ''),
            "to_address": data.get('to_address', ''),
            "value_eth": features['value_eth'],
            "gas_price_eth": features['gas_price_eth'],
            "is_fraud": is_fraud,
            "timestamp": pd.Timestamp.now().isoformat()
        }
        mock_transactions.append(new_transaction)
        
        return jsonify(prediction_result)
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)