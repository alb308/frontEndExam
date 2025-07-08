import React, { useEffect, useState } from "react";
import Timer from "../components/Timer";
import "./Home.css";
import CaroselloLattine from "../components/CaroselloLattine";

function Home() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);


  return (
    <div className="home-container">
      <h1>La mia collezzione di Monster :D</h1>
      <p>Colleziono lattine dal 1 aprile 2018</p>

      {weather && (
        <div style={{ marginBottom: "1rem" }}>
          <p>
            ☁️ Meteo a Barrafranca: <strong>{weather.temp}°C</strong>, {weather.condition}
          </p>
          <img src={weather.icon} alt="Icona meteo" />
        </div>
      )}

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      <CaroselloLattine />
      <Timer />
    </div>
  );
}

export default Home;
