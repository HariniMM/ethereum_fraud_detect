import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib

class FraudDetector:
    def __init__(self):
        self.model = joblib.load('model/model.pkl')
        self.scaler = joblib.load('model/scaler.pkl')
        self.features = [
            'value_eth', 'gas_price_eth', 'transaction_count',
            'unique_addresses_interacted', 'average_transaction_value',
            'gas_price_volatility', 'median_gas_price',
            'repeated_to_addresses', 'incoming_outgoing_ratio',
            'transaction_frequency', 'average_time_between_transactions'
        ]

    def predict(self, transaction_data):
        try:
            # Prepare data
            df = pd.DataFrame([transaction_data])
            
            # Scale features
            X_scaled = self.scaler.transform(df)
            
            # Make prediction
            prediction = self.model.predict(X_scaled)[0]
            score = self.model.decision_function(X_scaled)[0]
            
            return {
                'is_fraud': prediction == -1,
                'anomaly_score': float(score),
                'confidence': float(abs(score))
            }
        except Exception as e:
            raise Exception(f"Prediction error: {str(e)}")