import React from 'react';
import "./navbar.css";


const Navbar = ({setIsInventoryOpen=()=>{}}) => {
  return (
    <>
    <div className='nav-container'>
      <h3 className='logo-text'>Mpharma Test</h3>
    <button onClick={()=>{setIsInventoryOpen(true)}} className='nav-btn'>Show Inventory</button>
    </div>
    </>
  )
}

export default Navbar