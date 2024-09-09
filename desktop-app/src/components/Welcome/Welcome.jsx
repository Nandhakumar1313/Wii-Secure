import React from 'react'
import {Link} from "react-router-dom"
import logo from '../../assets/heckers.png'
import "./Welcome.css"
function Welcome() {
  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="logo" />
      <h2 className='welcome-title'>Wiisecure</h2>

      <Link to="/home">
      <button className='welcome-launch'>Launch</button>

      </Link>
      <div className="read-the-docs">
        Heckers
      </div>
    </div>
  )
}

export default Welcome