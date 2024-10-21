
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAddedBidsAtom } from '../store/bidsStore';
import { useNavigate, useLocation } from 'react-router-dom'; 
import '../styles/BidsForm.css';

const BidForm = () => {
  const [userAddedBids, setUserAddedBids] = useAtom(userAddedBidsAtom);
  const [formData, setFormData] = useState({
    productName: '',
    productImage: '',
    minBid: '',
    currentBid: '',
    auctionStatus: 'live', 
    endDate: '',
    userBid: null, 
    createdByUser: '', 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there is a bid object in location.state
    if (location.state && location.state.bid) {
      const bid = location.state.bid;
      setFormData({
        productName: bid.productName,
        productImage: bid.productImage,
        minBid: bid.minBid,
        currentBid: bid.currentBid,
        auctionStatus: bid.auctionStatus,
        endDate: new Date(bid.endDate).toISOString().slice(0, 16), 
        userBid: bid.userBid,
        createdByUser: bid.createdByUser,
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEndDate = () => {
    const selectedDate = new Date(formData.endDate);
    const today = new Date();
    return selectedDate >= today;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.minBid || !formData.endDate) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!validateEndDate()) {
      setError('End date cannot be in the past!');
      return;
    }

    const updatedBid = {
      productName: formData.productName,
      productImage: formData.productImage || 'https://via.placeholder.com/150',
      minBid: parseFloat(formData.minBid),
      currentBid: parseFloat(formData.minBid), // Update currentBid based on input
      auctionStatus: formData.auctionStatus,
      endDate: new Date(formData.endDate).toISOString(),
      userBid: null, // Optional field
      createdByUser: localStorage.getItem('username') // Get the username from local storage
    };

    try {
      // Check if we are updating an existing bid or creating a new one
      if (location.state && location.state.bid) {
        const bidId = location.state.bid._id;
        const response = await fetch(`http://localhost:5000/api/bids/${bidId}`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBid),
        });

        if (response.ok) {
          const updatedBidData = await response.json();
          // Update the userAddedBids state with the updated bid
          setUserAddedBids(userAddedBids.map(bid => (bid._id === bidId ? updatedBidData : bid)));
          navigate('/home');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to update bid. Please try again.');
        }
      } else {
        // Handle creating a new bid
        const response = await fetch('http://localhost:5000/api/bids', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBid),
        });

        if (response.ok) {
          const createdBid = await response.json();
          setUserAddedBids([...userAddedBids, createdBid]);
          navigate('/home');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to create bid. Please try again.');
        }
      }
    } catch (err) {
      setError('Failed to create/update bid. Please try again.');
    }
  };

  function handlegoback() {
    navigate('/home');
  }

  return (
    <div className='bid-form'>
      <button onClick={handlegoback}>Go back</button>

      <form className="bid-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="productImage"
          placeholder="Image URL"
          value={formData.productImage}
          onChange={handleChange}
        />
        <input
          type="number"
          name="minBid"
          placeholder="Minimum Bid"
          value={formData.minBid}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
        <p>Current Bid: {formData.minBid}</p> 

        <label>
          <span>Auction Status:</span>
          <select name="auctionStatus" value={formData.auctionStatus} onChange={handleChange}>
            <option value="live">Live</option>
            <option value="upcoming">Upcoming</option>
            <option value="expired">Expired</option>
          </select>
        </label>

        {error && <p className="error-message">{error}</p>}
        <button type="submit">{location.state && location.state.bid ? 'Update Bid' : 'Add Bid'}</button>
      </form>
    </div>
  );
};

export default BidForm;
