import React, { useEffect, useState } from "react";

function TestMeteo() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = "https://api.weatherapi.com/v1/current.json?key=d16ed3b4d0e2f2ab51c497191022a0db&q=Barrafranca&lang=it";

    console.log("➡️ Chiamata a:", url);

    fetch(url)
      .then((res) => {
        console.log("📥 STATUS:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("📦 DATI:", data);
        if (data.error) throw new Error(data.error.message);
        setWeather(data);
      })
      .catch((err) => {
        console.error("❌ ERRORE:", err.message);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", backgroundColor: "#000", color: "#fff" }}>
      <h1>TEST METEO</h1>
      {error && <p style={{ color: "red" }}>❌ Errore: {error}</p>}
      {weather ? (
        <div>
          <p>🌡️ Temperatura: {weather.current.temp_c}°C</p>
          <p>📋 Descrizione: {weather.current.condition.text}</p>
          <img src={weather.current.condition.icon} alt="Meteo" />
        </div>
      ) : (
        !error && <p>Caricamento...</p>
      )}
    </div>
  );
}

export default TestMeteo;
