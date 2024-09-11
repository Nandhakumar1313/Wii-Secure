import { useState,useEffect,useRef} from 'react'

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
import axios from "axios"


function App() {
  const originalIpRef = useRef('')
  const [publicIp,setPublicIp] = useState('')
  const [vpnConnected,setVPNConnected] = useState(false)
  
  
  const checkVPNConnectivity = async() =>{
    try {
      const conn = await axios.get('https://api.ipify.org?format=json');
      const ip = conn.data.ip;
      setPublicIp(ip);
      if (!originalIpRef.current) {
        originalIpRef.current = ip;
      }


      
      if (/^13\.235\./.test(ip)) {
        setVPNConnected(true);
      } else {
        setVPNConnected(false);
      }
    } catch (err) {
      console.log('Error fetching public IP:', err);
    }
  }
  console.log(publicIp)
  console.log(vpnConnected)
  console.log(`original ip: ${originalIpRef.current}`)
  useEffect(() => {

    checkVPNConnectivity();
  }, []);

  return (
    <>
      
        <Router>
          
          <Launcher
          setPublicIp={setPublicIp}
          publicIp={publicIp} 
          vpnConnected={vpnConnected} 
          checkVPNConnectivity={checkVPNConnectivity}/>
        </Router>
      
    </>
  )
}

function Launcher({ publicIp, vpnConnected, checkVPNConnectivity,setPublicIp }) {
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
        <Navbar vpnConnected={vpnConnected} />
        <HeaderTitle title="Connection"/>
        <HomePage 
        setPublicIp={setPublicIp} 
        publicIp={publicIp} 
        vpnConnected={vpnConnected} 
        checkVPNConnectivity={checkVPNConnectivity} />          
        </>      

        }/>

        <Route path='/settings' element ={
          <>
          <Navbar vpnConnected={vpnConnected} />
          <HeaderTitle title="Settings"/>
          <Settings 
          vpnConnected={vpnConnected} 
          publicIp={publicIp} 
          checkVPNConnectivity={checkVPNConnectivity} />
          
          </>
        }/>

      <Route path='/firewall' element ={
          <>
          <Navbar vpnConnected={vpnConnected} />
          <HeaderTitle title="Firewall" />
          <Firewall/>
          
          </>
        }/>

    <Route path='/advanced' element ={
          <>
          <Navbar vpnConnected={vpnConnected} />
          <HeaderTitle title="Advanced"/>
          <Advanced/>
          
          </>
        }/>
      </Routes>
    </div>
  )
}



export default App
