import React, { useState, useEffect } from "react";
import axios from 'axios';
import './style/cart.css';

import { useNavigate, useLocation } from 'react-router-dom';

const ShoppingCart = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation(); 
    const { emailID } = location.state;
    const [orderPlaced, setOrderPlaced] = useState(false);
    const navigate = useNavigate();
    const [number, setNumber] = useState(1);
    const [quantities, setQuantities] = useState([]);
    const [counters, setCounters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cart/${emailID}`);
        if (response.data.success) {
          setProducts(response.data.cartData);
          const quantities = await Promise.all(response.data.cartData.map(product => getQuantity(product.productId)));
          setQuantities(quantities);
          const counters = response.data.cartData.map(i => i = 1);
          setCounters(counters);
        } else {
          console.error('Error fetching data:', response.data.error);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, [orderPlaced]);


  const handlePlaceOrder = async (productId, userEmail, productName, quantity) => {
    try {
        const response = await axios.delete(`http://localhost:3000/cart/${userEmail}/${productId}`);
        await axios.patch(`http://localhost:3000/product/${productId}/${quantity}`)
        if (response.data.success) {
          setOrderPlaced(!orderPlaced);
          alert(`Order Placed, Your ${productName} is on the way `)
        } else {
          console.error('Error fetching data:', response.data.error);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
  };

  const getQuantity = async (productId) => {
    try {
        const response = await axios.get(`http://localhost:3000/product/${productId}`);
        if (response.data.success) {
            return response.data.quantity
        } else {
          console.error('Error fetching data:', response.data.error);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
  };

  const toHome = async () => {
    try {
      navigate('/home'); 
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const updateQuantity = (index, value) => {

    setCounters(prevCounters => {
        const newCounters = [...prevCounters];
        newCounters[index] = Math.max(1, Math.min(quantities[index], newCounters[index] + value));
        return newCounters;
      });
};

if (products.length === 0) {
  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Nothing is added to the cart.</p>
      <button onClick={toHome} className="cart">Go to Home</button>
    </div>
  );
}
  
return (
  <div className="cart-container">
    <h2 className="cart-heading">Shopping Cart</h2>
    {products.length === 0 ? (
      <div className="empty-cart">
        <p>Nothing is added to the cart.</p>
        <button onClick={toHome} className="cart">Go to Home</button>
      </div>
    ) : (
      <div>
        <button onClick={toHome} className="cart">Home</button>
        <ul className="cart-list">
          {products.map((product, index) => (
            <li key={product.productId} className="cart-item">
              <div className="product-details">
                <div className="product-name">{product.name}</div>
                <div className="product-price">${product.price}</div>
              </div>
              <div className="quantity-container">
                <button className="quantity-btn" onClick={() => updateQuantity(index, -1)}>-</button>
                <h3>{counters[index]}</h3>
                <button className="quantity-btn" onClick={() => updateQuantity(index, 1)}>+</button>
              </div>
              <div className="total-price">Total: ${Math.floor((product.price * counters[index]) * 100) / 100}</div>
              <div>
                <button className="order-btn" onClick={() => handlePlaceOrder(product.productId, product.userId, product.name, quantities[index] - counters[index])}>Place Order</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
};

export default ShoppingCart;



