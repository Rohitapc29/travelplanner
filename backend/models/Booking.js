const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel'],
    required: true
  },
  pnr: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['CONFIRMED', 'CANCELLED'],
    default: 'CONFIRMED'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  flightDetails: {
    airlineName: String,
    flightNumber: String,
    departure: {
      city: String,
      airport: String,
      date: String,
      time: String
    },
    arrival: {
      city: String,
      airport: String,
      date: String,
      time: String
    },
    passengers: [{
      firstName: String,
      lastName: String,
      age: Number,
      gender: String
    }]
  },
  
  hotelDetails: {
    hotelName: String,
    roomType: String,
    checkIn: String,
    checkOut: String,
    nights: Number,
    guests: Number,
    location: String
  },
  
  contactInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);