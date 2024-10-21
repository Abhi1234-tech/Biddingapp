// src/components/ErrorPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Errorpage.css"

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h2>Error 404</h2>
      <p>There is something wrong</p>
      <button onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );
};

export default ErrorPage;
