import React from 'react';
import "./navbar.css";


const Navbar = ({setIsInventoryOpen=()=>{}}) => {
  return (
    <>
    <div className='nav-container'>
    <button onClick={()=>{setIsInventoryOpen(true)}} className='nav-btn'>Show Inventory</button>
    </div>
    </>
  )
}

export default Navbar