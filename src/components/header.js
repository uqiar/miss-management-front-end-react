import react,{useState} from 'react';
import tokenStorage from "../services/tokenStorage"
import { useNavigate } from 'react-router-dom';
import { Button ,Modal} from 'antd';
import { PoweroffOutlined,ExclamationCircleFilled } from '@ant-design/icons';
 import { userLogout } from '../services/api';
import { toast } from 'react-toastify';
import UpdateUserModal from '../components/modals/updateProfile';

const Header=()=>{
    const { confirm } = Modal;
   const [loading,setLoading]=useState(false)
   const [showProfileModal,setShowProfileModal]=useState(false)
   const [user,setUser]=useState(tokenStorage.getUserInfo())
    const navigate=useNavigate()
    const handleLogout= async()=>{
      try{
        setLoading(true)
          await userLogout()
          localStorage.clear();
          window.location.reload();
          setLoading(false)
      }catch(err){
        toast(err.message)
        setLoading(false)
      }
    }
    const onConfirmModal = (record) => {
        confirm({
          title: "Confirm Logout!",
          icon: <ExclamationCircleFilled />,
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk() {
            handleLogout()
           
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
        }} onClick={()=>setShowProfileModal(true)}>{user?.name}</div>

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
        loading={loading}
        icon={<PoweroffOutlined />}
      /></div>
     </div>

     {
       showProfileModal&&
       <UpdateUserModal
        show={showProfileModal}
        hide={()=>setShowProfileModal(false)}
        user={user}
        setUser={setUser}
       />
     }
        </div>
    )
}

export default Header;