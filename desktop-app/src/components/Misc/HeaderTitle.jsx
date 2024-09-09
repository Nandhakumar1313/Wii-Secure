import React from 'react'
import './Misc.css'
import { IoMdSettings } from "react-icons/io";
import { SiFirewalla } from "react-icons/si";
import { FaSuperpowers } from "react-icons/fa6";
import { TbBrandOpenvpn } from "react-icons/tb";
function HeaderTitle({title}) {
  return (
    <h1 className="header-title">
        {title == "Connection"?(<TbBrandOpenvpn size="1.45em"/>):<></>}
        {title == "Settings"?(<IoMdSettings size="1.45em"/>):<></>}
        {title == "Firewall"?(<SiFirewalla size="1.45em"/>):<></>}
        {title == "Advanced"?(< FaSuperpowers size="1.45em"/>):<></>}
        {title}
    </h1>
  )
}

export default HeaderTitle