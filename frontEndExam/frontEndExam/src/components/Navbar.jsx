// src/components/Navbar.jsx - VERSIONE COMPLETA UMANA 👥
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
    setIsOpen(false); // Chiudi la navbar dopo logout
  };

  const handleLinkClick = () => {
    // Chiudi la navbar su mobile quando clicchi un link
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`sidebar ${isOpen ? 'open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Header con logo */}
      <div className="sidebar-header">
        <img src={logo} alt="Monster Energy Logo" className="sidebar-logo" />
      </div>

      {/* Menu principale */}
      <ul className="sidebar-menu">
        <li>
          <Link to="/home" onClick={handleLinkClick}>
            <span className="menu-text">Home</span>
          </Link>
        </li>
        
        <li>
          <Link to="/prodotti" onClick={handleLinkClick}>
            <span className="menu-text">Prodotti</span>
          </Link>
        </li>
        
        <li>
          <Link to="/promo" onClick={handleLinkClick}>
            <span className="menu-text">Promozioni</span>
          </Link>
        </li>
        
        <li>
          <Link to="/recensioni" onClick={handleLinkClick}>
            <span className="menu-text">Recensioni</span>
          </Link>
        </li>

        <li>
          <Link to="/contatti" onClick={handleLinkClick}>
            <span className="menu-text">Contatti</span>
          </Link>
        </li>

        {/* Sezione autenticazione */}
        {!isAuthenticated && (
          <>
            <li>
              <Link to="/login" onClick={handleLinkClick}>
                <span className="menu-text">Accedi</span>
              </Link>
            </li>
            
            <li>
              <Link to="/register" onClick={handleLinkClick}>
                <span className="menu-text">Registrati</span>
              </Link>
            </li>
          </>
        )}

        {/* Menu admin */}
        {isAuthenticated && user?.role === 'admin' && (
          <li>
            <Link to="/admin" onClick={handleLinkClick}>
              <span className="menu-text">Admin Panel</span>
            </Link>
          </li>
        )}

        {/* Logout per utenti autenticati */}
        {isAuthenticated && (
          <li>
            <span 
              className="menu-item logout-item"
              onClick={handleLogout}
            >
              <span className="menu-text">Logout</span>
            </span>
          </li>
        )}
      </ul>

      {/* Info utente (solo se loggato) */}
      {isAuthenticated && user && (
        <div className="user-info">
          <img 
            src={logo} 
            alt="Avatar utente" 
            className="user-avatar"
          />
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      )}

      {/* Overlay per mobile */}
      {isOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Navbar;