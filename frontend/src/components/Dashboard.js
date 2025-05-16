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
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudulentTransactions: 0,
    averageValue: 0
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/transactions');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTransactions(data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = useCallback(() => {
    if (transactions.length > 0) {
      try {
        const fraudulent = transactions.filter(t => t.is_fraud).length;
        const totalValue = transactions.reduce((acc, curr) => acc + parseFloat(curr.value_eth || 0), 0);
        const avgValue = totalValue / transactions.length;
        
        setStats({
          totalTransactions: transactions.length,
          fraudulentTransactions: fraudulent,
          averageValue: avgValue
        });
      } catch (error) {
        console.error('Error calculating stats:', error);
      }
    }
  }, [transactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const handlePredictionResult = async (result) => {
    if (result?.prediction) {
      setPredictionResult(result.prediction);
    } else {
      setPredictionResult(result);
    }
    await fetchTransactions();
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 4,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              textAlign: 'center',
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Ethereum Transaction Fraud Detector
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert 
              severity="error"
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {error}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <TransactionForm onPredictionResult={handlePredictionResult} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {predictionResult && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                borderRadius: 2,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Prediction Result
              </Typography>
              <Alert 
                severity={predictionResult.is_fraud ? "error" : "success"}
                sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {predictionResult.is_fraud ? "Suspicious Transaction Detected!" : "Normal Transaction"}
              </Alert>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Confidence Score: {(predictionResult.confidence || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Anomaly Score: {(predictionResult.anomaly_score || 0).toFixed(4)}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Statistics
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Total Transactions: {stats.totalTransactions}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Fraudulent Transactions: {stats.fraudulentTransactions}
              </Typography>
              <Typography variant="body1">
                Average Transaction Value: {stats.averageValue.toFixed(4)} ETH
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Transaction Value Trend
            </Typography>
            <Box sx={{ height: 300, mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <Paper sx={{ p: 1 }}>
                            <Typography>Value: {payload[0].value} ETH</Typography>
                            <Typography variant="caption">ID: {payload[0].payload.id}</Typography>
                          </Paper>
                        );
                      }
                      return null;
                    }}
                  />
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
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              p: 4 
            }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                borderRadius: 2,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <TransactionList transactions={transactions} />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;