import React, { useState, useEffect } from 'react';
import { Button, Input, } from "antd";
import moment from 'moment';
import { toast } from "react-toastify";
import { addSafariReport, getSafariReport, updateSafariReport } from '../services/api';

const DailyEntry = () => {
    const [formData, setFormData] = useState({})
    const [date, setDate] = useState(new Date())
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        findSafariReport()
    }, [date])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    const findSafariReport = async () => {
        try {
            const startDate = moment(date).format("YYYY-MM-DD");
            const endDate = moment(date).format("YYYY-MM-DD");
            setLoading(true)
            const doc = await getSafariReport({ startDate, endDate })
            setFormData(doc?.data?.length ? doc?.data[0] : {})
            setLoading(false);
        } catch (err) {
            toast(err.message)
            setLoading(false);
        }
    }
    const handleSubmit = async () => {
        try {
            //    if(navigator.onLine){
            //     toast("Online!",{type:"success"})
            //    }else{
            //     toast("offline!",{type:"success"})
            //    }
            //     return
            const dateFormat = moment(date).format("YYYY-MM-DD");
            if (formData._id) {
                await updateSafariReport(formData._id, { ...formData, date: dateFormat })
                toast("Updated Success!", { type: "success" })
            }
            else {
                const doc = await addSafariReport({ ...formData, date: dateFormat })
                setFormData(doc?.data)
                toast("Added Success!", { type: "success" })
            }

            setLoading(false);
        } catch (err) {
            toast(err.message)
            setLoading(false);
        }
    }
    return (
        <>
            {/* {loading&&<Spin size="large" />} */}
            <div style={{ marginBottom: "10px" }}>
                <span>Date</span>
                <Input
                    value={moment(date).format("YYYY-MM-DD")}
                    type={"date"}
                    name="date"
                    onChange={e => {
                        setDate(e.target.value)
                    }}
                />
            </div>

            <div style={{
                display: "flex",
                rowGap: "5px",
                columnGap: "10px",
                flexWrap: "wrap"
            }}>
                <div className='input_mobile_class'>
                    <span>Petrol</span>
                    <Input
                        value={formData?.petrol}
                        type={"number"}
                        name="petrol"
                        onChange={handleChange}
                    />
                </div>

                <div className='input_mobile_class'>
                    <span>Received Petrol</span>
                    <Input
                        value={formData?.received_petrol}
                        type={"number"}
                        name="received_petrol"
                        onChange={handleChange}
                    />
                </div>

                <div className='input_mobile_class'>
                    <span>Bike</span>
                    <Input
                        value={formData?.bike}
                        type={"number"}
                        name="bike"
                        onChange={handleChange}
                    />
                </div>

                <div className='input_mobile_class'>
                    <span>Grocery</span>
                    <Input
                        value={formData?.grocery}
                        type={"number"}
                        name="grocery"
                        onChange={handleChange}
                    />
                </div>

                <div className='input_mobile_class'>
                    <span>Reviews</span>
                    <Input
                        value={formData?.reviews}
                        type={"number"}
                        name="reviews"
                        onChange={handleChange}
                    />
                </div>

                <div className='input_mobile_class'>
                    <span>Salik</span>
                    <Input
                        value={formData?.salik}
                        type={"number"}
                        name="salik"
                        onChange={handleChange}
                    />
                </div>
                <div style={{ marginTop: "20px" }}>
                    <Button disabled={loading} onClick={handleSubmit} type="primary">Submit</Button>
                </div>
            </div>
        </>
    )
}

export default DailyEntry