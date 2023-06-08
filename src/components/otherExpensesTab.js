import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Tag,
  Radio
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
import { getUsersList, addNewOtherExpense, getOtherExpense, updateOtherExpense, deleteOtherExpense } from "../services/api";
import { formateDate, roundeNumber } from '../utils/helper';
const monthFormat = "MM/YYYY";

const OtherExpense = () => {
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
    note: "",
    amount: "",
    user: [],
    date: new Date(),
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedObj, setSelectedObj] = useState({});
  const [month, setMonth] = useState(moment().format(monthFormat));
  const [isMonthly, setIsMonthly] = useState(false)
  useEffect(() => {
    onFetchUsers(new Date());
  }, []);
  useEffect(() => {
    if (allUsers.length) onFetchReceipts();
  }, [allUsers]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await deleteOtherExpense(record._id)
      setLoading(false);
      onFetchReceipts();
    } catch (err) {
      console.log(err);
      toast(err.message)
      setLoading(false);
    }
  };
  const onFetchUsers = async (date) => {
    try {
      const startDate = moment(new Date(date))
        .startOf("month")
        .format("YYYY-MM-DD hh:mm");
      const endDate = moment(new Date(date))
        .endOf("month")
        .format("YYYY-MM-DD hh:mm");
      const data = await getUsersList({ startDate, endDate });
      setAllUsers(data.data);
    } catch (err) {
      toast(err?.message);
    }
  };
  const onFetchReceipts = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        startDate = moment(new Date()).startOf("month").format("YYYY-MM-DD hh:mm");
        endDate = moment(new Date()).endOf("month").format("YYYY-MM-DD hh:mm");
      }
      setTableLoading(true);
      let query = { startDate, endDate }
      const data = await getOtherExpense(query)
      setData(data.data?.map(itm => {
        return { ...itm, copyDate: itm.date, date: formateDate(itm.date) }
      }));
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
      render: (_, record) => (
        <span>
          {
            record.user.map((usr, key) => (
              <Tag color={"blue"} key={"tag" + key}>
                {usr.name}
              </Tag>
            ))
          }
        </span>
      )
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
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
                note: record.note,
                amount: record.amount*record.user.length,
                user: record.user.map(itm => itm._id),
                date: moment(record.copyDate).format("YYYY-MM-DD"),
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
    setTableParams({
      pagination,
      //filters,
      // ...sorter,
    });
  };

  const handleSubmit = async () => {
    try {

      if (!addFrom.note || !addFrom.amount || !addFrom.user.length) {
        return;
      }
      let reqBody = [];
      if (isMonthly) { 
        let selectedUsers = {};
        expenseDivideOnDays().map(itm => {
          const obj = itm.days.toString();
          if (selectedUsers[obj]) {
            selectedUsers[obj].user.push(itm._id)
          } else {
            selectedUsers[obj] = {
              user: [itm._id],
              date: addFrom.date,
              note: addFrom.note,
              amount: itm.total
            }
          }
        })
        Object.entries(selectedUsers).map(([key, val], index) => {
          reqBody.push(val)
        })
      } else {
        reqBody.push({ ...addFrom, amount: (+addFrom.amount)/addFrom.user.length })
      }
      setLoading(true);
      if (selectedObj._id) {
        //udpate record
        await updateOtherExpense(selectedObj._id, reqBody)
        toast("Updated successfully");
      } else {
        //add new record
        await addNewOtherExpense(reqBody);
        toast("Added successfully");
      }

      onFetchReceipts();
      setLoading(false);
      setShowAddModal(false);
      setAddForm({
        item: "",
        amount: "",
        user: [],
        date: new Date(),
      });
    } catch (err) {
      toast(err.message)
      console.log(err);
      setLoading(false);
    }
  };

  const handleSearch = () => { };

  const handleMonthChange = (e, date) => {
    const startOfMonth = moment(new Date(e)).startOf("month").format("YYYY-MM-DD hh:mm");
    const endOfMonth = moment(new Date(e)).endOf("month").format("YYYY-MM-DD hh:mm");
    onFetchReceipts(startOfMonth, endOfMonth);
    setMonth(date);
  };

  const expenseDivideOnDays = () => {
    const findUsers = [];
    let selectedUsers = [];
    let totalDays = 0;
    addFrom.user.map(itm => {
      const find = allUsers.filter(us => us._id == itm)
      findUsers.push(find[0])
    })
    findUsers.map(config => {
      if (config.config.length) {
        selectedUsers.push({ name: config.name, _id: config._id, days: config.config[0].totalDays })
        totalDays += config.config[0].totalDays
      }
    })
    const perDayAmount = addFrom.amount / totalDays;
    selectedUsers.map(itm => {
      itm.total = perDayAmount * itm.days
    })
    console.log("asdfasfasfasfa", selectedUsers)
    return selectedUsers

  }
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        scroll={{ x: "100%" }}
      />
      <Button
        onClick={() => {
          setShowAddModal(true);
          setSelectedObj({});
          setAddForm({
            amount: "",
            user: [],
            date: new Date(),
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
        maskClosable={false}
        footer={false}
        title={selectedObj._id ? "Update Record" : "Add New Entry"}
        open={showAddModal}
        onOk={() => alert("submit")}
        onCancel={() => setShowAddModal(false)}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={12}>
          <Input
            style={{ width: "100%" }}
            value={moment(addFrom.date).format("YYYY-MM-DD")}
            type={"date"}
            onChange={(e) => {
              const month1 = moment(e.target.value).format("MM")
              const month2 = moment(addFrom.date).format("MM")
              if (month1 !== month2)
                onFetchUsers(e.target.value)
              setAddForm({ ...addFrom, date: e.target.value });
            }}
          />
          <Select
            mode="multiple"
            status={!addFrom.user ? "error" : ""}
            style={{ width: "100%" }}
            showSearch={false}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={addFrom.user}
            placeholder={"Select user"}
            onChange={(e) => {
              setAddForm({ ...addFrom, user: e });
            }}
            options={allUsers.map((usr, key) => {
              return { value: usr._id, label: usr.name, key: "key" + key }
            })}

          />

          <Radio.Group onChange={(e) => setIsMonthly(e.target.value)} value={isMonthly}>
            <Radio value={false}>Full Month</Radio>
            <Radio value={true}>Days</Radio>
          </Radio.Group>
          <div style={{ display: "flex", columnGap: "10px" }}>
            <Input
              status={!addFrom.amount ? "error" : ""}
              size="large"
              placeholder="Total Amount"
              type="number"
              value={addFrom.amount}
              onChange={(e) => setAddForm({ ...addFrom, amount: e.target.value })}
            />
            {!isMonthly && <label style={{ fontWeight: "bolder" }}>{roundeNumber(addFrom?.amount / addFrom.user.length) || 0}</label>}
          </div>
          {
            isMonthly && <div>
              <Table
                columns={[
                  {
                    title: "Name",
                    dataIndex: "name",
                    key: "name",
                  },
                  {
                    title: "Days",
                    dataIndex: "days",
                    key: "days",
                  },
                  {
                    title: "Total",
                    dataIndex: "total",
                    key: "total",
                    render: (_, record) => (
                      <span>
                        {roundeNumber(record.total)}
                      </span>
                    )
                  },

                ]}
                dataSource={expenseDivideOnDays()}
                pagination={false}
                scroll={{ x: "100%" }}
              />
            </div>
          }
          <Input
            status={!addFrom.note ? "error" : ""}
            size="large"
            placeholder="Note"
            value={addFrom.note}
            onChange={(e) => setAddForm({ ...addFrom, note: e.target.value })}
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

export default OtherExpense;
