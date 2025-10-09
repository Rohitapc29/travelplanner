const express = require('express');
const router = express.Router();

router.get('/flight/:flightId', (req, res) => {
  const { flightId } = req.params;
  
  const services = {
    flightId,
    services: {
      baggage: [
        { type: "Standard", weight: "15kg", price: "0", included: true },
        { type: "Extra", weight: "25kg", price: "1500", included: false },
        { type: "Heavy", weight: "35kg", price: "2500", included: false }
      ],
      meals: [
        { type: "Vegetarian", description: "Indian vegetarian meal", price: "0", included: true },
        { type: "Non-Vegetarian", description: "Chicken/Mutton meal", price: "0", included: true },
        { type: "Jain", description: "Jain vegetarian meal", price: "500", included: false },
        { type: "Diabetic", description: "Diabetic-friendly meal", price: "500", included: false }
      ],
      seats: [
        { type: "Standard", description: "Regular economy seat", price: "0", included: true },
        { type: "Premium", description: "Extra legroom", price: "1000", included: false },
        { type: "Window", description: "Window seat", price: "500", included: false },
        { type: "Aisle", description: "Aisle seat", price: "500", included: false }
      ],
      insurance: [
        { type: "Basic", coverage: "Trip cancellation", price: "500", included: false },
        { type: "Comprehensive", coverage: "Medical + Cancellation", price: "1200", included: false }
      ],
      lounge: [
        { type: "Airport Lounge", description: "Premium lounge access", price: "1800", included: false }
      ]
    }
  };
  
  res.json(services);
});

router.post('/book', (req, res) => {
  const { pnr, services } = req.body;
  
  if (!pnr || !services) {
    return res.status(400).json({ error: "PNR and services are required" });
  }
  
  let totalAdditionalCost = 0;
  services.forEach(service => {
    totalAdditionalCost += Number(service.price || 0);
  });
  
  const serviceBooking = {
    pnr,
    services,
    totalCost: totalAdditionalCost,
    bookingDate: new Date().toISOString(),
    status: "CONFIRMED"
  };
  
  console.log(`Additional services booked for PNR ${pnr}:`, services);
  
  res.json({
    success: true,
    booking: serviceBooking,
    message: "Additional services booked successfully!"
  });
});

module.exports = router;