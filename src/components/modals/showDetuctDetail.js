import React, { useState } from "react";
import {  Modal, Table,Tooltip } from "antd";
import Loader from "../loading";
import { toast } from "react-toastify";
import { deleteColectAmount } from "../../services/api";
import moment from 'moment';
import { DeleteOutlined,ExclamationCircleFilled} from "@ant-design/icons";

const DetuctDetailsListOfAmount = ({ show, hide, reFetch,selectedObj }) => {
  const { confirm } = Modal;

  const [loading,setLoading]=useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
   console.log("selectedobject",selectedObj)

  const handleDelete = async (record) => {
        try {
          setLoading(true);
          await deleteColectAmount({amount:record.amount,id:selectedObj._id},record._id)
          setLoading(false)
          reFetch()
          hide()
    } catch (err) {
      setLoading(false);
      toast(err.message);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render:(_,record)=>(
        <>{moment(record.date).format("DD-MMM-YY")}</>
      )
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render:(_,record)=>(
        <Tooltip placement="top" title={record.note}>
          <span style={{color:"blue"}}>{record.amount}</span>
        </Tooltip>
      )
    },
   
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render:(_,record)=>(
        <>
           <DeleteOutlined  onClick={() => {
              showDeleteConfirm(record);
            }} style={{background:"#555050",padding:"2px",borderRadius:'3px',color:"white"}}/>
          </>
      )
    },
  ]

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      //filters,
      // ...sorter,
    });
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this Entry?",
      icon: <ExclamationCircleFilled />,
      // content: "Some descriptions",
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
  return (
    <Modal
      footer={false}
      title={"Collect from "+selectedObj.name}
      open={show}
      onOk={() => alert("submit")}
      onCancel={hide}
    >
       <Table
        columns={columns}
        dataSource={selectedObj.collectedMony}
        loading={loading}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{ x: "100%" }}
      />
      {/* {loading && <Loader />} */}
    </Modal>
  );
};

export default DetuctDetailsListOfAmount;
