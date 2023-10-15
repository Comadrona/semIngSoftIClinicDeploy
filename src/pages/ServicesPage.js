import React from 'react'
import Navbar from "../publiccomponents/Navbar";
import VideoPlayer from '../ServicesComponents/videoPlayer';
import ServicesList from '../ServicesComponents/servicesList';
import ServicesTitle from '../ServicesComponents/servicesTitle';
import Footer from '../publiccomponents/Footer';
function ServicesPage() {
  
  return(
    <>
          <Navbar/>
          <VideoPlayer/>
          <ServicesTitle/>
          <ServicesList/>
          <Footer/>
    </>
  )
}

export default ServicesPage