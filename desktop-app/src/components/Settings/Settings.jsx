import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Settings({ vpnConnected, checkVPNConnectivity }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVPN = async () => {
      try {
        await checkVPNConnectivity();
      } catch (error) {
        console.error('Error checking VPN connectivity:', error);
      } finally {
        setLoading(false);
      }
    };

    checkVPN();
  }, [checkVPNConnectivity]);

  if (loading) {
    return <div className="content-container">Loading...</div>;
  }

  return (
    <div className="content-container">
      <h2>VPN Status: {vpnConnected ? 'Connected' : 'Not Connected'}</h2>
      <div className="container-title">Settings</div>
    </div>
  );
}

export default Settings;
