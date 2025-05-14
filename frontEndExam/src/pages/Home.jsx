import React from "react";
import Timer from "../components/Timer";
import "./Home.css"; 
import Navbar from "../components/Navbar";

function Home() {
  return (
    
    <div className="home-container">
      <h1>Benvenuto nel Monster Vault 🟢</h1>
      <p>Colleziono lattine dal 1 aprile 2018</p>
      <Timer />
    </div>
  );
}

export default Home;
