import React,{useState,useEffect} from 'react';
import moment from 'moment';
import { Button, Input, } from "antd";
import { getSafariReport } from '../services/api';
import { toast } from "react-toastify";

const Report=({currentTab})=>{
    const [startDate,setStartDate]=useState(new Date(moment(new Date()).startOf("month").format("YYYY-MM-DD hh:mm")))
    const [endDate,setEndDate]=useState(new Date(moment(new Date()).endOf("month").format("YYYY-MM-DD hh:mm")))
     const [loading,setLoading]=useState(false)
     const [data,setData]=useState({
        bike:0,
        grocery:0,
        petrol:0,
        received_petrol:0,
        reviews:0,
        salik:0,
        pending_petrol:0,
        other:0
     })
    useEffect(() => {
        findSafariReport()
    }, [startDate,endDate,currentTab])

    const findSafariReport = async () => {
        try {
            const start_date = moment(startDate).format("YYYY-MM-DD");
            const end_date = moment(endDate).format("YYYY-MM-DD");
            setLoading(true)
            const doc = await getSafariReport({ startDate:start_date, endDate:end_date })
            let newData={
                bike:0,
                grocery:0,
                petrol:0,
                received_petrol:0,
                reviews:0,
                salik:0,
                pending_petrol:0,
                other:0
            }
            doc?.data?.map(itm=>{
                newData.bike+=itm?.bike||0;
                newData.grocery+=itm?.grocery||0;
                newData.petrol+=itm?.petrol||0;
                newData.received_petrol+=itm?.received_petrol||0;
                newData.reviews+=itm?.reviews||0;
                newData.salik+=itm?.salik||0;
                newData.other+=itm?.other||0;
            })
        newData.pending_petrol=newData.petrol-newData.received_petrol
            setData(newData)
            setLoading(false);
        } catch (err) {
            toast(err.message)
            setLoading(false);
        }
    }
    return(
        <>
        <div style={{display:'flex',justifyContent:"space-between",marginBottom:"20px"}}>
        <div style={{width:"48%"}}>
          <span>Start Date</span>
            <Input
                value={moment(startDate).format("YYYY-MM-DD")}
                type={"date"}
                name="date"
                onChange={e=>{
                    setStartDate(e.target.value)
                }}
            />
          </div>
          <div style={{width:"48%"}}>
          <span>End Date</span>
            <Input
                value={moment(endDate).format("YYYY-MM-DD")}
                type={"date"}
                name="date"
                onChange={e=>{
                    setEndDate(e.target.value)
                }}
            />
          </div>
          </div>

          <div style={{display:"flex",rowGap:"5px",columnGap:"5px",flexWrap:"wrap"}}>
          <div className='mini_card'>
            <p>Petrol</p>
            <span>{data.petrol}</span>
          </div>

          <div className='mini_card'>
            <p>Received Petrol</p>
            <span>{data.received_petrol}</span>
          </div>

          <div className='mini_card'>
            <p>Bike</p>
            <span>{data.bike}</span>
          </div>

          
          <div className='mini_card'>
            <p>Grocery</p>
            <span>{data.grocery}</span>
          </div>

          <div className='mini_card'>
            <p>Reviews</p>
            <span>{data.reviews}</span>
          </div>
          <div className='mini_card'>
            <p>Salik</p>
            <span>{data.salik}</span>
          </div>

          <div className='mini_card' style={{background:'#050505'}}>
            <p>Pending Petrol</p>
            <span>{data.pending_petrol}</span>
          </div>

          <div className='mini_card' style={{background:'#050505'}}>
            <p>Total Other</p>
            <span>{data.other}</span>
          </div>
          </div>
        </>
    )
}

export default Report