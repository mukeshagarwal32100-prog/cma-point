import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const cartItems = useSelector((state) => state.cart?.items || []);
  const dispatch = useDispatch();

  const handleRemove = (itemId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: itemId,
    });
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart">
      <h1>🛒 Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td className="product-name">{item.name}</td>
                    <td className="price">${item.price.toFixed(2)}</td>
                    <td className="quantity">{item.quantity}</td>
                    <td className="total">${(item.price * item.quantity).toFixed(2)}</td>
                    <td className="action">
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Shipping:</span>
              <span>${totalPrice > 50 ? '0.00' : '10.00'}</span>
            </div>
            <div className="summary-item">
              <span>Tax:</span>
              <span>${(totalPrice * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>${(totalPrice + (totalPrice > 50 ? 0 : 10) + (totalPrice * 0.1)).toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
