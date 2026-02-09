import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import "./CaroselloLattine.css";
import db from "../data/db.json";

function CaroselloLattine() {
  const [cans, setCans] = useState([]);
  const [hoveredCan, setHoveredCan] = useState(null);

  useEffect(() => {
    setCans(db.cans);
  }, []);

  const settings = {
    dots: true,
    infinite: cans.length > 6,
    speed: 500,
    slidesToShow: Math.min(6, cans.length),
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(4, cans.length),
          slidesToScroll: 2,
          autoplay: true,
          autoplaySpeed: 3000
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, cans.length),
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3500
        },
      },
    ],
  };

  return (
    <div className="carosello-container">
      <div className="carousel-header">
        <h2 className="carousel-title">
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
                  {latta.limited && (
                    <div className="limited-badge-floating">
                      <span>⭐</span>
                      <span>LIMITED</span>
                    </div>
                  )}

                  <div className="category-badge">
                    {latta.category}
                  </div>

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

export default CaroselloLattine;