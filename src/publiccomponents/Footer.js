import React from "react";
import Logo from "../Assets/logo.png";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer-section-one">
        <div className="footer-logo-container">
          <img src={Logo} alt="" />
        </div>
        <div className="footer-icons">
          <BsTwitter />
          <SiLinkedin />
          <BsYoutube />
          <FaFacebookF />
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span>Dra Leslie Huerta</span>
          <span>Nuestros servicios</span>
        </div>
        <div className="footer-section-columns">
          <span>3323-8116-10</span>
          <span>clinicabelleza@gmail.com</span>
          <span>dra_leslie_huerta@gmail.com</span>
        </div>
        <div className="footer-section-columns">
          <span>Terminos & condiciones</span>
          <span>Reglamento NOM</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
