import React, { useEffect, useState ,useContext} from "react";
import { getallTourFunBooking } from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import moment from "moment";
import { DatePicker, Table, Modal,Button } from "antd";
import DetailsModal from '../components/modals/bookingDetails';
import MyContext  from '../context/appContext';
import { roundeNumber } from '../utils/helper';
import { EyeOutlined } from '@ant-design/icons';

const monthFormat = "MM/YYYY";

const TourFun = () => {
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
    onFetchAllReports();
  }, [selectedMonth]);

  const onFetchAllReports = async () => {
    try {
      setLoading(true);
      // const startDate = moment(new Date(selectedMonth))
      //   .startOf("month")
      //   .format("YYYY-MM-DD hh:mm");
      // const endDate = moment(new Date(selectedMonth))
      //   .endOf("month")
      //   .format("YYYY-MM-DD hh:mm");
      const data = await getallTourFunBooking();
          

       const allBooking=data?.data?.map(itm=>{
        return {...itm,date:moment(itm.date).format("DD-MM-YY")}
       })
       
      setTableData(allBooking)
      setLoading(false);
    } catch (err) {
      toast(err.message);
      setLoading(false);
    }
  };
  const columns=[
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Persons",
        dataIndex: "numberOfPeople",
        key: "numberOfPeople",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
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
                }}type="primary" shape="round" icon={<EyeOutlined />} size="small" />

               

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
   {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
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
      </div> */}

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
           refetch={onFetchAllReports}
          />
      }
  </>;
};

export default TourFun;
