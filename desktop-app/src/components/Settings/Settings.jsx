import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import './Settings.css'

function Settings({ vpnConnected, checkVPNConnectivity, originalIp }) {
  const [loading, setLoading] = useState(true);
  const [serverResponse, setServerResponse] = useState('');
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const checkVPN = async () => {
      try {
        await checkVPNConnectivity(); // Check if the VPN is connected
      } catch (error) {
        console.error('Error checking VPN connectivity:', error);
      } finally {
        setLoading(false);
      }
    };

    checkVPN();
  }, [checkVPNConnectivity]);

  useEffect(() => {
    let intervalId;

    const fetchServerData = async () => {
      try {
        const conn = await axios.get('http://localhost:5000');
        console.log('Server response:', conn.data); 
        setServerResponse(conn.data);
      } catch (err) {
        console.error('Error fetching server data:', err); 
      }
    };

    if (toggle) {
      // Start fetching data every 5 seconds when toggle is true
      intervalId = setInterval(fetchServerData, 5000);
      fetchServerData(); // Fetch immediately after toggling
    } else {
      // Clear interval when toggle is false
      clearInterval(intervalId);
    }

    // Cleanup interval on component unmount or toggle change
    return () => clearInterval(intervalId);
  }, [toggle]);

  if (loading) {
    return <div className="content-container">Loading...</div>;
  }

  function handleToggle() {
    setToggle(prev => !prev); // Toggle the button state
  }

  return (
    <div className="content-container">
      <div className="settings-container">
        <div className="vpn-status">
          <p>Original IP: {originalIp || 'Unknown'}</p>
        </div>

        <div className="threat-checker-container">
          <div className="toggle-btn" onClick={handleToggle}>
            <h3>Threat </h3>
            {toggle ? <FaToggleOn size="2rem" /> : <FaToggleOff size="2rem" />}
          </div>

          {/* Display the server response if the toggle is on */}
          {toggle && serverResponse && (
            <div className="server-response">
              {serverResponse.threat ? (
                <div>
                  <FaExclamationTriangle color="red" size="1.5rem" />
                  <p>Threat Detected: {serverResponse.details}</p>
                </div>
              ) : (
                <div>
                  <FaCheckCircle color="green" size="1.5rem" />
                  <p>No Threats Detected</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
