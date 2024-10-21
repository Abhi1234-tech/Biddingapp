const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productImage: { type: String, required: false },
  minBid: { type: Number, required: true },
  currentBid: { type: Number, required: false },
  auctionStatus: { type: String, enum: ['live', 'upcoming', 'expired'], required: false },
  endDate: { type: Date, required: false },
  userBid: { type: Number, default: null },
  createdByUser: { type: String, required: true }, 
});

module.exports = mongoose.model('Bid', bidSchema);
