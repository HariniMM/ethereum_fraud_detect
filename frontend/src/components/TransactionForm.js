import React, { useState } from 'react';
import { TextField, Button, Paper, Grid } from '@mui/material';
import axios from 'axios';

function TransactionForm({ onPredictionResult }) {
  const [formData, setFormData] = useState({
    from_address: '',
    to_address: '',
    value_eth: '',
    gas_price_eth: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/predict', {
        ...formData,
        value_eth: parseFloat(formData.value_eth) || 0,
        gas_price_eth: parseFloat(formData.gas_price_eth) || 0
      });
      onPredictionResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      onPredictionResult({ error: 'Failed to process transaction' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="From Address"
              name="from_address"
              value={formData.from_address}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="To Address"
              name="to_address"
              value={formData.to_address}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Value (ETH)"
              name="value_eth"
              value={formData.value_eth}
              onChange={handleChange}
              required
              inputProps={{ step: "0.000001" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Gas Price (ETH)"
              name="gas_price_eth"
              value={formData.gas_price_eth}
              onChange={handleChange}
              required
              inputProps={{ step: "0.000000001" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              fullWidth
            >
              Check Transaction
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default TransactionForm;