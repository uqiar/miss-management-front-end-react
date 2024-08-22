import React from 'react';
import {
    Modal,
} from "antd";
import { roundeNumber } from '../../utils/helper';

const DetailsModal = ({ show, setShow, selectedObj }) => {
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
                <div style={{ zIndex: 999 }}>
                    <div style={{ display: 'flex', justifyContent: "space-between", fontWeight: "bold" }}>
                        <div style={{ fontWeight: 500 }}>Food Expense</div>
                        <div>{"+" + roundeNumber(+selectedObj.expense - selectedObj.totalOtherExpense)}</div>
                    </div>
                    {
                        selectedObj.otherExpenses?.map((itm, key) => (
                            <div style={{ display: 'flex', justifyContent: "space-between", fontWeight: "bold" }} key={"otherExpense" + key}>
                                <div style={{ fontWeight: 500 }}>{itm.note}</div>
                                <div>{"+" + itm.amount.toFixed(2)}</div>
                            </div>
                        ))
                    }
                    <div style={{ display: 'flex', justifyContent: "space-between", fontWeight: "bold" }}>
                        <div style={{ fontWeight: 500 }}>Total Spend</div>
                        <div>{"-" + selectedObj.totalSpend}</div>
                    </div>
                    <hr />

                    <div style={{ display: 'flex', justifyContent: "space-between", fontWeight: "bold" }}>
                        <div>Total</div>
                        <div>=</div>
                        <div>{+selectedObj.total}</div>
                    </div>
                </div>
                <div style={{
                    top: "0%",
                    right: "30%",
                    position: "absolute",
                    zIndex: 0,

                }}>
                    <p style={{
                        color: "lightgrey",
                        fontSize: "20px",
                        transform: "rotate(300deg)",
                        WebkitTransform: "rotate(300deg)"
                    }}>{selectedObj.config.length && selectedObj.config[0].payed ? "Payed" : "NOT PAYED"}</p>
                </div>
            </div>
        </Modal>
    )
}

export default DetailsModal;