import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock products - Replace with API call
    const mockProducts = [
      { id: 1, name: 'Premium Headphones', price: 129.99, image: 'https://via.placeholder.com/300?text=Headphones' },
      { id: 2, name: 'Wireless Mouse', price: 49.99, image: 'https://via.placeholder.com/300?text=Mouse' },
      { id: 3, name: 'USB-C Cable', price: 19.99, image: 'https://via.placeholder.com/300?text=Cable' },
      { id: 4, name: 'Phone Stand', price: 29.99, image: 'https://via.placeholder.com/300?text=Stand' },
      { id: 5, name: 'Portable Charger', price: 39.99, image: 'https://via.placeholder.com/300?text=Charger' },
      { id: 6, name: 'Screen Protector', price: 9.99, image: 'https://via.placeholder.com/300?text=Protector' },
    ];
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to CMA Point</h1>
        <p>Discover amazing products at great prices</p>
        <button className="hero-btn">Shop Now</button>
      </div>

      <div className="featured-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <h3>{product.name}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
              <Link to={`/product/${product.id}`} className="view-btn">
                View Details
              </Link>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose CMA Point?</h2>
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🚚</span>
            <h3>Fast Shipping</h3>
            <p>Free shipping on orders over $50</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🛡️</span>
            <h3>Secure Payment</h3>
            <p>100% secure payment processing</p>
          </div>
          <div className="feature">
            <span className="feature-icon">↩️</span>
            <h3>Easy Returns</h3>
            <p>30-day money-back guarantee</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <h3>24/7 Support</h3>
            <p>Chat with our support team anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
