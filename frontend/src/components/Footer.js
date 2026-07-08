import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About CMA Point</h3>
          <p>Your trusted online shopping destination for quality products at affordable prices.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📧 Email: info@cmapoint.com</p>
          <p>📱 Phone: +1 (555) 123-4567</p>
          <p>📍 Address: 123 Shopping Street, City, Country</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} CMA Point. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
