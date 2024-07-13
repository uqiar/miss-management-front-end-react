import React, { useEffect, useState } from "react";
import { allReports,markePayedUnpayed } from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import moment from "moment";
import { DatePicker, Checkbox, Table, Spin, Modal,Input } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import DetailsModal from '../components/modals/user_details';
import PayedHistoryModal from '../components/modals/payedHistory';

import { roundeNumber } from '../utils/helper';
const monthFormat = "MM/YYYY";

const Report = () => {
    const { confirm } = Modal;
  const [showDetailModal,setShowDetailModal]=useState(false)
  const [showPayedHistoryModal,setShowPayedHistoryModal]=useState(false)

  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [tableData,setTableData]=useState([])
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const [totalCalReport,setTotalCalReport]=useState({
    total:0,
    collected:0,
    pendings:0,
    monthlyFoodExpense:0
  })
  const [selectedObj,setSelectedObj]=useState({})
  useEffect(() => {
    onFetchAllReports();
  }, [selectedMonth]);

  const onFetchAllReports = async () => {
    try {
      setLoading(true);
      const startDate = moment(new Date(selectedMonth))
        .startOf("month")
        .format("YYYY-MM-DD hh:mm");
      const endDate = moment(new Date(selectedMonth))
        .endOf("month")
        .format("YYYY-MM-DD hh:mm");
      const data = await allReports({startDate,endDate});
      let totalMonthlyExpenses=0;
       let totalMonths=0;
       data.data.map(itm=>{
           totalMonthlyExpenses+=itm.totalSpend;
           totalMonths+=itm.totalNumberOfDays
       })
       const perUserFoodExp=totalMonthlyExpenses/totalMonths;
       const newRecord=[];
       let totalAmount=0,totalCollections=0,totalPending=0,monthlyFoodExpense=0
      data.data.map(itm=>{
         const total=((perUserFoodExp*itm.totalNumberOfDays)+itm.totalOtherExpense)-itm.totalSpend.toFixed(2)
         let totalPayedAmount=0;
         if(total>0){
         totalAmount+=total;
         itm.config[0]?.paymentHistory?.map(payedAmount=>{
          totalPayedAmount+=payedAmount.amount
         })
         totalCollections+=totalPayedAmount;
         totalPending+=(total-totalPayedAmount);
        }
        newRecord.push({...itm,
            expense:((perUserFoodExp*itm.totalNumberOfDays)+itm.totalOtherExpense).toFixed(2),
            total,
            totalPayedAmount
        })
        //calculate monthly food expense
        monthlyFoodExpense+=itm.totalSpend;
      })
      setTotalCalReport({total:totalAmount,collected:totalCollections,pendings:totalPending,monthlyFoodExpense})
      setTableData(newRecord)
      setLoading(false);
    } catch (err) {
      toast(err.message);
      setLoading(false);
    }
  };
  const columns=[
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render:(_,record)=>(
            <div style={{cursor:"pointer",color:"blue"}}
            onClick={()=>{
                setSelectedObj(record)
                setShowDetailModal(true)
            }}
            >{record.name}</div>
        )
      },
      {
        title: "Spend",
        dataIndex: "totalSpend",
        key: "totalSpend",
      },
      {
        title: "Expense",
        dataIndex: "expense",
        key: "expense",
      },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: (_, record) => (
        <div style={{fontWeight:"bold",color:record.total>=0?"black":"red"}} >{roundeNumber(record.total)}</div>
        )
      },
      {
        title: "Payed",
        dataIndex: "payed",
        key: "payed",
        render:(_,record)=>(
          <div style={{cursor:"pointer",color:"blue"}}
          onClick={()=>{
            setSelectedObj(record)
            setShowPayedHistoryModal(true)
          }}
          >{record.totalPayedAmount}</div>
      )
        // render: (_, record) => (
        //   <>
        //       <Checkbox
        //         onChange={() => onConfirmModal(record,record?.config[0]?.payed)}
        //         checked={record?.config[0]?.payed}
        //       />
            
        //   </>
        // ),
      },
  ]

   const handlePay=async(record,payed)=>{
    try{
      setLoading(true)
     let data={payed:!payed,paymentHistory:[{amount:10,comments:"test 123"}]}
     if(record.config.length){
       data.id=record.config[0]._id
     }else{
      data.date=new Date(selectedMonth);
      data.user=record._id
     }
     await markePayedUnpayed(data)
     onFetchAllReports()
     setLoading(false)
    }
    catch(err){
      setLoading(false)
    }
   }
  const onConfirmModal = (record,payed) => {
    confirm({
      title:!payed?"Marked Payed":"Marked Unpayed",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handlePay(record,payed);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      //filters,
      // ...sorter,
    });
  };
  const handleMonthChange = (e, date) => {
    setSelectedMonth(e);
  };
  return <>
   <div style={{ display: "flex", justifyContent: "space-between" }}>
        <DatePicker
          style={{ width: "48%" }}
          size="middle"
          allowClear={false}
          onChange={(e, date) => {
            handleMonthChange(e, date);
          }}
          value={dayjs(selectedMonth.format(monthFormat), monthFormat)}
          format={monthFormat}
          picker="month"
        />
      </div>

      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{x:"100%"}}
      />
      {
          showDetailModal&&
          <DetailsModal
           show={showDetailModal}
           setShow={()=>setShowDetailModal(false)}
           selectedObj={selectedObj}
          />
      }

{
          showPayedHistoryModal&&
          <PayedHistoryModal
           show={showPayedHistoryModal}
           setShow={()=>setShowPayedHistoryModal(false)}
           selectedObj={selectedObj}
           onFetchAllReports={onFetchAllReports}
          />
      }

      <div style={{padding:"0 15px",lineHeight:"30px"}}>
      <div style={{display:"flex",justifyContent:"space-between"}}>
          <label>Food Expense:</label>
          <label style={{fontWeight:"bolder",fontSize:"22px"}}>{roundeNumber(totalCalReport.monthlyFoodExpense)}</label>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <label>Need To Collect:</label>
          <label style={{fontWeight:"bold"}}>{roundeNumber(totalCalReport.total)}</label>
        </div>

        <div style={{display:"flex",justifyContent:"space-between"}}>
          <label>Collected:</label>
          <label style={{fontWeight:"bold"}}>{roundeNumber(totalCalReport.collected)}</label>
        </div>

        <div style={{display:"flex",justifyContent:"space-between"}}>
          <label>Pending:</label>
          <label style={{fontWeight:"bold"}}>{roundeNumber(totalCalReport.pendings)}</label>
        </div>

      </div>
  </>;
};

export default Report;
