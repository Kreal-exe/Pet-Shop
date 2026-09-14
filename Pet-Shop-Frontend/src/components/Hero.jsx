import React from "react";
import { NavLink } from "react-router-dom"; // Импортируем NavLink


const Hero = () => {
  return (
      <div className="hero-content">
        <h1>Amazing Discounts <br /> on Pets Products!</h1>
        <NavLink to="/discounts" className="hero-btn">
          Check out
        </NavLink>
      </div>
  );
};

export default Hero;