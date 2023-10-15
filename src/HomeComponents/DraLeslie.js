import React from "react";
import ProfilePic from "../Assets/review-image.png";

const DraLeslie = () => {
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <h1 className="primary-heading">Dra. Leslie Huerta</h1>
        <p className="primary-text">
        Médica Estética y Directora Clínica de Belleza
        </p>
      </div>
      <div className="testimonial-section-bottom">
        <img src={ProfilePic} alt="" />
        <p>
        Realzando tu Belleza Natural de Manera Segura y Profesional.
        </p>
        <h2>Dra. Leslie Huerta</h2>
      </div>
    </div>
  );
};

export default DraLeslie;
