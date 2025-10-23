require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const flightRoutes = require('./routes/flights');
const hotelRoutes = require('./hotels/routes/hotelRoutes');
const airportRoutes = require('./routes/airports');
const weatherRoutes = require('./routes/weather');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');
const mongoose = require('mongoose');

const app = express();


connectDB();

mongoose.connection.once('open', async () => {
  try {
    await mongoose.connection.db.admin().ping();
    console.log('Successfully pinged MongoDB deployment. Connection is alive!');
  } catch (error) {
    console.error('Error pinging MongoDB:', error);
  }
});

app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Routes
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/booking/payment', paymentRoutes);
app.use('/api/booking', bookingRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Enhanced Travel Planner Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Flight search: http://localhost:${PORT}/api/flights/search`);
  console.log(`Airport search: http://localhost:${PORT}/api/airports/search`);
});
