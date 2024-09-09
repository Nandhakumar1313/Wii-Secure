import { useState } from 'react'

import './App.css'
import {BrowserRouter as Router,Route,Routes,useLocation} from 'react-router-dom'
import Welcome from './components/Welcome/Welcome'
import Navbar from './components/Navbar/Navbar'
import Login from './components/Login/Login'

import HomePage from './components/HomePage/HomePage'


function App() {
  

  return (
    <>
      
        <Router>
          <Launcher/>
        </Router>
      
    </>
  )
}

function Launcher() {
  const location = useLocation();
  const isLaunchPage = location.pathname === '/' || location.pathname === '/login'

  return (
    <div className={isLaunchPage?"launch-container":''}>
      <Routes>
        <Route path="/" element={<Welcome/>} />

        <Route path='/login' element={
          <Login/>
        }/>

        <Route path='/home' element={
          <>
          <Navbar/>
          <HomePage />

          
          </>
        }/>

        <Route path='/settings' element ={
          <>
          <Navbar />
          
          </>
        }/>
      </Routes>
    </div>
  )
}



export default App
