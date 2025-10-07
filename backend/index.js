require('dotenv').config();
const express = require('express');
const cors = require('cors');
const flightRoutes = require('./routes/flights');
const hotelRoutes = require('./hotels/routes/hotelRoutes');

const app = express();

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Enhanced Travel Planner Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Flight search: http://localhost:${PORT}/api/flights/search`);
  console.log(`Airport search: http://localhost:${PORT}/api/airports/search`);
  console.log(`Services: http://localhost:${PORT}/api/services`);
});
