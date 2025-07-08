// src/components/CaroselloLattine.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCans } from '../redux/actions/cansActions';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import "./CaroselloLattine.css";

function CaroselloLattine() {
  const dispatch = useDispatch();
  const { cans, loading, error } = useSelector(state => state.cans);

  useEffect(() => {
    dispatch(fetchCans());
  }, [dispatch]);

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
  if (error) return <div className="carosello-container">Errore: {error}</div>;
  if (!cans || cans.length === 0) return <div>Nessuna lattina disponibile.</div>;

  return (
    <div className="carosello-container">
      <Slider {...settings}>
        {cans.map((latta) => (
          <div key={latta.id} className="latta-card">
            <Link to={`/cans/${latta.id}`} className="latta-link">
              <img
                src={latta.img}
                alt={latta.nome}
                className="latta-img"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
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