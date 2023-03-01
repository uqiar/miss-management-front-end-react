import react from 'react';
import tokenStorage from "../services/tokenStorage"
import { useNavigate } from 'react-router-dom';
import { Button ,Modal} from 'antd';
import { PoweroffOutlined,ExclamationCircleFilled } from '@ant-design/icons';

const Header=()=>{
    const { confirm } = Modal;

    const navigate=useNavigate()
    const user=tokenStorage.getUserInfo()
    const onConfirmModal = (record) => {
        confirm({
          title: "Confirm Logout!",
          icon: <ExclamationCircleFilled />,
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk() {
            localStorage.clear();
         window.location.reload();
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      };
    return(
        <div style={{
            backgroundColor:'black',
            padding:'16px',
            color:"white",
            fontSize:'16px',
            cursor:"pointer",
            marginBottom:"10px"
        }}>
     <div style={{
         display:'flex',
         justifyContent:"space-between"
     }}>
        <div style={{
           fontWeight:"bold",
           fontSize:'22px' 
        }}>{user?.name}</div>

     <div style={{cursor:'pointer'}}onClick={()=>{
         navigate("/dashboard")
     }}>
         Dashboard
     </div>

    <div style={{
      color:"red"
        }}
        onClick={onConfirmModal}> <Button
        type="primary"
        danger
        icon={<PoweroffOutlined />}
      /></div>
     </div>

     
        </div>
    )
}

export default Header;