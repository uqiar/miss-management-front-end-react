import React, { useEffect, useState } from "react";
import { getUsersList } from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { DatePicker, Checkbox, Table, Spin, Modal,Input } from "antd";
import moment from "moment";
import {
  monthlyUserConfig,
  newUserConfigure,
  configDelete,
  configUpdate
} from "../services/api";
import { ExclamationCircleFilled } from "@ant-design/icons";
const monthFormat = "MM/YYYY";

const Configure = () => {
  const [userList, setUserList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [tableData, setTableData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [daysUpdate,setDaysUpdate]=useState(0)
  const [selectedObj,setSelectedObj]=useState({})
  const [showUpdateModal,setShowUpdateModal]=useState(false)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const { confirm } = Modal;

  useEffect(() => {
    onFetchUsers();
  }, []);

  useEffect(() => {
    if (userList.length) {
      fetchConfigureUser();
    }
  }, [userList, selectedMonth]);

  const fetchConfigureUser = async () => {
    try {
      const startDate = moment(new Date(selectedMonth))
        .startOf("month")
        .format("YYYY-MM-DD hh:mm");
      const endDate = moment(new Date(selectedMonth))
        .endOf("month")
        .format("YYYY-MM-DD hh:mm");
      const data = await monthlyUserConfig({ startDate, endDate });
      setTableData(
        userList.map((itm) => {
          itm.active = false;
          itm.days = "-";
          let findActive = data.data.find((config) => config.user == itm._id);
          if (findActive) {
            itm.active = true;
            itm.days = findActive.totalDays;
            itm.activeUserId = findActive._id;
          }
          return { ...itm };
        })
      );
    } catch (err) {
      toast(err.message);
    }
  };

  const onFetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersList();
      setUserList(data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast(err.message);
    }
  };

  const handleMonthChange = (e, date) => {
    setSelectedMonth(e);
  };

  const handleChecked = async (record) => {
    try {
      let endDayOfTheMonth = moment(new Date(selectedMonth))
        .endOf("month")
        .format("YYYY-MM-DD hh:mm");
      setLoading(true);
      if (record.active) {
        await configDelete(record.activeUserId);
      } else {
        await newUserConfigure({
          date: new Date(endDayOfTheMonth),
          user: record._id,
          totalDays: moment(endDayOfTheMonth).daysInMonth(),
        });
      }
      fetchConfigureUser();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast(err.message);
    }
  };
  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
      render: (_, record) => (
          <div style={{color:"blue",fontWeight:'bold'}} onClick={()=>{
              setSelectedObj(record)
              setShowUpdateModal(true)
              setDaysUpdate(record.days)
          }}>
              {record.days}
          </div>
      )
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (_, record) => (
        <>
          {loading ? (
            <Spin />
          ) : (
            <Checkbox
              onChange={() => onConfirmModal(record)}
              checked={record.active}
            />
          )}
        </>
      ),
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

  const onConfirmModal = (record) => {
    confirm({
      title: "Are you sure",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleChecked(record);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleMonthDaysUpdate=async()=>{
      try{
       await configUpdate(selectedObj.activeUserId,{totalDays:+daysUpdate})
       fetchConfigureUser()
      }catch(err){
          toast(err.message)
      }
  }
  return (
    <div>
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
      />
      {showUpdateModal&&<Modal 
      title="Edit Days" 
      open={showUpdateModal} 
      onOk={()=>{
          if(!daysUpdate)
          return
          handleMonthDaysUpdate()
        setShowUpdateModal(false)
    }}
      onCancel={()=>setShowUpdateModal(false)}>
     <Input type="number" value={daysUpdate} onChange={(e)=>{
         if(+e.target.value>31||+e.target.value<0)
         return
         setDaysUpdate(e.target.value)
     }}/>
      </Modal>}

    </div>
  );
};

export default Configure;
