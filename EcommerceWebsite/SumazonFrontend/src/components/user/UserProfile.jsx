import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './style/UserProfile.css'

const UserProfile = () => {
  const location = useLocation();
  const { emailID } = location.state;
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: '',
    lastName: '',
    address: '',
    mobileNumber: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/userProfile/${emailID}`);
        if (response.data.success) {
          setUsers(response.data.user);
        } else {
          console.error('Error fetching data:', response.data.error);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, [emailID]);

  const toHome = async () => {
    try {
      navigate('/home');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditedUser({
      firstName: users[0].firstName,
      lastName: users[0].lastName,
      address: users[0].address,
      mobileNumber: users[0].mobileNumber,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/userProfile/${emailID}`, editedUser);
      if (response.data.success) {
        setUsers([editedUser]);
        setEditMode(false);
      } else {
        console.error('Error updating data:', response.data.error);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <button onClick={toHome} className="profile-button-home">Home</button>
      <button onClick={handleEditClick} disabled={editMode} className="profile-button-edit">Edit</button>
      <ul ul className={editMode ? "edit-form-container" : "profile-info-container"}>
        {users.map((user) => (
          <li key={user.emailID} className="profile-info-item">
            <div className="profile-picture">
            <img src = 'https://gravatar.com/avatar/f09bb6f9641059e4910fc5bc1fff622d?s=200&d=mp&r=x' alt="Profile" />
            </div>
            <div>
              {editMode ? (
                <div className="edit-form">
                <label>First Name: </label>
                  <input type="text" name="firstName" value={editedUser.firstName} onChange={handleInputChange}/>
                  <label>Last Name: </label>
                  <input type="text" name="lastName" value={editedUser.lastName} onChange={handleInputChange}/>
                  <label>Address: </label>
                  <input type="text" name="address" value={editedUser.address} onChange={handleInputChange}/>
                  <label>Mobile Number: </label>
                  <input type="text" name="mobileNumber" value={editedUser.mobileNumber} onChange={handleInputChange}/>
                </div>
              ) : (
                <>
                  <h3>
                    {user.firstName} {user.lastName}
                  </h3>
                  <h3>Address: {user.address}</h3>
                  <h3>Mobile Number: {user.mobileNumber}</h3>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      {editMode && (
        <>
          <button onClick={handleCancelEdit} className="profile-button-cancel">Cancel</button>
          <button onClick={handleSaveEdit} className="profile-button-save">Save</button>
        </>
      )}
    </div>
  );
};

export default UserProfile;
