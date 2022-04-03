import React from 'react';
import "./loader.css"

const Loader = ({text}) => {
  return (
    <div className="center">
    <div className="ring">
    </div>
    <span className='span'>{text}</span>
   
</div>
  )
}

export default Loader;