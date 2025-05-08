import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface HeaderProps {
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
  return (
    <header className="header">
      <img src={logo} alt="Monster Energy" className="logo" />
      <nav className="nav">
        <Link to="/">Unleashed</Link>
        <Link to="/prodotti">Prodotti</Link>
        <Link to="/promo">Promozioni</Link>
      </nav>
      <button className="theme-toggle" onClick={toggleTheme}>🌓</button>
    </header>
  );
};

export default Header;
