// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/Homepage';
import MyBids from './components/MyBids';
import ErrorPage from './components/Errorpage';
import BidForm from './components/BidsForm';
import MyAddedBids from './components/Myaddedbids';
import UserProfile from './components/Userprofile';

const App = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/my-bids" element={isAuthenticated ? <MyBids /> : <Navigate to="/login" />} />
        <Route path="/create-bid" element={isAuthenticated ? <BidForm /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />

        <Route path="/my-added-bids" element={isAuthenticated ? <MyAddedBids /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
