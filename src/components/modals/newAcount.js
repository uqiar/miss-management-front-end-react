import React, { useState } from "react";
import { Space, Button, Modal, Input } from "antd";
import Loader from "../loading";
import { toast } from "react-toastify";
import { addNewAccount } from "../../services/api";

const NewAcountModal = ({ show, hide, reFetch }) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
        try {
      setLoading(true);
      await addNewAccount(formData);
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
      title={"Add New Book"}
      open={show}
      onOk={() => alert("submit")}
      onCancel={hide}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={12}>
        <Input
          status={!formData.name ? "error" : ""}
          size="large"
          placeholder="New Acount Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Button
          disabled={!formData.name}
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

export default NewAcountModal;
