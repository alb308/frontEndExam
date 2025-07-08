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
      <CaroselloLattine />
      <Timer />
    </div>
  );
}

export default Home;
