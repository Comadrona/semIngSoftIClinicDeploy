import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Clínica de belleza
          </h1>
          <p className="primary-text">
          ¡Descubre tu Belleza Interior y Exterior en Nuestra Clínica!
          </p>
          <Link to="/services">
          <button className="secondary-button">
            Registra una cita <FiArrowRight />{" "}
          </button>
          </Link>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
