import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Login.css'
function Login() {

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const navigate = useNavigate()

  return (
    <div className="login-container">
      <h1>Login to Wiisecure</h1>
      <form  className="login-form">

        <input type="text"
         placeholder="Username"
         value={username}
         onChange={(e) => setUsername(e.target.value)}
          required
          /> 

       <input type="text"
         placeholder="Password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
          required
          /> 
        <button type="submit">Login</button>
      </form>
      </div>
  )
}

export default Login