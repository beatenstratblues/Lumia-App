import React from 'react'
import hamMenu from "../assets/icons/HamburgerMenu.png"

const Footer = () => {
  return (
    <>
    <div className='footer'>
        <div>About</div>
        <div>Contact</div>
        <div>Creator</div>
        <div>Terms</div>
        <div>Privacy</div>
    </div>
    <div className='footer2'>
      <div style={{display:'flex', gap:5}}>Explore Lumia! <img src={hamMenu} style={{width:14}}/></div>
    </div>
    </>
  )
}

export default Footer