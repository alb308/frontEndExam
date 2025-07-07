// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions';
import logo from '../assets/logo.png';
import './navbar.css';

function Navbar() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div
      className={`sidebar ${isOpen ? 'open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/prodotti">Prodotti</Link></li>
        <li><Link to="/promo">Promozioni</Link></li>
        {!isAuthenticated && (
          <>
            <li><Link to="/login">Accedi</Link></li>
            <li><Link to="/register">Registrati</Link></li>
          </>
        )}
        {isAuthenticated && user?.role === 'admin' && (
          <li><Link to="/admin">Admin Panel</Link></li>
        )}
        {isAuthenticated && (
          <li onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</li>
        )}
      </ul>
      {isAuthenticated && user && (
        <div className="user-info">
          <img src={logo} alt="avatar" style={{ width: 30 }} />
          <span>{user.name}</span>
        </div>
      )}
    </div>
  );
}

export default Navbar;