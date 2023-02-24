import react from 'react';
import tokenStorage from "../services/tokenStorage"
import { useNavigate } from 'react-router-dom';

const Header=()=>{
    const navigate=useNavigate()
    const user=tokenStorage.getUserInfo()
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
        onClick={()=>{
         localStorage.clear();
         window.location.reload();

        }}
        >LogOut</div>
     </div>

     
        </div>
    )
}

export default Header;