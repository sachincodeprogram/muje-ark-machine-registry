require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const machinesRouter = require('./routes/machines');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Ark Machine Registry API is running' });
});

// Routes
app.use('/api/machines', machinesRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] === 'serialNumber' ? 'serial number' : 'uniqueId';
    return res.status(409).json({
      error: `A machine with this ${field} already exists`,
      details: err.keyValue,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for field "${err.path}"` });
  }

  return res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB Atlas, then start the server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
