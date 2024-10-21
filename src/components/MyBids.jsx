
import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userBidsAtom } from '../store/bidsStore'; 
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';

const MyBids = () => {
  const [userBids, setUserBids] = useAtom(userBidsAtom);
  const [timers, setTimers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = userBids.reduce((acc, bid) => {
        const timeLeft = new Date(bid.endDate) - new Date();
        if (timeLeft <= 0) {
          bid.auctionStatus = 'expired';
        }
        acc[bid.createdBy] = Math.max(timeLeft, 0);
        return acc;
      }, {});
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [userBids]);

  const cancelBid = (bidCreatedBy) => {
    setUserBids(userBids.filter((bid) => bid.createdBy !== bidCreatedBy));
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="home-container">
      <h2>My Bids</h2>
      <button className="back-button" onClick={() => navigate('/home')}>Go Back to Home</button>

      {userBids.length > 0 ? (
        <div className="bids-container">
          {userBids.map((bid) => (
            <div key={bid.createdBy} className="bid-card">
              <img
                src={bid.productImage}
                alt={bid.productName}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              />
              <div className="bid-info">
                <p>{bid.productName}</p>
                <p>Status: {bid.auctionStatus}</p>
                <p>Current Bid: ${bid.currentBid}</p>
                <p>Ends in: {formatTime(timers[bid.createdBy] || 0)}</p>
                <button onClick={() => cancelBid(bid.createdBy)}>Cancel Bid</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No bids placed yet.</p>
      )}
    </div>
  );
};

export default MyBids;
