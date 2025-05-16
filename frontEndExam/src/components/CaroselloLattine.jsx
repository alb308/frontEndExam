import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CaroselloLattine.css";

function CaroselloLattine() {
  const [lattine, setLattine] = useState([]);

  useEffect(() => {
    fetch("/lattine.json")
      .then((res) => res.json())
      .then((data) => setLattine(data))
      .catch((err) => console.error("Errore nel caricamento JSON:", err));
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
        settings: { slidesToShow: 4, slidesToScroll: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      }
    ]
  };

  return (
    <div className="carosello-container">
      <Slider {...settings}>
        {lattine.map((latta) => (
          <div key={latta.id} className="latta-card">
            <img src={latta.img} alt={latta.nome} className="latta-img" />
            <p className="latta-nome">{latta.nome}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CaroselloLattine;
