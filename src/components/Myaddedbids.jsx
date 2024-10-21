
import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAddedBidsAtom } from '../store/bidsStore'; 
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';

const MyAddedBids = () => {
  const [addedBids] = useAtom(userAddedBidsAtom);
  const [timers, setTimers] = useState({});
  const navigate = useNavigate();

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = addedBids.reduce((acc, bid) => {
        const timeLeft = new Date(bid.endDate) - new Date();
        acc[bid.createdBy] = Math.max(timeLeft, 0);
        return acc;
      }, {});
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [addedBids]);

  return (
    <div className="my-added-bids-container">
      <h1 className="my-added-bids-title">My Added Bids</h1>
      {addedBids.length === 0 ? (
        <p className="no-bids-message">You haven't added any bids yet.</p>
      ) : (
        <div>
          {addedBids.map((bid) => (
            <div key={bid.createdBy} className="bid-card">
              <div className="bid-info">
                <p>{bid.productName}</p>
                <p className="bid-timer">Ends in: {formatTime(timers[bid.createdBy] || 0)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="back-button" onClick={() => navigate('/home')}>Back to Homepage</button>
    </div>
  );
};

export default MyAddedBids;
