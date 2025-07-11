import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './promo.css';

function Promo() {
  const [cans, setCans] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/cans?_start=0&_end=12')
      .then(res => res.json())
      .then(data => setCans(data))
      .catch(() => {});
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      setMessage('Inserisci una email valida');
      return;
    }

    setMessage('✅ Iscrizione completata! Riceverai il codice sconto via email.');
    setEmail('');
    
    setTimeout(() => setMessage(''), 5000);
  };

  const limitedCans = cans.filter(can => can.limited);

  return (
    <div className="promo-page">
      <div className="promo-container">
        <div className="promo-hero">
          <h1>🔥 Promozioni Monster Energy</h1>
          <p>Offerte speciali e edizioni limitate</p>
        </div>

        <div className="promo-banner">
          <h2>🎯 OFFERTA DEL MESE</h2>
          <p className="promo-text">Sconto 15% su tutte le lattine Ultra!</p>
          <p className="promo-code">Codice: <strong>ULTRA15</strong></p>
        </div>

        <section className="simple-section">
          <h2>⭐ Edizioni Limitate Disponibili</h2>
          {limitedCans.length === 0 ? (
            <p className="no-items">Nessuna edizione limitata al momento</p>
          ) : (
            <div className="simple-grid">
              {limitedCans.slice(0, 6).map(can => (
                <div key={can.id} className="simple-can-card">
                  <img src={can.img} alt={can.nome} />
                  <h3>{can.nome}</h3>
                  <p className="can-meta">{can.category} • {can.year}</p>
                  <Link to={`/cans/${can.id}`} className="simple-btn">
                    Dettagli
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="newsletter-simple">
          <h2>📧 Resta Aggiornato</h2>
          <p>Iscriviti per ricevere offerte esclusive e novità!</p>
          
          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleNewsletterSubmit} className="simple-form">
            <input
              type="email"
              placeholder="La tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Iscriviti</button>
          </form>
          
          <div className="benefits">
            <p>✨ Vantaggi iscrizione:</p>
            <ul>
              <li>Sconti esclusivi fino al 20%</li>
              <li>Anteprime nuove lattine</li>
              <li>Inviti agli eventi Monster</li>
            </ul>
          </div>
        </section>

        <div className="cta-section">
          <h3>Vuoi vedere tutta la collezione?</h3>
          <Link to="/prodotti" className="cta-button">
            🥤 Esplora Tutti i Prodotti
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Promo;