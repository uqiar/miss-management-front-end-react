import React from 'react';

const Card=({title,icon,iconBgColor,action})=>{
    return(
        <div className='dashboard_card_wrapper' onClick={action}>
      <div>
      {/* <p style={{color:"#6c757d"}}>users</p> */}
      <h2 style={{
          ontSize: "16px",
          marginBottom: "0.5rem",
          fontFamily: "inherit",
          fontWeight: "500",
          lineHeight: 0,
          color: "inherit"
      }}>
        {title}
      </h2>
  </div>
  <div className='right' style={{backgroundColor:iconBgColor}}>
      {icon}
  </div>
        </div>
    )
}

export default Card;