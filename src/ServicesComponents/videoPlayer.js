import React from 'react'
import videoBg from '../Assets/background.mp4'
import './videoPlayer.css'
function videoPlayer() {
  return (
    <div className='main'>
    <div className="overlay-video"></div>
    <video src={videoBg} autoPlay loop muted />
    <div className="content-video">
        <h1>Servicios</h1>
    </div>
    </div>
  )
}

export default videoPlayer