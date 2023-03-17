import React, { useState,useEffect } from "react";
import { Space, Button, Modal, Input } from "antd";
import moment from 'moment';

const ReportModal = ({ show, hide, reFetch,selectedObj }) => {
  const [calculatedResult,setCalculatedResult]=useState([])
   useEffect(()=>{
    filterAndSoring()
   },[])
   const filterAndSoring=()=>{
     let filterRessult=[...selectedObj.givesMony,...selectedObj.collectedMony.map(itm=>{return {...itm,collected:true}})]
      filterRessult=filterRessult.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
      });
      let total=0;
      filterRessult=filterRessult.map(itm=>{
         if(itm.collected){
           total-=itm.amount
         }else{
           total+=itm.amount
         }
         return {...itm,total}
      })
      setCalculatedResult(filterRessult)
   }
  return (
    <Modal
      footer={false}
      title={selectedObj.name+" Report"}
      open={show}
      onOk={() => alert("submit")}
      onCancel={hide}
    >

    <table style={{width:"100%"}}>
  <tr style={{fontWeight:600}}>
    <td>Date</td>
    <td>Amount</td>
    <td>Total</td>
  </tr>
  {
    calculatedResult.map((itm,key)=>(
    <tr key={"report_table"+key}>
    <td>{moment(itm.date).format("DD-MMM-YY")}</td>
    {itm.collected?
    <td>{"-"+itm.amount}</td>
  : <td>{"+"+itm.amount}</td>
  }
    <td style={{fontWeight:500}}>{itm.total}</td>
  </tr>
    ))
  }
  
</table>
    </Modal>
  );
};

export default ReportModal;
