import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip
} from '@mui/material';

function TransactionList({ transactions }) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From Address</TableCell>
              <TableCell>To Address</TableCell>
              <TableCell align="right">Value (ETH)</TableCell>
              <TableCell align="right">Gas Price (ETH)</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {transaction.from_address.slice(0, 8)}...{transaction.from_address.slice(-6)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {transaction.to_address.slice(0, 8)}...{transaction.to_address.slice(-6)}
                  </Typography>
                </TableCell>
                <TableCell align="right">{transaction.value_eth.toFixed(4)}</TableCell>
                <TableCell align="right">{transaction.gas_price_eth.toFixed(8)}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={transaction.is_fraud ? "Suspicious" : "Normal"}
                    color={transaction.is_fraud ? "error" : "success"}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TransactionList;