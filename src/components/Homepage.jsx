
import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { bidsAtom, userBidsAtom, fetchBids } from '../store/bidsStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Homepage.css';
import { userAddedBidsAtom } from '../store/bidsStore';

const HomePage = () => {
  const [bids, setBids] = useAtom(bidsAtom);
  const [userBids, setUserBids] = useAtom(userBidsAtom);
  const [addedBids, setAddedBids] = useAtom(userAddedBidsAtom); 

  const [timers, setTimers] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [filterBids, setFilterBids] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBids(setBids);
    };
    fetchData();
  }, [setBids]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = bids.reduce((acc, bid) => {
        const timeLeft = new Date(bid.endDate) - new Date();
        if (timeLeft <= 0) {
          bid.auctionStatus = 'expired';
        }
        acc[bid.createdByUser] = Math.max(timeLeft, 0);
        return acc;
      }, {});
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [bids]);

  const placeBid = (bidCreatedBy) => {
    const bidAmount = parseFloat(prompt('Enter your bid amount:'));
    const bidToUpdate = bids.find((bid) => bid.createdByUser === bidCreatedBy);

    if (!isNaN(bidAmount) && bidAmount > bidToUpdate.currentBid) {
      const updatedBids = bids.map((bid) =>
        bid.createdByUser === bidCreatedBy ? { ...bid, userBid: bidAmount, currentBid: bidAmount } : bid
      );
      setBids(updatedBids); 
      setUserBids([...userBids, updatedBids.find((bid) => bid.createdByUser === bidCreatedBy)]);
    } else {
      alert('Bid must be greater than the current bid!');
    }
  };

  const currentUser = localStorage.getItem('username');

  // Update addedBids based on currentUser
  useEffect(() => {
    const userAddedBids = bids.filter(bid => bid.createdByUser === currentUser);
    setAddedBids(userAddedBids);
  }, [bids, currentUser, setAddedBids]);

  const removeBid = async (bidId) => {
    try {
      console.log(`Attempting to remove bid with ID: ${bidId}`); 
      const response = await axios.delete(`http://localhost:5000/api/bids/${bidId}`);
      console.log('Response:', response); 

      
      setAddedBids(addedBids.filter((bid) => bid._id !== bidId)); 
     
      setUserBids(userBids.filter((bid) => bid._id !== bidId));
     
    } catch (error) {
      console.error('Error removing bid:', error);
    }
  };



  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const filterData = bids.filter((value) =>
      value.productName.toLowerCase().includes(search.toLowerCase()) &&
      value.createdByUser !== currentUser 
    );
    setFilterBids(filterData);
  }, [search, bids, currentUser]);

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2>Home</h2>
        <input placeholder='search...' onChange={handleSearch} />
        <div className="nav-buttons">
          <button onClick={() => navigate('/my-bids')}>My Bids</button>
          <button onClick={() => navigate('/my-added-bids')}>My Added Bids</button>
          <button onClick={() => navigate('/create-bid')}>Create New Bid</button>
          <button onClick={() => navigate('/profile')}>View Profile</button>
          <button onClick={() => navigate('/login')}>Logout</button>
         
        </div>
      </nav>

      <h3>Available Bids</h3>
      <div className="bids-container">
        {filterBids.map((bid) => (
          <div key={bid.createdByUser} className="bid-card">
            <img
              src={bid.productImage}
              alt="Product"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
            />
            <div className="bid-info">
              <p>{bid.productName}</p>
              <p>Status: {bid.auctionStatus}</p>
              <p>Minimum Bid: ${bid.minBid}</p>
              <p>Current Bid: ${bid.currentBid}</p>
              <p>Ends in: {formatTime(timers[bid.createdByUser] || 0)}</p>
              {bid.userBid ? (
                <button onClick={() => removeBid(bid.createdByUser)}>Remove Bid</button>
              ) : (
                <button onClick={() => placeBid(bid.createdByUser)}>Bid Now</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h3>Your Added Bids</h3>
      <div className="bids-container">
        {addedBids.length > 0 ? (
          addedBids.map((bid) => (
            <div key={bid._id} className="bid-card">
              <img
                src={bid.productImage}
                alt={bid.productName}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              />
              <div className="bid-info">
                <p>{bid.productName}</p>
                <p>Status: {bid.auctionStatus}</p>
                <p>Current Bid: ${bid.currentBid}</p>
                <button onClick={() => removeBid(bid._id)}>Remove Bid</button>
                <button onClick={() => navigate('/create-bid', { state: { bid } })}>Update Bid</button>
              </div>
            </div>
          ))
        ) : (
          <p>No bids added yet.</p>
        )}

      </div>
    </div>
  );
};

export default HomePage;
