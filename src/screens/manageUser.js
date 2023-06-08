import React, { useState, useEffect } from "react";
import { Space, Table, Button, Modal, Input, Select, Tag } from "antd";
import { EditOutlined, PlusOutlined ,DeleteFilled,ExclamationCircleFilled} from "@ant-design/icons";
import Loader from '../components/loading';
import {  toast } from 'react-toastify';
import { getUsersList,registerUser,updateUser ,deleteUser} from '../services/api';

const ManageUser = () => {
  const { Option } = Select;

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFrom, setAddForm] = useState({
    userName: "",
    name: "",
     password: "",
      role:"NORMAL",
      active:true
  });
  const [allUsers, setAllUsers] = useState([]);
   const [loading,setLoading]=useState(false)
   const [tableLoading,setTableLoading]=useState(false)
   const [selectedObj,setSelectedObj]=useState({})
  useEffect(() => {
    onFetchUsers();
  }, []);

  const { confirm } = Modal;

  const onFetchUsers = async () => {
    try {
      setTableLoading(true)
       const data=await getUsersList({isAll:true})
      setAllUsers(data.data?.map(itm=>{
        return {...itm,userName:itm.email,access:itm.role}
      }));
      setTableLoading(false)
    } catch (err) {
      setTableLoading(false)
      toast(err.message)
    }
  };
 

  
  const columns = [
   
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Login ID",
      dataIndex: "userName",
      key: "userName",
    },
    // {
    //   title: "Password",
    //   dataIndex: "password",
    //   key: "password",
    // },
    {
      title: "Access",
      dataIndex: "access",
      key: "access",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render:(_,record)=>(
       record.active==true?
       <Tag color="#108ee9">Active</Tag>:
       record.active==false?
       <Tag color="#f50">Inactive</Tag>:
       <Tag color="#108ee9">Active</Tag>
      )
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
        <Space size="middle" style={{marginRight:"10px"}}>
          <EditOutlined style={{ color: "#0724f4", fontSize: "16px",cursor:'pointer' }} onClick={()=>{
            setSelectedObj(record)
             setAddForm({
              userName:record.email,
              name:record.name,
               password:record.password,
                role:record.role,
                active:record?.active==true?true:record?.active==false?false:true
             })
             setShowAddModal(true)
          }} />
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


  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await deleteUser(record._id)
      setLoading(false);
      onFetchUsers();
    } catch (err) {
      console.log(err);
      toast(err.message)
      setLoading(false);
    }
  };
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
    setTableParams({
      pagination,
      //filters,
      // ...sorter,
    });
  };

  const handleSubmit = async() => {
    try{
      if(!addFrom.name||!addFrom.userName||!addFrom.password)
      return
      setLoading(true)
      let data={
        email:addFrom.userName,
        name:addFrom.name,
        password:addFrom.password,
        role:addFrom.role,
        active:addFrom.active
      }
      console.log("sadfasdfasdfas",data)
      if(selectedObj._id){
        //update user
        await updateUser(selectedObj._id,data)
        toast("Updated successfully")
      }else{
        //add new user
      await registerUser(data)
      toast("Added successfully")
      }
      onFetchUsers()
      setLoading(false)
      setShowAddModal(false)
    }catch(err){
        setLoading(false)
    }
  };

  return (
    <div style={{ position: "relative"}}>
      <Table
        columns={columns}
        dataSource={allUsers}
        loading={tableLoading}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{x:"100%"}}
        
      />
      <Button
        onClick={() => {
          setAddForm({
            userName: "",
    name: "",
     password: "",
      role:"NORMAL"
          })
          setShowAddModal(true);
          setSelectedObj({})
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
        title={selectedObj._id?"Update User":"Add New User"}
        open={showAddModal}
        onOk={() => alert("submit")}
        onCancel={() => setShowAddModal(false)}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={12}>
          <Select
            style={{ width: "100%" }}
            showSearch={true}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={addFrom.role}
            placeholder={"Role"}
            onChange={(e) => {
              setAddForm({ ...addFrom, role: e });
            }}
          >
              <Option key={"option" + 1} value={"ADMIN"}>
                Admin
              </Option>
              <Option key={"option" + 2} value={"NORMAL"}>
                Normal
              </Option>
          </Select>
          <Input
          status={!addFrom.name?"error":''}
            size="large"
            placeholder="User Name"
            value={addFrom.name}
            onChange={(e) => setAddForm({ ...addFrom, name: e.target.value })}
          />
          <Input
          status={!addFrom.userName?"error":''}
            size="large"
            placeholder="Login ID"
            type="string"
            value={addFrom.userName}
            onChange={(e) => setAddForm({ ...addFrom, userName: e.target.value })}
          />
            <Input
          type={selectedObj._id?"password":"text"}
            status={!addFrom.password?"error":''}
            size="large"
            placeholder="Password"
            disabled={selectedObj._id?true:false}
            value={addFrom.password}
            onChange={(e) => setAddForm({ ...addFrom, password: e.target.value })}
          />
          <Select
            style={{ width: "100%" }}
            showSearch={false}
            value={addFrom.active}
            placeholder={"Active"}
            onChange={(e) => {
              setAddForm({ ...addFrom, active: e });
            }}
          >
              <Option key={"active" + 1} value={true}>
                Active
              </Option>
              <Option key={"inactive" + 2} value={false}>
                Inactive
              </Option>
          </Select>
          <Button onClick={handleSubmit} type="primary" block>
            Submit
          </Button>
        </Space>
        {
          loading&&<Loader/>
      }
      </Modal>

     
    </div>
  );
};

export default ManageUser;
