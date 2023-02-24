import React from 'react';
import Card from '../components/dashboard_card';
import { DatabaseOutlined,UserAddOutlined,SettingOutlined,FileProtectOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const Dashboard=()=>{
    const navigate=useNavigate()
    const optionsList=[
        {
            title:"Daily Entry",
            icon: <DatabaseOutlined color='red' style={{ fontSize: '32px', color: "rgba(76, 233, 32, 32)" }}/>,
            adminOnly:true,
            iconBgColor:"rgba(76, 233, 32, 0.314)",
            action:()=>{navigate("/daily-entry")}
        },
        {
            title:"Manage Users",
            icon: <UserAddOutlined color='red' style={{ fontSize: '32px', color: "rgba(233, 32, 32, 32)" }}/>,
            adminOnly:true,
            iconBgColor:"rgba(233, 32, 32, 0.314)",
            action:()=>{navigate("/manage-user")}
        },
        {
            title:"Month Configure",
            icon: <SettingOutlined color='red' style={{ fontSize: '32px', color: "rgb(2 7 232)" }}/>,
            adminOnly:true,
            iconBgColor:"rgb(2 7 232 / 31%)",
            action:()=>{navigate("/monthly-configure")}
        },
        {
            title:"Report",
            icon: <FileProtectOutlined color='red' style={{ fontSize: '32px', color: "rgb(247 4 205)" }}/>,
            adminOnly:true,
            iconBgColor:"rgb(247 4 205/31%)",
            action:()=>{navigate("/report")}
        }
    ]
    return(
        <div>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                gap:"10px",
                flexWrap:"wrap"
            }}>
                {
                    optionsList.map((itm,key)=>{
                        return <Card
                           key={"ds"+key}
                           icon={itm.icon}
                           title={itm.title}
                           iconBgColor={itm.iconBgColor}
                           action={itm.action}
                        />
                    })
                }
             
            </div>
            
        </div>
    )
}

export default Dashboard