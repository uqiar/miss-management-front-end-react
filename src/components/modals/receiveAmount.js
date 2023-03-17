import React, { useState } from "react";
import { Space, Button, Modal, Input,Select} from "antd";
import Loader from "../loading";
import { toast } from "react-toastify";
import { receiveAmount } from "../../services/api";
import moment from 'moment';

const CollectAmount = ({ show, hide, reFetch,allUsers=[] }) => {
  const { Option } = Select;

  const [formData, setFormData] = useState({
    amount: "",
    note:"",
    date:new Date()
  });
  const [user,setUser]=useState("")
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
        try {
      setLoading(true);
      await receiveAmount({...formData,date:moment(formData.date).format("YYYY-MM-DD")},user);
      reFetch();
      hide();
      toast.success('Added Successfully!', {
        theme: "colored",
        });
    } catch (err) {
      setLoading(false);
      toast(err.message);
    }
  };
  return (
    <Modal
      footer={false}
      title={"Receiving Amount"}
      open={show}
      onOk={() => alert("submit")}
      onCancel={hide}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={12}>
           <Input
            value={moment(formData.date).format("YYYY-MM-DD")}
            type={"date"}
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value });
            }}
          />

            <Select
            status={!user ? "error" : ""}
            style={{ width: "100%" }}
            showSearch={true}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={user}
            placeholder={"Select user"}
            onChange={(e) => {
              //const currentUSer=allUsers.find(itm=>itm._id===e)
              setUser(e);
            }}
          >
            {allUsers.map((usr, key) => (
              <Option key={"option" + key} value={usr._id}>
                {usr.name}
              </Option>
            ))}
          </Select>

        <Input
          status={!formData.amount ? "error" : ""}
          size="large"
          placeholder="New Acount Name"
          value={formData.name}
          type="number"
          min={0}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
          <Input
         // status={!formData.name ? "error" : ""}
          size="large"
          placeholder="Note"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        />

        <Button
          disabled={!formData.amount||!user}
          onClick={handleSubmit}
          type="primary"
          block
        >
          Submit
        </Button>
      </Space>
      {loading && <Loader />}
    </Modal>
  );
};

export default CollectAmount;
