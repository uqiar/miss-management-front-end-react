import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Form,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DeleteFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import moment from "moment";
import Loader from "../components/loading";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { getUsersList, addNewItem,getItem,updateItem,deleteItem } from "../services/api";
import { formateDate  } from '../utils/helper';
const monthFormat = "MM/YYYY";

const DailyEntry = () => {
  const { Option } = Select;
  const { confirm } = Modal;
  const { Search } = Input;

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFrom, setAddForm] = useState({
    item: "",
    amount: "",
    user: "",
    date: new Date(),
    userName:""
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedObj, setSelectedObj] = useState({});
  const [month, setMonth] = useState(moment().format(monthFormat));
  const [allData,setAllData]=useState([])
  useEffect(() => {
    onFetchUsers();
  }, []);
  useEffect(() => {
    if (allUsers.length) onFetchReceipts();
  }, [allUsers]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
       await deleteItem(record._id)
      setLoading(false);
      onFetchReceipts();
    } catch (err) {
      console.log(err);
      toast(err.message)
      setLoading(false);
    }
  };
  const onFetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsersList();
      setAllUsers(data.data);
      setLoading(false)
    } catch (err) {
      setLoading(false)
      toast(err?.message);
    }
  };
  const onFetchReceipts = async (startDate, endDate) => {
    try {
      if(!startDate||!endDate){
        startDate = moment(new Date()).startOf("month").format("YYYY-MM-DD hh:mm");
        endDate = moment(new Date()).endOf("month").format("YYYY-MM-DD hh:mm");
      }
      setTableLoading(true);
      let query={startDate,endDate}
      const data=await getItem(query)
      let mapResult=data.data?.map(itm=>{
        return {...itm,user:itm?.userName,userID:itm?.user?._id,date:formateDate(itm.date)}
      })
      setData(mapResult);
      setAllData(mapResult)
      setTableParams({
        pagination: {
          current: 1,
          pageSize: 5,
        }
      })
      setTableLoading(false);
    } catch (err) {
      console.log(err);
      setTableLoading(false);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
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

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Space
            size="middle"
            style={{ marginRight: "10px", cursor: "pointer" }}
            onClick={() => {
              setSelectedObj(record);
              setAddForm({
                item: record.item,
                amount: record.amount,
                user: record.user,
                date: new Date(record.date),
                userName:record.userName
              });
              setShowAddModal(true);
            }}
          >
            <EditOutlined style={{ color: "#0724f4", fontSize: "16px" }} />
          </Space>
          <Space
            size="middle"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedObj(record);
              showDeleteConfirm(record);
            }}
          >
            <DeleteFilled style={{ color: "orange", fontSize: "16px" }} />
          </Space>
        </>
      ),
    },
  ];

  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(record);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    console.log({ pagination, filters, sorter });
    setTableParams({
      pagination,
      //filters,
      // ...sorter,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!addFrom.item || !addFrom.amount || !addFrom.user) {
        return;
      }
      setLoading(true);
      if (selectedObj._id) {
          const findCurrentUser=allUsers.find(itm=>itm.name==addFrom.user)
        //udpate record
         await updateItem(selectedObj._id,{...addFrom,amount:+addFrom.amount,user:findCurrentUser._id})
        toast("Updated successfully");
      } else {
        //add new record
        await addNewItem({...addFrom,amount:+addFrom.amount});
        toast("Added successfully");
      }

      onFetchReceipts();
      setLoading(false);
      setShowAddModal(false);
      setAddForm({
        item: "",
        amount: "",
        user: "",
        date: new Date(),
        userName:""
      });
    } catch (err) {
      toast(err.message)
      console.log(err);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if(e){
      const filterData=allData.filter(itm=>itm.userID==e)
      setData(filterData)
    }else{
      setData(allData)
    }
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 5,
      }
    })
  };
  console.log("my data",allData)

  const handleMonthChange = (e, date) => {
    const startOfMonth = moment(new Date(e)).startOf("month").format("YYYY-MM-DD hh:mm");
    const endOfMonth = moment(new Date(e)).endOf("month").format("YYYY-MM-DD hh:mm");
    onFetchReceipts(startOfMonth, endOfMonth);
    setMonth(date);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Select
            allowClear
            style={{ width: "50%" }}
            showSearch={true}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            //value={addFrom.user}
            placeholder={"Select user"}
            onChange={handleSearch}
          >
            {allUsers.map((usr, key) => (
              <Option key={"option" + key} value={usr._id}>
                {usr.name}
              </Option>
            ))}
          </Select>
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
      <Button
        onClick={() => {
          setShowAddModal(true);
          setSelectedObj({});
          setAddForm({
            item: "",
            amount: "",
            user: "",
            date: new Date(),
            userName:""
          });
        }}
        style={{ position: "absolute", bottom: 0 }}
        type="primary"
        shape="circle"
        danger
        icon={<PlusOutlined style={{ fontSize: "100%" }} />}
        size="large"
      />

      <Modal
        footer={false}
        title="Add New Entry"
        open={showAddModal}
        onOk={() => alert("submit")}
        onCancel={() => setShowAddModal(false)}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={12}>
          <Input
            value={moment(addFrom.date).format("YYYY-MM-DD")}
            type={"date"}
            onChange={(e) => {
              setAddForm({ ...addFrom, date: e.target.value });
            }}
          />
          <Select
            status={!addFrom.user ? "error" : ""}
            style={{ width: "100%" }}
            showSearch={true}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={addFrom.user}
            placeholder={"Select user"}
            onChange={(e) => {
              const currentUSer=allUsers.find(itm=>itm._id===e)
              setAddForm({ ...addFrom, user: e,userName:currentUSer.name });
            }}
          >
            {allUsers.map((usr, key) => (
              <Option key={"option" + key} value={usr._id}>
                {usr.name}
              </Option>
            ))}
          </Select>
          <Input
            status={!addFrom.item ? "error" : ""}
            size="large"
            placeholder="items"
            value={addFrom.item}
            onChange={(e) => setAddForm({ ...addFrom, item: e.target.value })}
          />
          <Input
            status={!addFrom.amount ? "error" : ""}
            size="large"
            placeholder="amount"
            type="number"
            value={addFrom.amount}
            onChange={(e) => setAddForm({ ...addFrom, amount: e.target.value })}
          />
          <Button onClick={handleSubmit} type="primary" block>
            Submit
          </Button>
        </Space>
        {loading && <Loader />}
      </Modal>
    </div>
  );
};

export default DailyEntry;
