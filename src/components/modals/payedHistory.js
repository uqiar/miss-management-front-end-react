import React, { useState } from 'react';
import {
    Modal, Space,
    Table,
    Input, Button
} from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { markePayedUnpayed } from "../../services/api";

const DetailsModal = ({ show, setShow, selectedObj, onFetchAllReports }) => {
    console.log("selected object", selectedObj)
    const [loading, setLoading] = useState(false)
    const [newPayment, setNewPayment] = useState('')
    const [comment, setComment] = useState("")
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });
    const { confirm } = Modal;


    const handleDeletePaymentHistory = async (index) => {
        let copyOfPaymentHistory = [...selectedObj?.config?.[0]?.paymentHistory];
        copyOfPaymentHistory.splice(index, 1);
        try {
            setLoading(true)
            let data = {
                payed: false,
                paymentHistory: copyOfPaymentHistory,
                id: selectedObj?.config?.[0]._id
            }

            await markePayedUnpayed(data)
            onFetchAllReports()
            setShow(false)
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
        }

    }

    const onConfirmModal = (index) => {
        confirm({
            title: `Do you Want to delete this entry? ${selectedObj?.config?.[0]?.paymentHistory[index].amount}`,
            icon: <ExclamationCircleFilled />,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                handleDeletePaymentHistory(index)
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };
    const columns = [

        {
            title: "amount",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Comments",
            dataIndex: "comments",
            key: "comments",
        },




        {
            title: "Action",
            key: "action",
            render: (_, record, index) => (
                <>
                    <Space
                        size="middle"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            onConfirmModal(index)
                        }}
                    >
                        <DeleteFilled style={{ color: "red", fontSize: "16px" }} />
                    </Space>
                </>
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            //filters,
            // ...sorter,
        });
    };

    const handleAddPayment = async () => {
        const amount = +newPayment;
        if (!amount)
            return


        try {
            setLoading(true)
            let copyOfPaymentHistory = [...selectedObj?.config?.[0]?.paymentHistory||[]];
            copyOfPaymentHistory.push({
                amount,
                comments: comment
            })

            let data = { paymentHistory: copyOfPaymentHistory }
            if ((selectedObj.totalPayedAmount + amount) >= selectedObj.total)
                data.payed = true;
            if (selectedObj?.config?.length) {
                data.id = selectedObj.config[0]._id
            } else {
                alert("Please Add config for current user!")
            }
            await markePayedUnpayed(data)
            onFetchAllReports()
            setShow(false)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }
    return (
        <Modal
            footer={false}
            title={<div style={{
                textAlign: "center",
                fontFamily: "monospace"
            }}>{selectedObj?.name}</div>}
            open={show}
            onOk={() => alert("submit")}
            onCancel={() => setShow()}
        >
            <div style={{ position: "relative" }}>

                <div style={{ display: "flex", columnGap: "20px" }}>
                    <Input
                        type='number'
                        placeholder='Payed amount'
                        value={newPayment}
                        onChange={(e) => {
                            const amount = +e.target.value;
                            const totalRemainAmount = +selectedObj.total - selectedObj.totalPayedAmount
                            if (amount >= 0 && amount <= totalRemainAmount) {
                                setNewPayment(e.target.value)
                            }
                        }}
                    />
                    <Button disabled={loading} type="primary" onClick={handleAddPayment}>Save</Button>
                </div>
                <Input
                    style={{ marginTop: "10px" }}
                    type='text'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    size="large"
                    placeholder='Enter comment'
                />
                <hr />

                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={selectedObj?.config?.[0]?.paymentHistory || []}
                    pagination={tableParams.pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "100%" }}

                />


                <div style={{ display: 'flex', justifyContent: "space-between", fontWeight: "bold" }}>
                    <div>Total payable Amount</div>
                    <div>=</div>
                    <div>{(+selectedObj.total)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: "space-between", fontWeight: "bold" }}>
                    <div>Total payed Amount</div>
                    <div>=</div>
                    <div>{(+selectedObj.totalPayedAmount)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: "space-between", fontWeight: "bold" }}>
                    <div>Total Remain Amount</div>
                    <div>=</div>
                    <div 
                    onClick={()=>{
                       setNewPayment((+selectedObj.total - selectedObj.totalPayedAmount)) 
                    }}
                    style={{color:"blue",cursor:"pointer"}}>{(+selectedObj.total - selectedObj.totalPayedAmount)}</div>
                </div>

            </div>
        </Modal>
    )
}

export default DetailsModal;