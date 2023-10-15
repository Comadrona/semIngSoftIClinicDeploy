import React from "react";
import AboutBackground from "../Assets/about-background.png";
import AboutBackgroundImage from "../Assets/abaut-background-image.png";
import { Link } from 'react-router-dom'
const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <h1 className="primary-heading">
        Realzando tu belleza con cuidado y dedicación excepcionales
        </h1>
        <p className="primary-text">
        En nuestra exclusiva clínica de belleza, te ofrecemos una experiencia completa de transformación. Desde faciales rejuvenecedores y depilación láser de vanguardia hasta masajes relajantes y tratamientos de uñas de primera clase, nuestro equipo de expertos te guiará en tu viaje hacia la belleza y el bienestar.
        </p>
        <div className="about-buttons-container">
          <Link to="/services">
          <button className="secondary-button">Consulta los servicios</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
