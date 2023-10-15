import React from "react";
import Calendar from "../Assets/calendar.png";
import BodyMeasures from "../Assets/body-measures.png";
import SkinCare from "../Assets/skincare-image.png";
const Services = () => {
  const workInfoData = [
    {
      image: SkinCare,
      title: "Piel radiante",
      text: "Tu piel es un lienzo precioso. Deja que nuestros profesionales la cuiden con mimo y dedicación.",
    },
    {
      image: BodyMeasures,
      title: "Tu figura deseada",
      text: "Con nuestros planes de dieta o entrenamientos personalizados.",
    },
    {
      image: Calendar,
      title: "Realiza tu cita",
      text: "Registra tu cita para la fecha que quieras.",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <h1 className="primary-heading">Belleza</h1>
        <p className="primary-text">
        Realza tu belleza con faciales, masajes y tratamientos especializados excepcionales.
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
