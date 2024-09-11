import { useState, useEffect, useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import HeaderTitle from './components/Misc/HeaderTitle';
import HomePage from './components/HomePage/HomePage';
import Settings from './components/Settings/Settings';
import Firewall from './components/Firewall/Firewall';
import Advanced from './components/Advanced/Advanced';
import axios from "axios";

function App() {
  const [publicIp, setPublicIp] = useState('');
  const [vpnConnected, setVPNConnected] = useState(false);

  const checkVPNConnectivity = async () => {
    try {
      const conn = await axios.get('https://api.ipify.org?format=json');
      const ip = conn.data.ip;
      setPublicIp(ip);

      // Retrieve original IP from local storage or set it if it does not exist
      let originalIp = localStorage.getItem('originalIp');
      if (!originalIp) {
        originalIp = ip;
        localStorage.setItem('originalIp', originalIp);
      }

      if (/^13\.235\./.test(ip)) {
        setVPNConnected(true);
      } else {
        setVPNConnected(false);
      }
    } catch (err) {
      console.log('Error fetching public IP:', err);
    }
  };

  useEffect(() => {
    checkVPNConnectivity();
  }, []);

  // Retrieve original IP from local storage
  const originalIp = localStorage.getItem('originalIp') || '';
  console.log(originalIp)
  console.log(vpnConnected)
  console.log(publicIp)
  return (
    <Router>
      <Launcher
        setPublicIp={setPublicIp}
        publicIp={publicIp}
        vpnConnected={vpnConnected}
        checkVPNConnectivity={checkVPNConnectivity}
        originalIp={originalIp}
      />
    </Router>
  );
}

function Launcher({ publicIp, vpnConnected, checkVPNConnectivity, setPublicIp, originalIp }) {
  const location = useLocation();
  const isLaunchPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className={isLaunchPage ? "launch-container" : ''}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={
          <>
            <Navbar vpnConnected={vpnConnected} />
            <HeaderTitle title="Connection" />
            <HomePage
              setPublicIp={setPublicIp}
              publicIp={publicIp}
              vpnConnected={vpnConnected}
              checkVPNConnectivity={checkVPNConnectivity}
            />
          </>
        } />
        <Route path='/settings' element={
          <>
            <Navbar vpnConnected={vpnConnected} />
            <HeaderTitle title="Settings" />
            <Settings
              vpnConnected={vpnConnected}
              publicIp={publicIp}
              checkVPNConnectivity={checkVPNConnectivity}
              originalIp={originalIp}
            />
          </>
        } />
        <Route path='/firewall' element={
          <>
            <Navbar vpnConnected={vpnConnected} />
            <HeaderTitle title="Firewall" />
            <Firewall />
          </>
        } />
        <Route path='/advanced' element={
          <>
            <Navbar vpnConnected={vpnConnected} />
            <HeaderTitle title="Advanced" />
            <Advanced />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
