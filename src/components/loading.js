import React from 'react';
import { Spin  } from 'antd'

const Loader=()=>{
   return <div style={{
   position:"fixed",
   top:"50%",
   right:"50%"       
   }}>
   <Spin size="large" />
    </div>
}
export default Loader
