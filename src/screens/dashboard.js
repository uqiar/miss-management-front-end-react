import React ,{useContext}from 'react';
import Card from '../components/dashboard_card';
import { DatabaseOutlined,UserAddOutlined,SettingOutlined,FileProtectOutlined,LoginOutlined,SnippetsOutlined ,ReadOutlined    } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import MyContext  from '../context/appContext';

const Dashboard=()=>{
    const navigate=useNavigate()
    const appContext = useContext(MyContext);
    const user=appContext.state?.user;
    const optionsList=[
        {
            title:"My Spending",
            icon: <LoginOutlined color='red' style={{ fontSize: '16px', color: "rgb(233 32 32)" }}/>,
            adminOnly:true,
            iconBgColor:"rgb(233 32 32/31%)",
            action:()=>{navigate("/mySpending")}
        },
        {
            title:"My Report",
            icon: <SnippetsOutlined color='red' style={{ fontSize: '16px', color: "rgb(162 32 233)" }}/>,
            adminOnly:true,
            iconBgColor:"rgb(162 32 233/31%)",
            action:()=>{navigate("/myReport")}
        },
        {
            isAdmin:true,
            title:"Daily Entry",
            icon: <DatabaseOutlined color='red' style={{ fontSize: '16px', color: "rgba(76, 233, 32, 32)" }}/>,
            adminOnly:true,
            iconBgColor:"rgba(76, 233, 32, 0.314)",
            action:()=>{navigate("/daily-entry")}
        },
        {
            isAdmin:true,
            title:"Manage Users",
            icon: <UserAddOutlined color='red' style={{ fontSize: '16px', color: "rgba(233, 32, 32, 32)" }}/>,
            adminOnly:true,
            iconBgColor:"rgba(233, 32, 32, 0.314)",
            action:()=>{navigate("/manage-user")}
        },
        {
            isAdmin:true,
            title:"Configure",
            icon: <SettingOutlined color='red' style={{ fontSize: '16px', color: "rgb(2 7 232)" }}/>,
            adminOnly:true,
            iconBgColor:"rgb(2 7 232 / 31%)",
            action:()=>{navigate("/monthly-configure")}
        },
        {
            isAdmin:true,
            title:"All Report",
            icon: <FileProtectOutlined color='red' style={{ fontSize: '16px', color: "rgb(247 4 205)" }}/>,
            adminOnly:true,
            iconBgColor:"rgb(247 4 205/31%)",
            action:()=>{navigate("/report")}
        },
        {
            title:"My Personal",
            icon: <ReadOutlined color='red' style={{ fontSize: '16px', color: "rgb(236 11 185)" }}/>,
            adminOnly:true,
            iconBgColor:"rgb(236 11 185/31%)",
            action:()=>{navigate("/myPersonal")}
        },
        {
            title:"Booking",
            icon: <ReadOutlined color='red' style={{ fontSize: '16px', color: "rgb(236 11 185)" }}/>,
            adminOnly:true,
            iconBgColor:"rgb(236 11 185/31%)",
            action:()=>{navigate("/tourfun")}
        }
    ]
    return(
        <div>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                gap:"5px",
                flexWrap:"wrap"
            }}>
                {
                    optionsList.map((itm,key)=>{
                        if((itm.isAdmin&&user?.role==="ADMIN")||!itm.isAdmin)
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