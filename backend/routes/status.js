const express = require('express');
const router = express.Router();

router.get('/flight/:flightNumber/:date', (req, res) => {
  const { flightNumber, date } = req.params;
  
  const statuses = ['On Time', 'Delayed', 'Boarding', 'Departed', 'Arrived'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  const mockStatus = {
    flightNumber: flightNumber,
    date: date,
    status: randomStatus,
    scheduledDeparture: '08:00',
    actualDeparture: randomStatus === 'Delayed' ? '08:25' : '08:00',
    gate: 'A12',
    terminal: '3',
    aircraft: 'Boeing 737-800',
    delay: randomStatus === 'Delayed' ? '25 minutes' : null
  };
  
  res.json(mockStatus);
});

module.exports = router;