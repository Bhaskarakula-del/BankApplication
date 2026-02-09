const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (for demo purposes)
let accounts = [
  { id: 1, name: 'John Doe', balance: 5000, email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', balance: 7500, email: 'jane@example.com' }
];

// GET all accounts
app.get('/api/accounts', (req, res) => {
  res.json({
    success: true,
    message: 'Fetched all accounts',
    data: accounts
  });
});

// GET single account by ID
app.get('/api/accounts/:id', (req, res) => {
  const account = accounts.find(a => a.id === parseInt(req.params.id));
  if (!account) {
    return res.status(404).json({
      success: false,
      message: 'Account not found'
    });
  }
  res.json({
    success: true,
    message: 'Account retrieved',
    data: account
  });
});

// POST - Create new account
app.post('/api/accounts', (req, res) => {
  const { name, balance, email } = req.body;

  if (!name || balance === undefined || !email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, balance, and email'
    });
  }

  const newAccount = {
    id: accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1,
    name,
    balance,
    email
  };

  accounts.push(newAccount);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: newAccount
  });
});

// UPDATE - Modify existing account
app.put('/api/accounts/:id', (req, res) => {
  const account = accounts.find(a => a.id === parseInt(req.params.id));

  if (!account) {
    return res.status(404).json({
      success: false,
      message: 'Account not found'
    });
  }

  const { name, balance, email } = req.body;

  if (name) account.name = name;
  if (balance !== undefined) account.balance = balance;
  if (email) account.email = email;

  res.json({
    success: true,
    message: 'Account updated successfully',
    data: account
  });
});

// DELETE - Remove an account
app.delete('/api/accounts/:id', (req, res) => {
  const index = accounts.findIndex(a => a.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Account not found'
    });
  }

  const deletedAccount = accounts.splice(index, 1);

  res.json({
    success: true,
    message: 'Account deleted successfully',
    data: deletedAccount[0]
  });
});

// Example: Using axios internally to call external API
app.get('/api/external-data', async (req, res) => {
  try {
    // Example: calling a public API using axios
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    res.json({
      success: true,
      message: 'External data fetched',
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching external data',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`GET    /api/accounts`);
  console.log(`GET    /api/accounts/:id`);
  console.log(`POST   /api/accounts`);
  console.log(`PUT    /api/accounts/:id`);
  console.log(`DELETE /api/accounts/:id`);
  console.log(`GET    /api/health`);
});
