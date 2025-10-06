const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/destination/:iataCode', async (req, res) => {
  try {
    const { iataCode } = req.params;
    
    const cityMap = {
      'DEL': 'Delhi',
      'BOM': 'Mumbai', 
      'BLR': 'Bangalore',
      'MAA': 'Chennai',
      'CCU': 'Kolkata',
      'HYD': 'Hyderabad'
    };
    
    const city = cityMap[iataCode] || 'Delhi';
    
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    
    const mockWeather = {
      city: city,
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
      description: 'Perfect weather for travel!'
    };
    
    res.json(mockWeather);
  } catch (err) {
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

router.get('/:cityCode', async (req, res) => {
  try {
    const { cityCode } = req.params;
  
    const cityMap = {
      'DEL': 'Delhi',
      'BOM': 'Mumbai', 
      'BLR': 'Bangalore',
      'MAA': 'Chennai',
      'CCU': 'Kolkata',
      'HYD': 'Hyderabad'
    };
    
    const city = cityMap[cityCode] || 'Delhi';
    
    const mockWeather = {
      city: city,
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
      rainfall: Math.floor(Math.random() * 50), // 0-50% chance
      description: 'Perfect weather for travel!'
    };
    
    res.json(mockWeather);
  } catch (err) {
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

module.exports = router;