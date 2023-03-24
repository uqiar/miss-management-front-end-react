import React,{ useState,useEffect } from 'react';
import { Space, Table, Button, Modal, Input, Form } from "antd";
import Loader from '../loading';
import { toast } from 'react-toastify';
import { updateUser } from '../../services/api';

const UpdateProfile=({show,hide,user,setUser})=>{
    console.log('selected user',user)
    const [formData,setFormData]=useState({
       name:user?.name,
       userName:user.email,
       password:""
    })
    const [loading,setLoading]=useState(false)

    const handleSubmit=async()=>{
        if(!formData.name||!formData.userName||!formData.password)
        return
         try{
             setLoading(true)
             const upatedUser=await updateUser(user._id,{...formData,email:formData.userName})
             let oldUser=JSON.parse(localStorage.getItem('__set'))
             oldUser.user=upatedUser.data
             setUser(upatedUser.data)
             const __set = JSON.stringify(oldUser);
             localStorage.setItem('__set', __set);
             toast("Updated!")
             setLoading(false)
             hide()
         }catch(err){
             setLoading(false)
             toast(err.message)
         }
    }
    return(
        <Modal
        footer={false}
        title={"Update Data"}
        open={show}
        onOk={() => alert("submit")}
        onCancel={hide}
      >
       <Form
    name="wrap"
    labelCol={{ flex: '110px' }}
    labelAlign="left"
    labelWrap
    wrapperCol={{ flex: 1 }}
    colon={false}
    style={{ maxWidth: 600 }}
    onSubmitCapture={handleSubmit}
  >
        <Form.Item label="Name" style={{marginBottom:"8px"}}>
          <Input
            status={!formData.name?"error":''}
            size="large"
            placeholder="User Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          </Form.Item>

      <Form.Item label="Login Id" style={{marginBottom:"8px"}}>
          <Input
          status={!formData.userName?"error":''}
            size="large"
            placeholder="Login ID"
            type="string"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
          />
          </Form.Item>

          <Form.Item label="Password" style={{marginBottom:"8px"}}>
            <Input
            type={"text"}
            status={!formData.password?"error":''}
            size="large"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          </Form.Item>

          <Form.Item label="" style={{marginBottom:"0px"}}>
          <Button htmlType="submit" type="primary" block>
            Submit
          </Button>
          </Form.Item>
        </Form>
        {
          loading&&<Loader/>
      }
      </Modal>
    )
}

export default UpdateProfile;