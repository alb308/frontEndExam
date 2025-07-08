// src/components/CaroselloLattine.jsx
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

  useEffect(() => {
    const fetchAllCans = async () => {
      try {
        setLoading(true);
        // Prova diverse strategie per ottenere tutte le lattine
        
        // Strategia 1: Con limit molto alto
        let response = await fetch('http://localhost:3001/cans?_limit=1000');
        let data = await response.json();
        
        console.log('Strategia 1 - Lattine caricate:', data.length);
        
        // Se non funziona, prova senza limit
        if (data.length < 50) {
          response = await fetch('http://localhost:3001/cans');
          data = await response.json();
          console.log('Strategia 2 - Lattine caricate:', data.length);
        }
        
        setCans(data);
        setError(null);
      } catch (err) {
        console.error('Errore nel caricamento lattine:', err);
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
    autoplay: cans.length > 6,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { 
          slidesToShow: Math.min(4, cans.length), 
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: { 
          slidesToShow: Math.min(2, cans.length), 
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) return (
    <div className="carosello-container">
      <div style={{ textAlign: 'center', color: '#00ff00', padding: '2rem' }}>
        ⚡ Caricamento collezione Monster Energy...
      </div>
    </div>
  );
  
  if (error) return (
    <div className="carosello-container">
      <div style={{ textAlign: 'center', color: '#ff0000', padding: '2rem' }}>
        ❌ Errore: {error}
      </div>
    </div>
  );

  return (
    <div className="carosello-container">
      <h3 style={{ 
        color: '#00ff00', 
        textAlign: 'center', 
        marginBottom: '30px',
        fontSize: '1.5rem',
        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
      }}>
        {cans.length} Gusti diversi al momento
      </h3>
      
      {cans.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#ccc', padding: '2rem' }}>
          📭 Nessuna lattina nella collezione
        </div>
      ) : (
        <Slider {...settings}>
          {cans.map((latta) => (
            <div key={latta.id} className="latta-card">
              <Link to={`/cans/${latta.id}`} className="latta-link">
                <img
                  src={latta.img || latta.image || "/placeholder.png"}
                  alt={latta.nome || latta.name}
                  className="latta-img"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
                <p className="latta-nome">{latta.nome || latta.name}</p>
                {latta.limited && (
                  <span style={{
                    background: '#ffd700',
                    color: '#000',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    marginTop: '5px',
                    display: 'inline-block'
                  }}>
                    LIMITED
                  </span>
                )}
              </Link>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default CaroselloLattine;