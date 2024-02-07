import React,{useState} from 'react';
import { Tabs } from 'antd';
import {  EnterOutlined,FilterOutlined,TableOutlined } from '@ant-design/icons';
import DailyEntry from '../components/safariDailyEntry';
import Report from '../components/safariReport';
import ReportTable from '../components/safariReportTable';

const SafariReport=()=>{
    const [currentTab,setCurrentTab]=useState("tab1")
    const tabs=[
        {
        icon:<EnterOutlined />,
        components:<DailyEntry/>,
        label:"Daily Entry"
      },{
        icon:<FilterOutlined/>,
        components:<Report currentTab={currentTab}/>,
        label:"Report"
      },{
        icon:<TableOutlined />,
        components:<ReportTable currentTab={currentTab}/>,
        label:"Details"
      }
    ]
    return(
        <div style={{padding:"10px"}}>
       <Tabs
    defaultActiveKey="1"
    onChange={tab=>setCurrentTab(tab)}
    items={tabs.map((tab, i) => {
      return {
        label: (
          <span>
            {tab.icon}
           {tab.label}
          </span>
        ),
        key:"tab"+i,
        children:tab.components,
      };
    })}
  />
        </div>
    )
}

export default SafariReport;