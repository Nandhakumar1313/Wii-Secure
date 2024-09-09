import { useState } from 'react'

import './App.css'
import {BrowserRouter as Router,Route,Routes,useLocation} from 'react-router-dom'

import Welcome from './components/Welcome/Welcome'
import Navbar from './components/Navbar/Navbar'
import Login from './components/Login/Login'

import HeaderTitle from './components/Misc/HeaderTitle'

import HomePage from './components/HomePage/HomePage'
import Settings from './components/Settings/Settings'
import Firewall from './components/Firewall/Firewall'
import Advanced from './components/Advanced/Advanced'
// import isAuthenticated from './utils/auth'



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
        <HeaderTitle title="Connection"/>
        <HomePage />          
        </>      

        }/>

        <Route path='/settings' element ={
          <>
          <Navbar />
          <HeaderTitle title="Settings"/>
          <Settings/>
          
          </>
        }/>

      <Route path='/firewall' element ={
          <>
          <Navbar />
          <HeaderTitle title="Firewall" />
          <Firewall/>
          
          </>
        }/>

    <Route path='/advanced' element ={
          <>
          <Navbar />
          <HeaderTitle title="Advanced"/>
          <Advanced/>
          
          </>
        }/>
      </Routes>
    </div>
  )
}



export default App
