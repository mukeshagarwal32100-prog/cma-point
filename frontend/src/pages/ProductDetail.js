import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  // Mock product data - Replace with API call
  const product = {
    id: id,
    name: 'Premium Product',
    price: 99.99,
    description: 'This is a high-quality product that meets all your needs. It features excellent durability, stylish design, and reliable performance.',
    image: 'https://via.placeholder.com/400?text=Product',
    inStock: true,
    rating: 4.5,
    reviews: 128,
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity),
      },
    });
    alert('Added to cart!');
  };

  return (
    <div className="product-detail">
      <div className="product-info">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-content">
          <h1>{product.name}</h1>
          
          <div className="rating">
            <span className="stars">⭐ {product.rating}</span>
            <span className="reviews">({product.reviews} reviews)</span>
          </div>

          <p className="price">${product.price.toFixed(2)}</p>
          
          <p className="description">{product.description}</p>

          <div className="product-features">
            <h3>Key Features:</h3>
            <ul>
              <li>High-quality materials</li>
              <li>Excellent durability</li>
              <li>Modern design</li>
              <li>Easy to use</li>
            </ul>
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <input 
              type="number" 
              min="1" 
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <button 
            className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <div className="product-meta">
            <div className="meta-item">
              <span className="label">SKU:</span>
              <span className="value">PRD-{id}</span>
            </div>
            <div className="meta-item">
              <span className="label">Category:</span>
              <span className="value">Electronics</span>
            </div>
            <div className="meta-item">
              <span className="label">Stock:</span>
              <span className="value">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        <p className="no-reviews">No reviews yet. Be the first to review!</p>
      </div>
    </div>
  );
}

export default ProductDetail;
