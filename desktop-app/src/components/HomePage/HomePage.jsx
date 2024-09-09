import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './HomePage.css'

function HomePage() {
  const [ipdetails,setIpdetails] = useState()
  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const conn = await axios.get('https://ipinfo.io/json')
        setIpdetails(conn.data)
      console.log(conn.data)
      
      }
      catch(err)
      {
        console.error('Error fetching data:', err);
      }
    }
    
    fetchData()
  },[])
  return (
    <div className="content-container">
      {ipdetails?(<div className='ip-details'>
        <h2 className="ip">{ipdetails.ip}</h2>
        <h2 className="ip-city">{ipdetails.city}</h2>
        <h2 className="ip-region">{ipdetails.region}</h2>
        <h2 className="country">{ipdetails.country}</h2>
      </div>):(<></>)}

      
      
    </div>
  )
}

export default HomePage