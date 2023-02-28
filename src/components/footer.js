import React from 'react';

const Footer=()=>{
    return(
        <div style={{
            background:"black",
            color:"white",
            position:'fixed',
            width:"100%",
            maxWidth:"1400px",
            bottom:0,
            padding:"10px"
        }}>
            <div style={{textAlign:"center"}}>
               <div style={{fontFamily:"fantasy"}}>MIS MANAGEMENT SYSTEM</div>
               <div style={{
                   fontSize:'12px',
                   fontFamily:"fantasy"
               }}>Copyright © Uqair Ali</div>
            </div>
        </div>
    )
}

export default Footer;