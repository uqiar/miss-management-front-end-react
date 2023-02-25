import React,{useEffect,useState,useContext} from 'react';
import {
    Table,
    DatePicker,
  } from "antd";

  import moment from "moment";
  import { toast } from "react-toastify";
  import dayjs from "dayjs";
  import { getItem } from "../services/api";
  import { formateDate  } from '../utils/helper';
  import MyContext  from '../context/appContext';

  const monthFormat = "MM/YYYY";

const MySpending=()=>{
    const appContext = useContext(MyContext);
   const user=appContext.state?.user;
  const [data,setData]=useState([])
  const [tableLoading,setTableLoading]=useState(false)
  const [month, setMonth] = useState(moment().format(monthFormat));
  const [totalSpend,setTotalSpend]=useState(0)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
    useEffect(() => {
        if(user._id)
   onFetchReceipts();
      }, [user]);

      const onFetchReceipts = async (startDate, endDate) => {
        try {
          if(!startDate||!endDate){
            startDate = moment(new Date()).startOf("month").format("YYYY-MM-DD hh:mm");
            endDate = moment(new Date()).endOf("month").format("YYYY-MM-DD hh:mm");
          }
          setTableLoading(true);
          let query={startDate,endDate,user:user._id}
          const data=await getItem(query)
           let totalSpending=0;
          setData(data.data?.map(itm=>{
            totalSpending+=itm.amount;
            return {...itm,user:itm?.userName,date:formateDate(itm.date)}
          }));
          setTotalSpend(totalSpending)
          setTableLoading(false);
        } catch (err) {
            toast(err.message);
          setTableLoading(false);
        }
      };

      const columns = [
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
        },
        // {
        //   title: "User",
        //   dataIndex: "user",
        //   key: "user",
        // },
        {
          title: "Items",
          dataIndex: "item",
          key: "item",
        },
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
        },
      ];

      const handleTableChange = (pagination, filters, sorter) => {
        console.log({ pagination, filters, sorter });
        setTableParams({
          pagination,
          //filters,
          // ...sorter,
        });
      };

      const handleMonthChange = (e, date) => {
        const startOfMonth = moment(new Date(e)).startOf("month").format("YYYY-MM-DD hh:mm");
        const endOfMonth = moment(new Date(e)).endOf("month").format("YYYY-MM-DD hh:mm");
        onFetchReceipts(startOfMonth, endOfMonth);
        setMonth(date);
      };
    return(
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
            <span>Total Spend:</span>
            <span style={{marginLeft:'10px',fontWeight:"bold"}}>{totalSpend}</span>
        </div>
        <DatePicker
          allowClear={false}
          onChange={(e, date) => {
            handleMonthChange(e, date);
          }}
          value={dayjs(month, monthFormat)}
          format={monthFormat}
          picker="month"
        />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={tableLoading}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{x:"100%"}}
      />
        </>
    )
}

export default MySpending;