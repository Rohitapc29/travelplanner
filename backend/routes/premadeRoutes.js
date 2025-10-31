const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const SavedPremade = require('../models/SavedPremade'); 


router.get('/cities', async (req, res) => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('travelplanner');
    const collection = db.collection('premadeitineraries');
    
    const cities = await collection.find({}, {
      projection: { cityName: 1, cityImage: 1, description: 1 }
    }).toArray();
    
    await client.close();
    res.json(cities);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

router.get('/city/:cityName', async (req, res) => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('travelplanner');
    const collection = db.collection('premadeitineraries');
    
    const city = await collection.findOne({ 
      cityName: new RegExp(req.params.cityName, 'i') 
    });
    
    await client.close();
    
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    res.json(city);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch city' });
  }
});

router.post('/save-premade', async (req, res) => {
  try {
    const { cityName, planId, userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email required' });
    }
    
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('travelplanner');
    const collection = db.collection('premadeitineraries');
    
    const city = await collection.findOne({ 
      cityName: new RegExp(cityName, 'i') 
    });
    
    if (!city) {
      await client.close();
      return res.status(404).json({ error: 'City not found' });
    }
    
    const selectedPlan = city.plans.find(p => p.id === planId);
    if (!selectedPlan) {
      await client.close();
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    await client.close();

    const existingSave = await SavedPremade.findOne({
      userEmail,
      cityName,
      planId
    });
    
    if (existingSave) {
      return res.status(400).json({ error: 'Plan already saved' });
    }
    
    
    const savedPremade = new SavedPremade({
      userEmail,
      cityName,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      days: selectedPlan.days,
      cost: selectedPlan.cost,
      type: selectedPlan.type,
      highlights: selectedPlan.highlights,
      details: selectedPlan.details,
      bestTime: selectedPlan.bestTime,
      difficulty: selectedPlan.difficulty,
      includes: selectedPlan.includes,
      excludes: selectedPlan.excludes,
      cityImage: city.cityImage
    });
    
    await savedPremade.save();
    res.json({ success: true, planId: savedPremade._id });
    
  } catch (error) {
    console.error('Error saving premade plan:', error);
    res.status(500).json({ error: 'Failed to save plan' });
  }
});


router.get('/my-saved/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const savedPlans = await SavedPremade.find({ userEmail }).sort({ savedAt: -1 });
    res.json(savedPlans);
  } catch (error) {
    console.error('Error fetching saved plans:', error);
    res.status(500).json({ error: 'Failed to fetch saved plans' });
  }
});

module.exports = router;