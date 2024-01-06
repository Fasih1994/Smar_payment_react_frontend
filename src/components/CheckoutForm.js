import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import ApiService from "../api";
import '../css/checkoutform.css';

const CheckoutForm = () => {
  const [error, setError] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState('basic'); // Default to 'basic'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  // Handle real-time validation errors from the CardElement.
  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }

  }

  // Handle form submission.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || isSubmitting) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setIsSubmitting(true);

    const card = elements.getElement(CardElement);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: card
      });

      ApiService.saveStripeInfo({
        payment_method_id: paymentMethod.id,
        package_name: subscriptionPlan
      })
        .then(response => {

          if (!error) {
            // If there is no error, redirect to the success page
            navigate('/success'); // Replace '/success' with your actual success page path
          }
        })
        .catch(error => {
          console.log(error.response.status)
          console.log(error.response.data.message)
          const message = error.response.data.message;
          const colonIndex = message.indexOf(':');

          // Check if there is a colon in the message
          const reason = colonIndex !== -1 ? message.substring(colonIndex + 2) : null;

          navigate('/canceled', { state: reason || 'Unknown error occurred' });
        });



      if (error) {
        setError(error.message);
      } else {
        // Handle successful payment, e.g., send paymentMethod.id to your server.
        console.log("PaymentMethod:", paymentMethod);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="form-group">
        <label htmlFor="subscription-plan">Choose a Subscription Plan:</label>
        <select
          id="subscription-plan"
          name="subscriptionPlan"
          value={subscriptionPlan}
          onChange={(event) => setSubscriptionPlan(event.target.value)}
        >
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="premium">Premium</option>
          <option value="another">Wrong Choice</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="card-element">Enter your Credit or Debit Card:</label>
        <CardElement id="card-element" onChange={handleChange} />
        <div className="card-errors" role="alert">{error}</div>
      </div>
      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Payment'}
      </button>
    </form>
  );


};

export default CheckoutForm;
