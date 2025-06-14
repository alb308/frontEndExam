import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import logo from '../assets/logo.png';
import './navbar.css';

function Navbar() {
  const { user } = useUser();

  return (
    <div className="sidebar open">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/prodotti">Prodotti</Link></li>
        <li><Link to="/promo">Promozioni</Link></li>
        {!user && (
          <>
            <li><Link to="/login">Accedi</Link></li>
            <li><Link to="/register">Registrati</Link></li>
          </>
        )}
      </ul>
      {user && (
        <div className="user-info">
          <img src={logo} alt="avatar" style={{ width: 30 }} />
          <span>{user.name}</span>
        </div>
      )}
    </div>
  );
}

export default Navbar;
