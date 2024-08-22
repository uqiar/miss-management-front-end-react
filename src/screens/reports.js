import React, { useEffect, useState } from "react";
import { allReports, markePayedUnpayed } from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import moment from "moment";
import { DatePicker, Checkbox, Table, Spin, Modal, Input } from "antd";
import { ExclamationCircleFilled, ArrowDownOutlined,ArrowUpOutlined } from "@ant-design/icons";
import DetailsModal from '../components/modals/user_details';
import PayedHistoryModal from '../components/modals/payedHistory';

import { roundeNumber } from '../utils/helper';
const monthFormat = "MM/YYYY";

const Report = () => {
  const { confirm } = Modal;
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPayedHistoryModal, setShowPayedHistoryModal] = useState(false)

  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [tableData, setTableData] = useState([])
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const [totalOtherExpense, setTotalOtherExpense] = useState(0)
  const [totalOtherExpenseDetails, setTotalOtherExpenseDetails] = useState({})
  const [otherExpensesDetails,setOtherExpensesDetails]=useState(false)

  let date1 = moment(new Date(selectedMonth));
  let date2 = moment(new Date("05/01/2024"));
  const [totalCalReport, setTotalCalReport] = useState({
    total: 0,
    collected: 0,
    pendings: 0,
    monthlyFoodExpense: 0
  })
  const [selectedObj, setSelectedObj] = useState({})
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
      const data = await allReports({ startDate, endDate });
      let totalMonthlyExpenses = 0;
      let totalMonths = 0;
      const listOfAllOtherExpenses = [];
      data.data.map(itm => {
        totalMonthlyExpenses += itm.totalSpend;
        totalMonths += itm.totalNumberOfDays;
        if (itm?.otherExpenses?.length)
          listOfAllOtherExpenses.push(...itm.otherExpenses)
      })
      const perUserFoodExp = totalMonthlyExpenses / totalMonths;
      const newRecord = [];
      let totalAmount = 0, totalCollections = 0, totalPending = 0, monthlyFoodExpense = 0
      data.data.map(itm => {
        const total = ((perUserFoodExp * itm.totalNumberOfDays) + itm.totalOtherExpense) - itm.totalSpend.toFixed(2)
        let totalPayedAmount = 0;
        if (total > 0) {
          totalAmount += Math.ceil(total);
          itm.config[0]?.paymentHistory?.map(payedAmount => {
            totalPayedAmount += payedAmount.amount
          })
          if (date1.isAfter(date2)) {
            totalCollections += totalPayedAmount;
            totalPending += (total - totalPayedAmount);
          } else {
            if (itm.config[0]?.payed)
              totalCollections += total;
            else
              totalPending += total;
          }

        }
        newRecord.push({
          ...itm,
          expense: ((perUserFoodExp * itm.totalNumberOfDays) + itm.totalOtherExpense).toFixed(2),
          total: Math.ceil(total),
          totalPayedAmount: Math.ceil(totalPayedAmount),
        })
        //calculate monthly food expense
        monthlyFoodExpense += itm.totalSpend;
      })
      setTotalCalReport({ total: totalAmount, collected: totalCollections, pendings: totalPending, monthlyFoodExpense })
      //sorting
      newRecord.sort((a, b) => b.totalSpend - a.totalSpend);

      setTableData(newRecord)
      setLoading(false);

      let addingOtherExpense = 0;
      let filterOtherExpense = {};

      listOfAllOtherExpenses.map(itm => {
        addingOtherExpense += itm.amount;
        if (filterOtherExpense[itm.note])
          filterOtherExpense[itm.note].amount += itm.amount
        else
          filterOtherExpense[itm.note] = { note: itm.note, amount: itm.amount }
      })
      setTotalOtherExpense(addingOtherExpense)
      setTotalOtherExpenseDetails(filterOtherExpense)
    } catch (err) {
      toast(err.message);
      setLoading(false);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div style={{ cursor: "pointer", color: "blue" }}
          onClick={() => {
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
        <div style={{ fontWeight: "bold", color: record.total >= 0 ? "black" : "red" }} >{roundeNumber(record.total)}</div>
      )
    },
    {
      title: "Payed",
      dataIndex: "payed",
      key: "payed",
      render: (_, record) => {
        if (date1.isAfter(date2))
          return (
            <div style={{ cursor: "pointer", color: record?.config?.[0]?.payed ? "#f39900" : "blue", fontWeight: "bold" }}
              onClick={() => {
                setSelectedObj(record)
                setShowPayedHistoryModal(true)
              }}
            >{record.totalPayedAmount}</div>
          )
        else
          return <Checkbox
            onChange={() => onConfirmModal(record, record?.config[0]?.payed)}
            checked={record?.config[0]?.payed}
          />

      }
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

  const handlePay = async (record, payed) => {
    try {
      setLoading(true)
      let data = { payed: !payed, paymentHistory: [{ amount: 10, comments: "test 123" }] }
      if (record.config.length) {
        data.id = record.config[0]._id
      } else {
        data.date = new Date(selectedMonth);
        data.user = record._id
      }
      await markePayedUnpayed(data)
      onFetchAllReports()
      setLoading(false)
    }
    catch (err) {
      setLoading(false)
    }
  }
  const onConfirmModal = (record, payed) => {
    confirm({
      title: !payed ? "Marked Payed" : "Marked Unpayed",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handlePay(record, payed);
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
      scroll={{ x: "100%" }}
    />
    {
      showDetailModal &&
      <DetailsModal
        show={showDetailModal}
        setShow={() => setShowDetailModal(false)}
        selectedObj={selectedObj}
      />
    }

    {
      showPayedHistoryModal &&
      <PayedHistoryModal
        show={showPayedHistoryModal}
        setShow={() => setShowPayedHistoryModal(false)}
        selectedObj={selectedObj}
        onFetchAllReports={onFetchAllReports}
      />
    }

    <div style={{ padding: "0 15px", lineHeight: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label>Food Expense:</label>
        <label style={{ fontWeight: "bolder", fontSize: "22px" }}>{roundeNumber(totalCalReport.monthlyFoodExpense)}</label>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label onClick={()=>setOtherExpensesDetails(!otherExpensesDetails)} style={{ cursor: "pointer" }}>All Other Expense: {otherExpensesDetails?<ArrowUpOutlined />:<ArrowDownOutlined />}</label>
        <label style={{ fontWeight: "bolder", fontSize: "22px" }}>{roundeNumber(totalOtherExpense)}</label>
      </div>

     {otherExpensesDetails&& <div style={{border:"1px solid darkgray",padding:"5px 5%",margin:"10px 0px",borderRadius:"10px",background:"aliceblue"}}>
        {Object.entries(totalOtherExpenseDetails).map(([key, value]) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>{key}</label>
            <label style={{}}>{roundeNumber(value?.amount)}</label>
          </div>

        ))}
      </div>}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label>Need To Collect:</label>
        <label style={{ fontWeight: "bold" }}>{roundeNumber(totalCalReport.total)}</label>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label>Collected:</label>
        <label style={{ fontWeight: "bold" }}>{roundeNumber(totalCalReport.collected)}</label>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label>Pending:</label>
        <label style={{ fontWeight: "bold" }}>{roundeNumber(totalCalReport.pendings)}</label>
      </div>

    </div>
  </>;
};

export default Report;
