import React from 'react'
import ServicesImage from '../Assets/services-list-image.png'
import AboutBackground from "../Assets/about-background.png";
function ServicesTitle() {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={ServicesImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <h1 className="primary-heading">
        Resalta tu belleza con nosotros
        </h1>
        <p className="primary-text">
        Nuestros expertos en cuidado de la piel, cabello y cuerpo están listos para realzar tu belleza natural y hacer que te sientas radiante. ¡Reserva tu cita hoy y déjate consentir en manos expertas!
        </p>
      </div>
    </div>
  )
}

export default ServicesTitle;