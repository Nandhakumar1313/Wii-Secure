import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import logo from '../../assets/heckers.png'
import './Navbar.css'


function Navbar() {
  const navigate = useNavigate()
  return (
    <>
        <div className="navbar">
            <div className='nav-left' onClick={()=>navigate("/home")}>
                <img src={logo} alt="Logo" className="nav-logo" />
                <h2 className="nav-title">WiiSecure</h2>
            </div>
            <div className="nav-right">
                <Link className ="nav-r-ele" to="/settings">Settings</Link>
                <Link className ="nav-r-ele" to="/firewall">Firewall</Link>
                <Link className ="nav-r-ele" to="/advanced">Advanced</Link>
                 
            </div>
        </div>
    
    </>

  )
}

export default Navbar