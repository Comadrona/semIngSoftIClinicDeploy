import React from "react";
import AboutBackground from "../Assets/about-background.png";
import AboutBackgroundImage from "../Assets/about-us-logo.png";
import { Link } from 'react-router-dom'
const AboutInfo = () => {
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
        Bienvenidos
        </h1>
        <p className="primary-text">
        La clínica de belleza de la doctora Leslie Huerta es donde la belleza se encuentra con la ciencia y la experiencia se une a la innovación. En nuestra clínica, nos enorgullece ofrecer una gama completa de servicios de belleza y bienestar que te ayudarán a lucir y sentirte mejor que nunca. Nuestra misión es resaltar la belleza natural de cada persona y brindar un espacio donde la confianza y el cuidado personal florezcan.
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

export default AboutInfo;