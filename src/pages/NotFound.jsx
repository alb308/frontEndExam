import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-animation">
          <div className="can-broken">
            <div className="can-top"></div>
            <div className="can-body">
              <span className="can-text">404</span>
            </div>
            <div className="can-bottom"></div>
          </div>
          <div className="energy-spill">
            <div className="splash splash-1"></div>
            <div className="splash splash-2"></div>
            <div className="splash splash-3"></div>
          </div>
        </div>

        <div className="error-content">
          <h1 className="error-title">Oops! Lattina non trovata!</h1>
          <p className="error-message">
            Sembra che la pagina che stai cercando sia stata bevuta da qualcun altro!
          </p>
          <p className="error-submessage">
            Non preoccuparti, ci sono ancora tante lattine Monster Energy da scoprire.
          </p>

          <div className="error-actions">
            <Link to="/" className="home-btn">
              Torna alla Home
            </Link>
            <Link to="/prodotti" className="catalog-btn">
              Vai al Catalogo
            </Link>
          </div>

          <div className="error-suggestions">
            <h3>Potresti essere interessato a:</h3>
            <ul>
              <li><Link to="/">Torna alla Home</Link></li>
              <li><Link to="/prodotti">Esplora tutte le lattine</Link></li>
            </ul>
          </div>
        </div>

        <div className="monster-quote">
          <p>"Unleash the Beast... ma non in questa pagina!"</p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;