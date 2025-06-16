import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom"; // Importa Link
import "./CaroselloLattine.css";

function CaroselloLattine() {
  const [lattine, setLattine] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/lattine.json")
      .then((res) => res.json())
      .then((data) => {
        setLattine(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento JSON:", err);
        setLoading(false);
      });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 6,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
    ],
  };

  if (loading) return <div className="carosello-container">Caricamento...</div>;
  if (!lattine.length) return <div>Nessuna lattina disponibile.</div>;

  return (
    <div className="carosello-container">
      <Slider {...settings}>
        {lattine.map((latta) => (
          <div key={latta.id} className="latta-card">
            {/* Sostituisci il tag img con Link + img */}
            <Link to={`/cans/${latta.id}`} className="latta-link">
              <img
                src={latta.img}
                alt={latta.nome}
                className="latta-img"
                onError={(e) => {
                  e.target.src = "/placeholder.png"; // Fallback se l'immagine non carica
                }}
              />
              <p className="latta-nome">{latta.nome}</p>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CaroselloLattine;