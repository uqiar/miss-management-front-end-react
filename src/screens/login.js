import React, { useEffect, useState,useContext} from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import {  toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/loading';
import { userLogin } from '../services/api';
import MyContext  from '../context/appContext';

const Login=(props)=>{
  const [loading,setLoading]=useState(false)
  const appContext = useContext(MyContext);

   let navigate=useNavigate();
   useEffect(()=>{
    let token = localStorage.getItem('__set');
     if(token)
     navigate("/dashboard")
   },[])

    const onFinish =async (values) => {
     try{
      setLoading(true)
      let req = {
        email: values.username,
        password: values.password,
      };
      const res = await userLogin(req);
      const __set = JSON.stringify(res.data);
      localStorage.setItem('__set', __set);
      appContext.setTokensFromLocalStorage(res.data.accessToken)
      appContext.updateState("user", res.data.user)
      navigate('/dashboard')
      setLoading(false);
     }catch(err){
      toast(err.message)
     }
      
      };
    


   
    return(
        <div className='login-wrapper'>
        {loading&& <Loader/>}
        <div style={{
            maxWidth:"800px",
            margin:"0 auto",
            padding:"180px 20px"
        }}>
          <h4 style={{color:"white",fontSize:"20px",marginBottom:"10px",fontFamily:"fantasy"}}>Persoanl E-Book</h4>
           <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input size="large"prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
        size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
    

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
        </div>
        </div>
    )
}

export default Login