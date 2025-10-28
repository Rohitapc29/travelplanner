const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['flight', 'hotel'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'inr'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  // Flight specific fields
  pnr: String,
  airline: String,
  departure: String,
  arrival: String,
  passengerName: String,
  // Hotel specific fields
  hotelName: String,
  roomType: String,
  checkIn: Date,
  checkOut: Date,
  guestName: String,
  // Common fields
  customerEmail: String,
  customerPhone: String,
  metadata: {
    type: Map,
    of: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);