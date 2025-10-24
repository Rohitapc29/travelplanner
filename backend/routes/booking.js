const express = require('express');
const router = express.Router();

const bookings = {};


const generatePNR = () => {
  return 'TP' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

router.post('/create', (req, res) => {
  try {
    console.log("Booking request received:", req.body);
    
    const { flightOffer, passengers, contactInfo } = req.body;
    
    if (!flightOffer || !passengers || !passengers.length) {
      console.log("Missing flight or passenger data");
      return res.status(400).json({ error: "Missing flight or passenger data" });
    }
    

    const mainPassenger = passengers[0];
    
    console.log('Creating booking for passenger:', mainPassenger.firstName, mainPassenger.lastName);
    console.log('Flight details:', flightOffer.airlineName, flightOffer.flightNumber);
    
    const pnr = generatePNR();
    
    const booking = {
      id: Math.floor(Math.random() * 100000),
      pnr: pnr,
      flight: flightOffer,
      passengers: passengers,
      contactInfo: contactInfo,
      status: 'CONFIRMED',
      created: new Date().toISOString()
    };
    
    bookings[pnr] = booking;
    
    console.log(`Booking created with PNR: ${pnr}`);
    
    setTimeout(() => {
      res.json({
        success: true,
        booking: booking,
        pnr: pnr,
        message: 'Booking created successfully'
      });
    }, 500);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Booking creation failed' });
  }
});


router.get('/lookup/:pnr', (req, res) => {
  try {
    const { pnr } = req.params;
    console.log(`Looking up booking with PNR: ${pnr}`);
    
    const booking = bookings[pnr];
    
    if (!booking) {
      console.log(`Booking not found: ${pnr}`);
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    console.log(`Booking found: ${booking.pnr}`);
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Booking lookup error:', error);
    res.status(500).json({ error: 'Booking lookup failed' });
  }
});

module.exports = router;