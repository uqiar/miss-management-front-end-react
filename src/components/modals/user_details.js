import React from 'react';
import {
    Modal,
  } from "antd";

const DetailsModal=({show,setShow,selectedObj})=>{
    console.log("selectedobject",selectedObj)
    return(
        <Modal
        footer={false}
        title={selectedObj?.name}
        open={show}
        onOk={() => alert("submit")}
        onCancel={() => setShow()}
      >
          <div style={{position:"relative"}}>
              <div style={{zIndex:999}}>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div>Food Expense</div>
            <div>{"+"+selectedObj.expense}</div>
        </div>
        {
            selectedObj.otherExpenses?.map((itm,key)=>(
                <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}} key={"otherExpense"+key}>
                <div>{itm.note}</div>
                <div>{"+"+itm.amount}</div>
            </div>  
            ))
        }
          <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div>Total Spend</div>
            <div>{"-"+selectedObj.totalSpend}</div>
        </div>
        <hr/>
      
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div>Total</div>
            <div>=</div>
            <div>{+selectedObj.total}</div>
        </div>
          </div>
        <div style={{
            top:"0%",
            right:"30%",
            position:"absolute",
            zIndex:0,
           
        }}>
     <p style={{
         color:"lightgrey",
         fontSize:"20px",
         transform:"rotate(300deg)",
         WebkitTransform:"rotate(300deg)"
     }}>{"NOT PAYED"}</p>
	</div>
        </div>
      </Modal>
    )
}

export default DetailsModal;