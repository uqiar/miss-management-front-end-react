import React, { useState, useEffect } from "react";
import { DeleteOutlined, ExclamationCircleFilled,PlusOutlined,MinusOutlined } from "@ant-design/icons";
import { Button, Table, Modal } from "antd";
import { getAllUserBookes, deleteAcountBook } from "../services/api";
import { toast } from "react-toastify";
import AddNewAcountModal from "../components/modals/newAcount";
import AddAmountModal from "../components/modals/addAmount";
import ReceiveAmountModal from "../components/modals/receiveAmount";
import AddAmountListModal from "../components/modals/showAddDetail";
import ColectDetailModal from "../components/modals/showDetuctDetail";
import ReportModal from "../components/modals/reportModal";

const MyPersonal = () => {
  const { confirm } = Modal;

  const [loading, setLoading] = useState(false);
  const [tabData, setTabData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const [showAddNewAcountModal, setShowAddNewAcountModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedObj, setSelectedObj] = useState({});
  const [showAddAmountModal, setShowAddAmountModal] = useState(false);
  const [showReceiveAmountModal, setShowReceiveAmountModal] = useState(false);
  const [showDetailsModal,setShowDetailsModal]=useState(false)
  const [showAddDeteailModal,setShowAddDeteailModal]=useState(false)
  const [showDeductDeteailModal,setShowDeductDeteailModal]=useState(false)
  useEffect(() => {
    onFetchAllBookes();
  }, []);

  const onFetchAllBookes = async () => {
    try {
      setLoading(true);
      const data = await getAllUserBookes();
      setTabData(data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast(err.message);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      //filters,
      // ...sorter,
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render:(_,record)=>(
        <div onClick={()=>{
          setSelectedObj(record)
          setShowDetailsModal(true)
        }} style={{cursor:"pointer",color:"blue"}}>
          {record.name}
        </div>
      )
    },
    {
      title: "Total",
     // dataIndex: "subTotal",
      key: "subTotal",
      render:(_,record)=>{
       return <div style={{color:record.subTotal>=0?"black":"red",fontWeight:"bold"}}>
        {record.subTotal}
        </div>
      },
      

    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <DeleteOutlined  onClick={() => {
              setSelectedObj(record);
              showDeleteConfirm(record);
            }} style={{background:"#555050",padding:"2px",borderRadius:'3px',color:"white",marginRight:"5px"}}/>
             <PlusOutlined  onClick={() => {
              setSelectedObj(record);
              setShowAddDeteailModal(true);
            }} style={{background:"#555050",padding:"2px",borderRadius:'3px',color:"white",marginRight:"5px"}}/>
             <MinusOutlined  onClick={() => {
              setSelectedObj(record);
              setShowDeductDeteailModal(true);
            }} style={{background:"#555050",padding:"2px",borderRadius:'3px',color:"white"}}/>
        </>
      ),
    },
  ];

  const handleDelete = async (record) => {
    try {
      setDeleteLoading(true);
      await deleteAcountBook(record._id);
      toast.success("Deleted Successfully!", {
        theme: "colored",
      });
      setDeleteLoading(false);
      onFetchAllBookes();
    } catch (err) {
      toast(err.message);
      setDeleteLoading(false);
    }
  };
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this Acount?",
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={() => {
            setShowAddNewAcountModal(true);
          }}
          type="primary"
          shape="round"
          size="small"
        >
          New Acount
        </Button>
        <Button
          onClick={() => {
            setShowAddAmountModal(true);
          }}
          type="primary"
          shape="round"
          size="small"
        >
          Add Amount
        </Button>
        <Button onClick={() => {
            setShowReceiveAmountModal(true);
          }}type="primary" shape="round" size="small">
          Receive Amount
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={tabData}
        loading={loading}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{ x: "100%" }}
      />
      {showAddNewAcountModal && (
        <AddNewAcountModal
          show={showAddNewAcountModal}
          hide={() => setShowAddNewAcountModal(false)}
          reFetch={onFetchAllBookes}
        />
      )}

      {showAddAmountModal && (
        <AddAmountModal
          show={showAddAmountModal}
          hide={() => setShowAddAmountModal(false)}
          reFetch={onFetchAllBookes}
          allUsers={tabData}
        />
      )}

{showReceiveAmountModal && (
        <ReceiveAmountModal
          show={showReceiveAmountModal}
          hide={() => setShowReceiveAmountModal(false)}
          reFetch={onFetchAllBookes}
          allUsers={tabData}
        />
      )}

      {
        showAddDeteailModal&&
        <AddAmountListModal
        show={showAddDeteailModal}
        hide={()=>setShowAddDeteailModal(false)}
         selectedObj={selectedObj}
         reFetch={onFetchAllBookes}
        />
      }
       {
       showDeductDeteailModal &&
        <ColectDetailModal
        show={showDeductDeteailModal}
        hide={()=>setShowDeductDeteailModal(false)}
         selectedObj={selectedObj}
         reFetch={onFetchAllBookes}
        />
      }
       {
       showDetailsModal &&
        <ReportModal
        show={showDetailsModal}
        hide={()=>setShowDetailsModal(false)}
         selectedObj={selectedObj}
         reFetch={onFetchAllBookes}
        />
      }
    </div>
  );
};

export default MyPersonal;
