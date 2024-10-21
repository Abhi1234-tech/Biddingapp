const Bid = require('../models/bidModel');

// Get all bids
exports.getBids = async (req, res) => {
  try {
    const bids = await Bid.find();
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
};

// Create a new bid
exports.createBid = async (req, res) => {
  try {
    const bid = new Bid(req.body);
    await bid.save();
    res.status(201).json(bid);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create bid' });
  }
};

// Update a bid 
exports.updateBid = async (req, res) => {
  const { id } = req.params;
  try {
    const bid = await Bid.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(bid);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update bid' });
  }
};


// Delete a user-added bid
exports.deleteBid = async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting bid with ID: ${id}`);
  try {
    const deletedBid = await Bid.findByIdAndDelete(id);
    if (!deletedBid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    console.log('Bid successfully deleted:', deletedBid); 
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting bid:', err);
    res.status(500).json({ error: 'Failed to delete bid' });
  }
};


