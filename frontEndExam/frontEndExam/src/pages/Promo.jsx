// src/pages/Promo.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './promo.css';

function Promo() {
  const [allCans, setAllCans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newsletterForm, setNewsletterForm] = useState({
    email: '',
    name: '',
    preferences: {
      newProducts: true,
      limitedEditions: true,
      discounts: true,
      events: false
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // Carica tutte le lattine all'avvio
  useEffect(() => {
    const fetchAllCans = async () => {
      try {
        setLoading(true);
        // Usa la stessa strategia degli altri componenti
        const response = await fetch('http://localhost:3001/cans?_start=0&_end=1000');
        const data = await response.json();
        
        console.log(`✅ Promo - Lattine caricate: ${data.length}`);
        setAllCans(data);
        setError(null);
      } catch (err) {
        console.error('❌ Errore nel caricamento promo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCans();
    generatePromoCode();
  }, []);

  const generatePromoCode = () => {
    const codes = ['MONSTER10', 'ENERGY15', 'BEAST20', 'POWER25', 'ULTRA30'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    setPromoCode(randomCode);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newsletterForm.email.trim()) {
      newErrors.email = 'Email è obbligatoria';
    } else if (!validateEmail(newsletterForm.email)) {
      newErrors.email = 'Formato email non valido';
    }
    
    if (!newsletterForm.name.trim()) {
      newErrors.name = 'Nome è obbligatorio';
    } else if (newsletterForm.name.length < 2) {
      newErrors.name = 'Nome deve avere almeno 2 caratteri';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const newsletterData = {
        ...newsletterForm,
        id: Date.now(),
        dateSubscribed: new Date().toISOString(),
        promoCode: promoCode,
        status: 'active'
      };
      
      const response = await fetch('http://localhost:3001/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsletterData),
      });
      
      if (response.ok) {
        setSubmitMessage(`Iscrizione completata! Il tuo codice sconto è: ${promoCode}`);
        setNewsletterForm({
          email: '',
          name: '',
          preferences: {
            newProducts: true,
            limitedEditions: true,
            discounts: true,
            events: false
          }
        });
        generatePromoCode();
      } else {
        setSubmitMessage('Errore nell\'iscrizione alla newsletter');
      }
    } catch (error) {
      console.error('Errore:', error);
      setSubmitMessage('Errore di connessione');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsletterForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setNewsletterForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked
      }
    }));
  };

  // Filtra le lattine limited edition e in promozione
  const limitedEditionCans = allCans.filter(can => can.limited || can.category === 'Limited Edition' || can.category === 'Special Edition' || can.category === 'Reserve');
  const promoCans = allCans.filter(can => can.year >= 2023 || can.category === 'Zero Sugar' || can.category === 'Ultra');

  if (loading) return (
    <div className="promo-page">
      <div className="promo-container">
        <div style={{ textAlign: 'center', color: '#00ff00', padding: '2rem' }}>
          ⚡ Caricamento promozioni Monster Energy...
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="promo-page">
      <div className="promo-container">
        <div style={{ textAlign: 'center', color: '#ff0000', padding: '2rem' }}>
          ❌ Errore: {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="promo-page">
      <div className="promo-container">
        <div className="promo-hero">
          <h1>🔥 Promozioni Monster Energy</h1>
          <p>Scopri le offerte esclusive e le edizioni limitate</p>
        </div>
        
        <div className="promo-content">
          <div className="promo-sections">
            <section className="limited-edition-section">
              <h2>🌟 Edizioni Limitate</h2>
              <p>Lattine esclusive per veri collezionisti</p>
              {limitedEditionCans.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#ccc', padding: '2rem' }}>
                  📭 Nessuna edizione limitata disponibile al momento
                </div>
              ) : (
                <div className="cans-grid">
                  {limitedEditionCans.slice(0, 6).map(can => (
                    <div key={can.id} className="can-card limited">
                      <div className="can-badge">Limited</div>
                      <img 
                        src={can.img} 
                        alt={can.nome}
                        onError={(e) => {
                          e.target.src = '/lattine/placeholder.jpg';
                        }}
                      />
                      <h3>{can.nome}</h3>
                      <p>{can.category} • {can.year}</p>
                      <p className="can-country">{can.country}</p>
                      <Link to={`/cans/${can.id}`} className="view-details">
                        Dettagli
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            <section className="promo-deals-section">
              <h2>💰 Offerte Speciali</h2>
              <p>I migliori prodotti Monster Energy in promozione</p>
              {promoCans.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#ccc', padding: '2rem' }}>
                  📭 Nessuna promozione disponibile al momento
                </div>
              ) : (
                <div className="cans-grid">
                  {promoCans.slice(0, 6).map(can => (
                    <div key={can.id} className="can-card promo">
                      <div className="can-badge promo-badge">-15%</div>
                      <img 
                        src={can.img} 
                        alt={can.nome}
                        onError={(e) => {
                          e.target.src = '/lattine/placeholder.jpg';
                        }}
                      />
                      <h3>{can.nome}</h3>
                      <p>{can.category} • {can.year}</p>
                      <p className="can-country">{can.country}</p>
                      <div className="price-info">
                        <span className="old-price">€2.50</span>
                        <span className="new-price">€2.12</span>
                      </div>
                      <Link to={`/cans/${can.id}`} className="view-details">
                        Dettagli
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
          
          <div className="newsletter-section">
            <div className="newsletter-container">
              <h2>📧 Newsletter Esclusiva</h2>
              <p>Iscriviti per ricevere offerte speciali e novità in anteprima</p>
              
              <div className="current-promo">
                <h3>🎁 Offerta del giorno</h3>
                <p>Codice sconto: <strong>{promoCode}</strong></p>
                <p>Valido fino a mezzanotte - 15% di sconto!</p>
              </div>
              
              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="form-group">
                  <label>Nome *</label>
                  <input
                    type="text"
                    name="name"
                    value={newsletterForm.name}
                    onChange={handleInputChange}
                    placeholder="Il tuo nome"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newsletterForm.email}
                    onChange={handleInputChange}
                    placeholder="La tua email"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label>Preferenze Newsletter</label>
                  <div className="preferences-grid">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="newProducts"
                        checked={newsletterForm.preferences.newProducts}
                        onChange={handlePreferenceChange}
                      />
                      Nuovi prodotti
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="limitedEditions"
                        checked={newsletterForm.preferences.limitedEditions}
                        onChange={handlePreferenceChange}
                      />
                      Edizioni limitate
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="discounts"
                        checked={newsletterForm.preferences.discounts}
                        onChange={handlePreferenceChange}
                      />
                      Sconti e promozioni
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="events"
                        checked={newsletterForm.preferences.events}
                        onChange={handlePreferenceChange}
                      />
                      Eventi e contest
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting ? 'Iscrizione in corso...' : '🚀 Iscriviti ora'}
                </button>
                
                {submitMessage && (
                  <div className={`submit-message ${submitMessage.includes('completata') ? 'success' : 'error'}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
              
              <div className="newsletter-benefits">
                <h4>Vantaggi dell'iscrizione:</h4>
                <ul>
                  <li>✨ Accesso anticipato alle nuove edizioni</li>
                  <li>🎯 Offerte esclusive per iscritti</li>
                  <li>🏆 Partecipazione a contest esclusivi</li>
                  <li>📱 Notifiche per eventi Monster Energy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promo;