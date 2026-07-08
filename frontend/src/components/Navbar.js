import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navbar.css';

function Navbar() {
  const cartItems = useSelector((state) => state.cart?.items || []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛍️ CMA Point
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link">
              🛒 Cart ({cartItems.length})
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
