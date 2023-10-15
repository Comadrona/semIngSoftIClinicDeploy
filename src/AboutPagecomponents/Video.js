import React from 'react'
import videoBg from '../Assets/about-us-video.mp4'
import './Video-About.css'
function Video() {
  return (
    <div className='main'>
    <div className="overlay-video"></div>
    <video src={videoBg} autoPlay loop muted />
    <div className="content-video">
        <h1>Sobre nosotros</h1>
    </div>
    </div>
  )
}

export default Video