import React from "react";
import Timer from "../components/Timer";
import "./Home.css"; 
import Navbar from "../components/Navbar";
import CaroselloLattine from "../components/CaroselloLattine";

function Home() {
  return (
    
    <div className="home-container">
      <h1>La mia collezzione di Monster :D</h1>
      <p>Colleziono lattine dal 1 aprile 2018</p>

      <CaroselloLattine />
      <Timer />
    </div>
  );
}

export default Home;
