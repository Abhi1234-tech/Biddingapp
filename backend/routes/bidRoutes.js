const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');

// Bid routes
router.get('/', bidController.getBids);
router.post('/', bidController.createBid);
router.put('/:id', bidController.updateBid);
router.delete('/:id', bidController.deleteBid);

module.exports = router;
