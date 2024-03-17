import React, { useState, useEffect } from "react";
import axios from 'axios';
import { auth } from "../../config";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './style/AdminHome.css'

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleInputChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(editedProduct);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Product</h2>
        <img src={editedProduct.imageUrl} />
        <div>
        <label>Name:</label>
        <input type="text" name="name" value={editedProduct.name} onChange={handleInputChange} />
        <label>Price:</label>
        <input type="text" name="price" value={editedProduct.price} onChange={handleInputChange} />
        <label>Quantity:</label>
        <input type="text" name="quantity" value={editedProduct.quantity} onChange={handleInputChange} />
        </div>
        <div>
          <button className="admin-submit-button" onClick={handleSubmit}>Submit</button>
          <button className="admin-cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const AdminHome = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/home');
        if (response.data.success) {
          setProducts(response.data.user);
          setRefresh(false);
        } else {
          console.error('Error fetching data:', response.data.error);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, [refresh]);

  const handleUpdate = (product) => {
    setSelectedProduct(product);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
  };

  const handleDelete = async (productId) =>  {
    try {
      const response = await axios.delete(`http://localhost:3000/product/${productId}`);
      if (response.data.success) {
        setRefresh(true);
        alert("Product Deleted")
      } else {
        console.error('Error fetching data:', response.data.error);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleUpdateSubmit = async (updatedProduct) => {
    try {
      const response = await axios.patch(`http://localhost:3000/product/${updatedProduct.id}`, updatedProduct);
  
      if (response.data.success) {
        setRefresh(true);
        alert("Product Updated");
      } else {
        console.error('Error updating product:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating product:', error.message);
    }
  };
  

  const handleAdd = () => {
    navigate('/addProduct')
  };


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Sign Out Error:', error.message);
    }
  };

  return (
    <div className="admin-home-container">
      <div className="admin-nav">
      <button onClick={handleAdd} className="add-new-entry-button">Add New Entry</button>
      <button onClick={handleSignOut} className="admin-signOutButton">Sign Out</button>
      </div>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <img src={product.imageUrl} alt={product.name} className="product-image"/>
            <div className="admin-product-details">
              <h3>{product.name} - ${product.price}</h3>
              <h3>Quantity: {product.quantity}</h3>
            </div>
            <div className="product-actions">
              <button onClick={() => handleUpdate(product)}>Update</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={handleModalClose}
          onUpdate={handleUpdateSubmit}
        />
      )}
    </div>
  );
};

export default AdminHome;
