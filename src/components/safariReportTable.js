import React,{useState,useEffect} from 'react';
import moment from 'moment';
import { Table, Input, } from "antd";
import { getSafariReport } from '../services/api';
import { toast } from "react-toastify";

const Report=({currentTab})=>{
    const [startDate,setStartDate]=useState(new Date(moment(new Date()).startOf("month").format("YYYY-MM-DD hh:mm")))
    const [endDate,setEndDate]=useState(new Date(moment(new Date()).endOf("month").format("YYYY-MM-DD hh:mm")))
     const [loading,setLoading]=useState(false)
     const [data,setData]=useState([])
     const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 5,
      },
    });
    useEffect(() => {
        findSafariReport()
    }, [startDate,endDate,currentTab])

    const findSafariReport = async () => {
        try {
            const start_date = moment(startDate).format("YYYY-MM-DD");
            const end_date = moment(endDate).format("YYYY-MM-DD");
            setLoading(true)
            const doc = await getSafariReport({ startDate:start_date, endDate:end_date })
            let newData=doc?.data?.map(itm=>{
               return {...itm,date:moment(itm.date).format("DD-MMM-YYYY")}
            })
            setData(newData)
            setLoading(false);
        } catch (err) {
            toast(err.message)
            setLoading(false);
        }
    }

    const columns=[
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Petrol",
        dataIndex: "petrol",
        key: "petrol",
      },
      {
        title: "Received Petrol",
        dataIndex: "received_petrol",
        key: "received_petrol",
      },
      {
        title: "Bike",
        dataIndex: "bike",
        key: "bike",
      },
      {
        title: "Grocery",
        dataIndex: "grocery",
        key: "grocery",
      },
      {
        title: "Reviews",
        dataIndex: "reviews",
        key: "reviews",
      },
      {
        title: "Salik",
        dataIndex: "salik",
        key: "salik",
      },
     
  ]

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      //filters,
      // ...sorter,
    });
  };
    return(
        <>
        <div style={{display:'flex',justifyContent:"space-between",marginBottom:"10px"}}>
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

          <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        onChange={handleTableChange}
        scroll={{x:"100%"}}
      />

        </>
    )
}

export default Report