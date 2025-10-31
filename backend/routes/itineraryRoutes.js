const express = require('express');
const router = express.Router();
const PremadeItinerary = require('../models/PremadeItinerary');


router.get('/cities', async (req, res) => {
  try {
    const cities = await PremadeItinerary.find({}, 'cityName cityImage description');
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

router.get('/city/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const itinerary = await PremadeItinerary.findOne({ 
      cityName: new RegExp(cityName, 'i') 
    });
    
    if (!itinerary) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    res.json(itinerary);
  } catch (error) {
    console.error('Error fetching city itineraries:', error);
    res.status(500).json({ error: 'Failed to fetch city itineraries' });
  }
});

module.exports = router;