const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bidsPlaced: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
});

module.exports = mongoose.model('User', userSchema);
