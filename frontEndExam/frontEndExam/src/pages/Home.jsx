import React from "react";
import Timer from "../components/Timer";
import "./Home.css";
import CaroselloLattine from "../components/CaroselloLattine";

function Home() {
  return (
    <div className="home-container">
      <Timer />
      <CaroselloLattine />
    </div>
  );
}

export default Home;