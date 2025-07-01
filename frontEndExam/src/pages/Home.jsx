import React, { useEffect, useState } from "react";
import Timer from "../components/Timer";
import "./Home.css";
import CaroselloLattine from "../components/CaroselloLattine";

function Home() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.weatherapi.com/v1/current.json?key=23a6e3a7c3928eaddadd8b5de00bb30b=Barrafranca&lang=it")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error.message);
        setWeather({
          temp: data.current.temp_c,
          condition: data.current.condition.text,
          icon: data.current.condition.icon,
        });
      })
      .catch((err) => {
        console.error("Errore meteo:", err);
        setError(err.message || "Errore nel recupero meteo");
      });
  }, []);

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
