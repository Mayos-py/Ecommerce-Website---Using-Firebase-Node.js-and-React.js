import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import UserIndex from './components/user/UserIndex.jsx';
import AdminHome from './components/admin/AdminHome.jsx';
import ShoppingCart from './components/user/ShoppingCart.jsx';
import UserProfile from './components/user/UserProfile.jsx';
import AddProductForm from './components/admin/AddProductForm.jsx';

const App = () => {

  return (
    <Router>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={<UserIndex/>} />
      <Route path="/adminHome" element={<AdminHome/>} />
      <Route path="/cart" element={<ShoppingCart/>} />
      <Route path="/profile" element={<UserProfile/>} />
      <Route path="/addProduct" element={<AddProductForm/>} />
      <Route path="/" element={<SignIn />}>
      </Route>
    </Routes>
  </Router>
  );
  }
export default App
