import React, { useState, useEffect } from "react";
import { auth } from "../../config";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/UserIndex.css'; 

const UserIndex = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Sign Out Error:', error.message);
    }
  };

  const AddtoCart = async (product) => {
    try {
      const emailID = auth.currentUser.email;
      const response = await axios.post(`http://localhost:3000/cart/${emailID}`, {
        productId: product.id,
        name: product.name,
        price: product.price, 
      }); 

      if(response.data.success){
        alert("Added to cart!")
      }

      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const toCart = async () => {
    try {
      const emailID = auth.currentUser.email;
      navigate('/cart', { state: { emailID } }); 
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const userProfile = async () => {
    try {
      const emailID = auth.currentUser.email;
      navigate('/profile', { state: { emailID } }); 
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/home');
        if (response.data.success) {
          setProducts(response.data.user);
        } else {
          console.error('Error fetching data:', response.data.error);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div> 
     <div className="navbar">
      <div className="logo">Sumazon</div>
      <div className="nav">
        <button onClick={toCart} className="cart">Cart</button>
        <button onClick={handleSignOut} className="signOutButton">Sign Out</button>
        <button onClick={userProfile} className="cart">Profile</button>
      </div>
    </div>
    <div className="searchBarContainer">
      <label>Search Bar:</label>
      <input
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchBar"
      />
      </div>
      <ul className="ul">
        {filteredProducts.map((product) => (
          <li className="li" key={product.id}>
            <img src={product.imageUrl}/>
            <p className="productDetails">{product.name} - ${product.price}</p>
            <button className="ViewButton" onClick={() => handleViewProduct(product)}>View</button>
            {(product.quantity == 0) ? <div style={{color: "red"}}>Out Of Stock</div>: <button className="ViewButton" onClick={() => AddtoCart(product)}>Add To Cart!</button>}
            
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedProduct.name}</h3>
            <img src={selectedProduct.imageUrl} style={{ width: '300px', height: '300px' }}/>
            <p>Description: {selectedProduct.description}</p>
            <p>Price: ${selectedProduct.price}</p>
            <button className="ViewButton" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIndex;
