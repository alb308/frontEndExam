// src/components/CaroselloLattine.jsx - VERSIONE ULTRA FIGA 🔥
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import "./CaroselloLattine.css";

function CaroselloLattine() {
  const [cans, setCans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCan, setHoveredCan] = useState(null);

  useEffect(() => {
    const fetchAllCans = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/cans?_start=0&_end=1000');
        const data = await response.json();
        
        console.log('✅ Carosello - Lattine caricate:', data.length);
        setCans(data);
        setError(null);
      } catch (err) {
        console.error('❌ Errore nel caricamento lattine:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCans();
  }, []);

  const settings = {
  dots: true,
  infinite: cans.length > 6,
  speed: 500,
  slidesToShow: Math.min(6, cans.length),
  slidesToScroll: 3,
  autoplay: true,              // ✅ Autoplay attivo
  autoplaySpeed: 3000,         // ✅ Cambia ogni 3 secondi
  pauseOnHover: true,          // ✅ Si ferma quando passi il mouse
  pauseOnFocus: true,          // ✅ Si ferma quando clicchi
  arrows: true,                // ✅ Frecce visibili
  responsive: [
    {
      breakpoint: 1024,
      settings: { 
        slidesToShow: Math.min(4, cans.length), 
        slidesToScroll: 2,
        autoplay: true,          // ✅ Autoplay anche responsive
        autoplaySpeed: 3000
      },
    },
    {
      breakpoint: 768,
      settings: { 
        slidesToShow: Math.min(2, cans.length), 
        slidesToScroll: 1,
        autoplay: true,          // ✅ Autoplay anche mobile
        autoplaySpeed: 3500      // ✅ Più lento su mobile
      },
    },
  ],
};

  if (loading) return (
    <div className="carosello-container">
      <div className="loading-container-carousel">
        <div className="monster-spinner"></div>
        <h3 className="loading-text">⚡ Caricamento collezione Monster Energy...</h3>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="carosello-container">
      <div className="error-container-carousel">
        <div className="error-icon">💥</div>
        <h3>Ops! Qualcosa è andato storto</h3>
        <p>❌ {error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          🔄 Riprova
        </button>
      </div>
    </div>
  );

  return (
    <div className="carosello-container">
      {/* Header figo con effetti */}
      <div className="carousel-header">
        <h2 className="carousel-title">
          <span className="title-icon">🥤</span>
          <span className="title-text">LA MIA COLLEZIONE</span>
          <span className="title-highlight">MONSTER ENERGY</span>
        </h2>
        <div className="collection-stats">
          <div className="stat-item">
            <span className="stat-number">{cans.length}</span>
            <span className="stat-label">Lattine Totali</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{cans.filter(can => can.limited).length}</span>
            <span className="stat-label">Edizioni Limitate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{new Set(cans.map(can => can.category)).size}</span>
            <span className="stat-label">Categorie</span>
          </div>
        </div>
      </div>
      
      {cans.length === 0 ? (
        <div className="empty-collection">
          <div className="empty-icon">📭</div>
          <h3>Collezione vuota</h3>
          <p>Nessuna lattina Monster Energy trovata</p>
        </div>
      ) : (
        <div className="carousel-wrapper">
          <Slider {...settings}>
            {cans.map((latta, index) => (
              <div key={latta.id} className="latta-slide">
                <Link 
                  to={`/cans/${latta.id}`} 
                  className="latta-card"
                  onMouseEnter={() => setHoveredCan(latta.id)}
                  onMouseLeave={() => setHoveredCan(null)}
                >
                  {/* Badge edizione limitata */}
                  {latta.limited && (
                    <div className="limited-badge-floating">
                      <span>⭐</span>
                      <span>LIMITED</span>
                    </div>
                  )}
                  
                  {/* Badge categoria */}
                  <div className="category-badge">
                    {latta.category}
                  </div>
                  
                  {/* Container immagine con effetti */}
                  <div className="latta-image-container">
                    <div className="image-background"></div>
                    <img
                      src={latta.img || latta.image || "/placeholder.png"}
                      alt={latta.nome || latta.name}
                      className={`latta-img ${hoveredCan === latta.id ? 'hovered' : ''}`}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                      loading="lazy"
                    />
                    
                    {/* Overlay con informazioni */}
                    <div className="latta-overlay">
                      <div className="overlay-content">
                        <h4 className="latta-nome">{latta.nome || latta.name}</h4>
                        <p className="latta-details">
                          <span className="detail-item">📅 {latta.year}</span>
                          <span className="detail-item">🌍 {latta.country}</span>
                          {latta.size && <span className="detail-item">📏 {latta.size}</span>}
                        </p>
                        <div className="view-more">
                          <span>👁️ Visualizza Dettagli</span>
                          <div className="arrow">→</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info lattina sempre visibili */}
                  <div className="latta-info">
                    <h3 className="latta-nome-main">{latta.nome || latta.name}</h3>
                    <div className="latta-meta">
                      <span className="latta-category">{latta.category}</span>
                      <span className="latta-year">{latta.year}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      )}
      
      {/* Footer con call to action */}
      <div className="carousel-footer">
        <p className="footer-text">
          ⚡ Scopri tutta la collezione completa
        </p>
        <Link to="/prodotti" className="view-all-button">
          <span>🔍</span>
          <span>Esplora Tutte le Lattine</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

// Custom Arrow Components
function CustomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-prev-arrow`}
      style={{ ...style }}
      onClick={onClick}
    >
      <span>‹</span>
    </div>
  );
}

function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-next-arrow`}
      style={{ ...style }}
      onClick={onClick}
    >
      <span>›</span>
    </div>
  );
}

export default CaroselloLattine;