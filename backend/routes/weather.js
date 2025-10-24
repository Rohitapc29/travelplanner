const express = require('express');
const axios = require('axios');
const router = express.Router();


const weatherCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

router.get('/:cityCode', async (req, res) => {
  try {
    const { cityCode } = req.params;
    console.log(`Weather request for city code: ${cityCode}`);
    
    const cacheKey = cityCode;
    const now = Date.now();
    if (weatherCache.has(cacheKey)) {
      const cachedData = weatherCache.get(cacheKey);
      if (now - cachedData.timestamp < CACHE_TTL) {
        console.log(`Using cached weather data for ${cityCode}`);
        return res.json(cachedData.data);
      }
    }
  
    const cityMapping = {
      'BOM': 'Mumbai',
      'DEL': 'Delhi',
      'BLR': 'Bangalore',
      'MAA': 'Chennai',
      'HYD': 'Hyderabad',
      'CCU': 'Kolkata',
      'GOI': 'Goa',
      'JFK': 'New York',
      'LHR': 'London',
      'SIN': 'Singapore',
      'DXB': 'Dubai'

    };
    
    const cityName = cityMapping[cityCode] || cityCode;
    
    if (!process.env.OPENWEATHER_API_KEY) {
      // FIX THIS LATER!!!
      const mockData = {
        city: cityName,
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35
        humidity: Math.floor(Math.random() * 30) + 50,    // 50-80
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        rainfall: Math.random() > 0.5 ? Math.floor(Math.random() * 40) : 0
      };
      
      weatherCache.set(cacheKey, {
        timestamp: now,
        data: mockData
      });
      
      return res.json(mockData);
    }
    
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: cityName,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 5000
    });
    
    const weatherData = {
      city: cityName,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].description,
      rainfall: response.data.rain ? response.data.rain['1h'] * 100 : 0
    };
    
    
    weatherCache.set(cacheKey, {
      timestamp: now,
      data: weatherData
    });
    
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error.message);
    
    const errorData = {
      city: req.params.cityCode,
      temperature: 25,
      humidity: 60,
      condition: 'Clear sky',
      rainfall: 0
    };
    
    weatherCache.set(cacheKey, {
      timestamp: now,
      data: errorData
    });
    
    res.json(errorData);
  }
});

module.exports = router;