const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');

const bookings = {};

const generatePNR = () => {
  return 'TP' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

router.post('/create', async (req, res) => {
  try {
    console.log("Booking request received:", req.body);
    
    const { flightOffer, passengers, contactInfo, userEmail } = req.body;
    
    if (!flightOffer || !passengers || !passengers.length) {
      console.log("Missing flight or passenger data");
      return res.status(400).json({ error: "Missing flight or passenger data" });
    }

    const pnr = generatePNR();
    
  
    const memoryBooking = {
      id: Math.floor(Math.random() * 100000),
      pnr: pnr,
      flight: flightOffer,
      passengers: passengers,
      contactInfo: contactInfo,
      status: 'CONFIRMED',
      created: new Date().toISOString()
    };
    
    bookings[pnr] = memoryBooking;


    if (userEmail) {
      try {
        const user = await User.findOne({ email: userEmail });
        
        if (user) {
          console.log(`Found existing user: ${user.email}`);
          
          const dbBooking = new Booking({
            userId: user._id,
            bookingType: 'flight',
            pnr: pnr,
            status: 'CONFIRMED',
            totalAmount: parseFloat(flightOffer.inflatedPrice) || parseFloat(flightOffer.basePrice) || 0,
            flightDetails: {
              airlineName: flightOffer.airlineName,
              flightNumber: flightOffer.flightNumber,
              departure: {
                city: flightOffer.departure.iataCode,
                airport: flightOffer.departure.iataCode,
                date: flightOffer.departure.date,
                time: flightOffer.departure.time
              },
              arrival: {
                city: flightOffer.arrival.iataCode,
                airport: flightOffer.arrival.iataCode,
                date: flightOffer.arrival.date,
                time: flightOffer.arrival.time
              },
              passengers: passengers
            },

            contactInfo: {
              firstName: passengers[0].firstName,
              lastName: passengers[0].lastName,
              email: contactInfo.email, 
            }
          });

          await dbBooking.save();
          console.log('Booking saved to database with ID:', dbBooking._id);
        } else {
          console.log(`User not found: ${userEmail}`);
          console.log('User needs to sign up');
        }
      } catch (dbError) {
        console.error('Error saving to DB:', dbError);
        
      }
    } else {
      console.log('No userEmail provided only saved in memory.');
    }
    
    console.log(`Booking created with PNR: ${pnr}`);
    
    setTimeout(() => {
      res.json({
        success: true,
        booking: memoryBooking,
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