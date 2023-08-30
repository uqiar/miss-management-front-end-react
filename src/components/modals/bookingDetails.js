import React,{useState} from 'react';
import {
    Button,
    Modal,
  } from "antd";
import { roundeNumber } from '../../utils/helper';
import { updateTourFunBooking } from '../../services/api';

const DetailsModal=({show,setShow,selectedObj,refetch})=>{
    const [loading,setLoading]=useState(false)
    const onStatusChange=async(status)=>{
        setLoading(true)
        try{
        await updateTourFunBooking(selectedObj._id,{status})
        setLoading(false)
        setShow(false)
        refetch()
        }catch(err){
            setLoading(false)
            alert(err?.message)
        }
    }

    const handlePhoneClick = () => {
        window.location.href = `tel:${selectedObj.phone}`;
    }
    const returnNextStatus=(status)=>{
      if(status=="pending")
      return "approved"
      if(status=="approved")
      return "success"
      
      if(status=="cancel")
      return "pending"
      return status
    }
    return(
        <Modal
        footer={false}
        title={<div style={{
            textAlign: "center",
            fontFamily: "monospace"
        }}>{"Booking Details"}</div>}
        open={show}
        onOk={() => alert("submit")}
        onCancel={() => setShow()}
      >
          <div style={{position:"relative"}}>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>Name</div>
            <div>{selectedObj?.name}</div>
        </div>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>Email</div>
            <div>{selectedObj?.email}</div>
        </div>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>Phone</div>
            <div onClick={handlePhoneClick}>{selectedObj?.phone}</div>
        </div>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>Date</div>
            <div>{selectedObj?.date}</div>
        </div>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>Status</div>
            <div>{selectedObj?.status}</div>
        </div>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>Package</div>
            <div>{selectedObj?.packageName}</div>
        </div>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>PackagePrice</div>
            <div>{selectedObj?.packagePrice}</div>
        </div>
        
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>Total Persons</div>
            <div>{selectedObj?.numberOfPeople}</div>
        </div>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>Total Amount</div>
            <div>{selectedObj?.totalAmount}</div>
        </div>
        <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
            <div style={{fontWeight:500}}>Location</div>
            <div>{selectedObj?.location}</div>
        </div>

       
      </div>
      <hr/>
      <div style={{display:'flex',justifyContent:"space-between",fontWeight:"bold"}}>
      <Button loading={loading} onClick={()=>onStatusChange(returnNextStatus(selectedObj.status))} type="primary">{returnNextStatus(selectedObj.status)}</Button>
        <Button loading={loading} onClick={()=>onStatusChange("cancel")}type="default">Cancel</Button>
      </div>
      </Modal>
    )
}

export default DetailsModal;