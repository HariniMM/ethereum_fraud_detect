import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <CssBaseline />
      <Dashboard />
    </Container>
  );
}

export default App;