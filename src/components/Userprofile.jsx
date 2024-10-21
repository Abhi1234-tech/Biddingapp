
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Userprofile.css';

const UserProfile = () => {
  const username = localStorage.getItem('username') || 'Guest';
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <img src="https://via.placeholder.com/150" alt="User" className="user-image" />
      <p>Username: {username}</p>
      <button onClick={() => navigate('/home')}>Go Back</button>
    </div>
  );
};

export default UserProfile;
