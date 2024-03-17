import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../config';
import {ref, uploadBytes} from 'firebase/storage';
import './style/AddProductForm.css';

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

  const [imageUpload, setImageUpload] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
        const response = await axios.post('http://localhost:3000/product', product);
        const imageRef = ref(storage, `/${response.data.docId + ".jpg"}`)
        uploadBytes(imageRef, imageUpload).then(()=>{
        alert("Product Added!!")
        navigate('/adminHome')
        });

    } catch (error) {
      console.error('Add Product Error:', error.message);
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={product.name} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" name="description" value={product.description} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Price:</label>
        <input type="number" name="price" value={product.price} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Quantity:</label>
        <input type="number" name="quantity" value={product.quantity} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" name="image" onChange={(event) => {setImageUpload(event.target.files[0])}} required />
      </div>
      <button className= 'product-submit' type="button" onClick={handleAddProduct}>Submit</button>
      <button className ='product-cancel' onClick={() => navigate('/adminHome')}>Cancel</button>
    </div>
  );
};

export default AddProductForm;
