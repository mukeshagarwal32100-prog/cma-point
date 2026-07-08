import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      setError('Please complete your shipping address');
      return false;
    }
    if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
      setError('Please enter valid payment information');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Order placed successfully!');
      // Redirect to order confirmation or home
      navigate('/');
    } catch (err) {
      setError('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="checkout-form">
        <fieldset>
          <legend>Contact Information</legend>
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </fieldset>

        <fieldset>
          <legend>Shipping Address</legend>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="text"
            name="address"
            placeholder="Street Address *"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <div className="form-row">
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State *"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code *"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <legend>Payment Information</legend>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number *"
            value={formData.cardNumber}
            onChange={handleChange}
            pattern="[0-9]{16}"
            maxLength="16"
            required
          />
          <div className="form-row">
            <input
              type="text"
              name="cardExpiry"
              placeholder="MM/YY *"
              value={formData.cardExpiry}
              onChange={handleChange}
              pattern="[0-9]{2}/[0-9]{2}"
              maxLength="5"
              required
            />
            <input
              type="text"
              name="cardCVC"
              placeholder="CVC *"
              value={formData.cardCVC}
              onChange={handleChange}
              pattern="[0-9]{3,4}"
              maxLength="4"
              required
            />
          </div>
        </fieldset>

        <button type="submit" className="checkout-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
