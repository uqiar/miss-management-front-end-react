import React, { useEffect, useState ,useContext} from "react";
import { allReports } from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import moment from "moment";
import { DatePicker, Table, Modal,Button } from "antd";
import DetailsModal from '../components/modals/user_details';
import MyContext  from '../context/appContext';

const monthFormat = "MM/YYYY";

const MyReport = () => {
    const appContext = useContext(MyContext);
    const user=appContext.state?.user;
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
    if(user._id)
    onFetchAllReports();
  }, [selectedMonth,user]);

  const onFetchAllReports = async () => {
    try {
      setLoading(true);
      const startDate = moment(new Date(selectedMonth))
        .startOf("month")
        .format("YYYY-MM-DD hh:mm");
      const endDate = moment(new Date(selectedMonth))
        .endOf("month")
        .format("YYYY-MM-DD hh:mm");
      const data = await allReports({startDate,endDate,user:user._id});
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
        <div style={{fontWeight:"bold",color:record.total>=0?"black":"red"}} >{record.total}</div>
        )
      },
      {
        title: "Payed",
        dataIndex: "payed",
        key: "payed",
        render: (_, record) => (
          <>
          <div style={{fontWeight:"bold",color:record?.config[0]?.payed?"black":"red"}} >{record?.config[0]?.payed?"Paid":"Pending"}</div>
            
          </>
        ),
      },
      {
        title: "Details",
        dataIndex: "detials",
        key: "details",
        render: (_, record) => (
          <>
                <Button onClick={()=>{
                    setSelectedObj(record)
                    setShowDetailModal(true)
                }} type="primary" size="small">View</Button>

          </>
        ),
      },
  ]



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
        pagination={false}
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

export default MyReport;
