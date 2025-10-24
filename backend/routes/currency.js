const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/convert/:amount/:from/:to', async (req, res) => {
  try {
    const { amount, from, to } = req.params;
    
    const rates = {
      'USD_INR': 88,
      'EUR_INR': 90,
      'GBP_INR': 105,
      'INR_USD': 0.012,
      'INR_EUR': 0.011,
      'INR_GBP': 0.0095
    };
    
    const rate = rates[`${from}_${to}`] || 1;
    const converted = (Number(amount) * rate).toFixed(2);
    
    res.json({
      original: amount,
      converted: converted,
      fromCurrency: from,
      toCurrency: to,
      rate: rate
    });
  } catch (err) {
    res.status(500).json({ error: 'Currency conversion failed' });
  }
});

module.exports = router;