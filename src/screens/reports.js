import React, { useEffect, useState } from "react";
import { allReports,markePayedUnpayed } from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import moment from "moment";
import { DatePicker, Checkbox, Table, Spin, Modal,Input } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import DetailsModal from '../components/modals/user_details';
import { roundeNumber } from '../utils/helper';
const monthFormat = "MM/YYYY";

const Report = () => {
    const { confirm } = Modal;
  const [showDetailModal,setShowDetailModal]=useState(false)
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [tableData,setTableData]=useState([])
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
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
      data.data.map(itm=>{
          //if(itm.config.length)
        newRecord.push({...itm,
            expense:((perUserFoodExp*itm.totalNumberOfDays)+itm.totalOtherExpense).toFixed(2),
            total:((perUserFoodExp*itm.totalNumberOfDays)+itm.totalOtherExpense)-itm.totalSpend.toFixed(2)
        })
      })
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
        render: (_, record) => (
          <>
              <Checkbox
                onChange={() => onConfirmModal(record,record?.config[0]?.payed)}
                checked={record?.config[0]?.payed}
              />
            
          </>
        ),
      },
  ]

   const handlePay=async(record,payed)=>{
    try{
      setLoading(true)
     let data={payed:!payed}
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
  </>;
};

export default Report;
