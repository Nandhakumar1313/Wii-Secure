import React from 'react'

function Settings() {
  return (
    <div className="content-container">
    
          <div className="container-title">Settings</div>
     </div>
  )
}

export default Settings

// import React, { useEffect, useState } from 'react'
// import { IoMdSettings } from "react-icons/io";
// import axios from "axios"
// function Settings() {
// const [res,setRes] = useState()
//   useEffect(()=>{
//     const fetchresult = async()=>{
//       try{
//         const conn = await axios.get('http://127.0.0.1:5000')
//       setRes(conn.data)
//       }
//       catch(err){
//         console.error(err)
//       }
//     }
//     fetchresult()
//   },[])

//   console.log(res.sample)
//   return (
//     <div className="content-container">
//         {/* {res?'loading':<h3>{res.sample}</h3>} */}
//         <div className="container-title">Settings</div>
//     </div>
//   )
// }

// export default Settings