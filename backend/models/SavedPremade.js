const mongoose = require('mongoose');

const savedPremadeSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  cityName: {
    type: String,
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
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
  excludes: [String],
  cityImage: String,
  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedPremade', savedPremadeSchema);