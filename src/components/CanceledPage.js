import React from 'react';
import { useLocation } from 'react-router-dom';
import '../css/canceledpage.css';

const CanceledPage = () => {
  const location = useLocation();
  const errorMessage = location.state ? location.state : 'Unknown error occurred';
  return (
    <div className="canceled-page">
      <h2>Payment Canceled</h2>
      <p className="error-message">{errorMessage}</p>
    </div>
  );
};

export default CanceledPage;
