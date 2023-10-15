import React from "react"
import Calendar from "../Assets/calendar2.png"
import LocationPNG from "../Assets/location.png"
import { Link } from "react-router-dom";
const Location = () => {
  const workInfoData = [
    {
      image: LocationPNG,
      title: "Ubicación dentro de Zapopan",
      text: "Encuentra la clinica con ayuda de Google Maps.",
      link: "https://maps.app.goo.gl/Ler1jUdu9b8R72BQ6"
    },
    {
      image: Calendar,
      title: "Realiza tu cita ahora mismo",
      text: "Registra tu cita para la fecha que quieras desde este sitio.",
      link: "#"
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
            <Link to={data.link}>
                <div className="info-boxes-img-container">
                <img src={data.image} alt="" />
                </div>
                <h2>{data.title}</h2>
                <p>{data.text}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Location;
