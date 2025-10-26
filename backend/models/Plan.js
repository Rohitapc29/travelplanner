const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  thumbnail: String,
  suggestedDuration: Number,
  category: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  startTime: String,     
  endTime: String       
});

const dayScheduleSchema = new mongoose.Schema({
  attractions: [attractionSchema]
});

const planSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  numDays: {
    type: Number,
    required: true
  },
  schedule: [dayScheduleSchema],
  thumbnail: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plan', planSchema);