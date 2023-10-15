import React from "react";
import "./HomePage.css";
import "../publiccomponents/general.css"
import Navbar from "../publiccomponents/Navbar";
import Home from "../HomeComponents/Home";
import About from "../HomeComponents/About";
import Services from "../HomeComponents/Services";
import DraLeslie from "../HomeComponents/DraLeslie";
import Footer from "../publiccomponents/Footer";
function HomePage () {
    return (
      <>
          <Navbar/>
          <Home />
          <About />
          <Services />
          <DraLeslie />
          <Footer />
      </>
      );
};

export default HomePage;