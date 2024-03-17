import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/signUp.css';

const SignUp = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    mobileNumber: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/signup', user);
      console.log("Added");
      if(response.status == 200){
        navigate('/signin')
      }
    } catch (error) {
      console.error('Sign Up Error:', error.message);
    }
  };

  return (
    <div className="sign-up-container">
      <form>
        <h2>Sign Up</h2>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={user.password} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={user.firstName} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={user.lastName} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={user.address} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Mobile Number:</label>
          <input type="tel" name="mobileNumber" value={user.mobileNumber} onChange={handleInputChange} required/>
        </div>

        <button type="button" onClick={handleSignUp}>
          Sign Up
        </button>
      </form>
      <button onClick={() => navigate('/signin')}>Cancel</button>
    </div>
  );
};

export default SignUp;
