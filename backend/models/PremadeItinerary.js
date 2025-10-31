const mongoose = require('mongoose');

const premadeItinerarySchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  cityImage: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  plans: [{
    id: String,
    name: String,
    days: Number,
    cost: String,
    type: String,
    highlights: [String],
    details: [{
      day: Number,
      title: String,
      activities: [String],
      meals: [String],
      accommodation: String
    }],
    bestTime: String,
    difficulty: String,
    includes: [String],
    excludes: [String]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PremadeItinerary', premadeItinerarySchema);