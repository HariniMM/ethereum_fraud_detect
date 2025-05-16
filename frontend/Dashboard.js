import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Typography, Box, Alert, CircularProgress } from '@mui/material';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/transactions');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      }
    } catch (err) {
      setError('Failed to fetch transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePredictionResult = async (result) => {
    setPredictionResult(result);
    await fetchTransactions();
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Ethereum Transactions Fraud Detection
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <TransactionForm onPredictionResult={handlePredictionResult} />
        </Grid>

        <Grid item xs={12} md={6}>
          {predictionResult && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Prediction Result
              </Typography>
              <Alert severity={predictionResult.is_fraud ? "error" : "success"}>
                {predictionResult.is_fraud ? "Suspicious Transaction Detected!" : "Normal Transaction"}
              </Alert>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Confidence Score: {(predictionResult.confidence || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Anomaly Score: {(predictionResult.anomaly_score || 0).toFixed(4)}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Value Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value_eth" 
                    stroke="#8884d8" 
                    name="Value (ETH)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;