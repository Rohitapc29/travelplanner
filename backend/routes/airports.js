const express = require('express');
const router = express.Router();

const getMockAirports = (keyword) => {
  const airports = [
    { iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', type: 'AIRPORT' },
    { iataCode: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', type: 'AIRPORT' },
    { iataCode: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India', type: 'AIRPORT' },
    { iataCode: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', type: 'AIRPORT' },
    { iataCode: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India', type: 'AIRPORT' },
    { iataCode: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', type: 'AIRPORT' },
    { iataCode: 'GOI', name: 'Goa International Airport', city: 'Goa', country: 'India', type: 'AIRPORT' },
    { iataCode: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India', type: 'AIRPORT' },
    { iataCode: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India', type: 'AIRPORT' },
    { iataCode: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India', type: 'AIRPORT' },
    { iataCode: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', type: 'AIRPORT' },
    { iataCode: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', type: 'AIRPORT' },
    { iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', type: 'AIRPORT' },
    { iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', type: 'AIRPORT' },
    { iataCode: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', type: 'AIRPORT' }
  ];

  const searchTerm = keyword.toLowerCase();
  return airports.filter(airport => 
    airport.iataCode.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.city.toLowerCase().includes(searchTerm)
  ).slice(0, 8);
};

router.get('/search', (req, res) => {
  const { keyword } = req.query;
  
  if (!keyword || keyword.length < 2) {
    return res.status(400).json({ error: "Keyword must be at least 2 characters long" });
  }

  try {
    const airports = getMockAirports(keyword);
    res.json(airports);
  } catch (err) {
    console.error("Airport search error:", err);
    res.status(500).json({ error: "Airport search failed" });
  }
});

module.exports = router;