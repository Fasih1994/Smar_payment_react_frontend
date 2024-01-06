// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import CheckoutForm from './components/CheckoutForm';
import Login from './components/Login';
import SuccessPage from './components/Success';
import CanceledPage from './components/CanceledPage';

const stripePromise = loadStripe('pk_test_51IGsI9BBQrdZktwmBogvTTtFYpo8PZdSTHYPW8ZiL48GZ0Jp6kXQ0rNCCOP6Wyfd2rLaYMsVr8teoyYS4l987anS00ixnVq1x3');

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    // You may store the token in state or localStorage for future requests
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={
            isLoggedIn ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            ) : (
              <Login onLogin={handleLogin} />
              )
            } />
          {/* Add other routes as needed */}
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/canceled" element={< CanceledPage/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
