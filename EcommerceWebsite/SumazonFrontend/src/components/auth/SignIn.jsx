import {signInWithEmailAndPassword} from "firebase/auth"
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import React, {useState} from "react";
import { auth } from "../../config";
import './style/login.css'

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();

        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
    
          const db = getDatabase();
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);
          
    
          if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("User data:", userData);
            if(userData.role == 'admin'){
              navigate('/adminHome')
            }else{
              navigate('/home')
            }
          } else {
            console.log("User data not found in the database");
          }
      } catch (error) {
          alert('Invalid email or password');
      }
        
       
    }

    return (
      <div className="sign-in-container">
        <form className="sign-in-form" onSubmit={login}>
            <h1 className="loginLabel">Log In</h1>
            <label className="signInLabel">Email: </label>
            <input type="email" className="signInInput" placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
            ></input>
            <br />
            <label className="signInLabel">Password: </label>
            <input type="password" className="signInInput" placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button className="signInButton" type="submit">Log In</button>

            <button className="signInButton" onClick={() => navigate('/signup')}>Sign Up</button>
        </form>
      </div>
    );
    }
  export default SignIn