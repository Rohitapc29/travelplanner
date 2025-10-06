// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/booking');
const airportRoutes = require('./routes/airports');
const servicesRoutes = require('./routes/services');
const weatherRoutes = require('./routes/weather');
const currencyRoutes = require('./routes/currency');
const statusRoutes = require('./routes/status');

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// API Routes
app.use('/api/flights', flightRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/status', statusRoutes);

app.get("/api/flights", (req, res, next) => {
  req.url = req.url.replace('/api/flights', '/api/flights/search');
  flightRoutes(req, res, next);
});

app.post("/api/create-checkout-session", (req, res, next) => {
  req.url = req.url.replace('/api/create-checkout-session', '/api/booking/payment/create-session');
  bookingRoutes(req, res, next);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    requestedPath: req.path,
    availableRoutes: [
      'GET /api/flights/search',
      'GET /api/flights/:flightId/seatmap',
      'GET /api/airports/search',
      'POST /api/booking/create',
      'GET /api/booking/:pnr',
      'POST /api/booking/payment/create-session',
      'GET /api/services/flight/:flightId',
      'POST /api/services/book'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Enhanced Travel Planner Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Flight search: http://localhost:${PORT}/api/flights/search`);
  console.log(`Airport search: http://localhost:${PORT}/api/airports/search`);
  console.log(`Services: http://localhost:${PORT}/api/services`);
});
