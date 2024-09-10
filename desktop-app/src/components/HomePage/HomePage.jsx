import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
  const [ipdetails, setIpdetails] = useState();
  const [vpnStatus, setVpnStatus] = useState('disconnected');
  const [loading, setLoading] = useState(false);

  // Fetch IP details on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const conn = await axios.get('https://ipinfo.io/json');
        setIpdetails(conn.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle VPN connection
  const handleVpnConnect = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    try {
      await window.vpnAPI.controlVPN('start');
      setVpnStatus('connected');
      

    } catch (error) {
      console.error('Error connecting VPN:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle VPN disconnection
  const handleVpnDisconnect = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    try {
      await window.vpnAPI.controlVPN('stop');
      setVpnStatus('disconnected');
      
    } catch (error) {
      console.error('Error disconnecting VPN:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-container">
      <div className="connectivity-section">
        {ipdetails ? (
          <div className="ip-details">
            <h2 className="ip">{ipdetails.ip}</h2>
            <h2 className="ip-city">{ipdetails.city}</h2>
            <h2 className="ip-region">{ipdetails.region}</h2>
            <h2 className="country">{ipdetails.country}</h2>
          </div>
        ) : (
          <p>Loading IP details...</p>
        )}

        <div className="vpn-controls">
        <button onClick={handleVpnConnect} disabled={loading}>
              {loading ? 'Connecting...' : 'Connect VPN'}
            </button>
            <button onClick={handleVpnDisconnect} disabled={loading}>
              {loading ? 'Disconnecting...' : 'Disconnect VPN'}
            </button>
          {/* {vpnStatus === 'disconnected' ? (
            <button onClick={handleVpnConnect} disabled={loading}>
              {loading ? 'Connecting...' : 'Connect VPN'}
            </button>
          ) : (
            <button onClick={handleVpnDisconnect} disabled={loading}>
              {loading ? 'Disconnecting...' : 'Disconnect VPN'}
            </button>
          )} */}
          <p>Status: {vpnStatus === 'connected' ? 'Connected' : 'Disconnected'}</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;