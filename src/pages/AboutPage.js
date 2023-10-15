import React from 'react'
import Navbar from '../publiccomponents/Navbar'
import Video from '../AboutPagecomponents/Video'
import AboutInfo from '../AboutPagecomponents/About-Info'
import AboutInfo2 from '../AboutPagecomponents/About-Info2'
import Footer from '../publiccomponents/Footer'
import Location from '../AboutPagecomponents/Location'
function AboutPage() {
  return (
    <>
    <Navbar/>
    <Video/>
    <AboutInfo/>
    <AboutInfo2/>
    <Location/>
    <Footer/>
    </>
  );
}

export default AboutPage