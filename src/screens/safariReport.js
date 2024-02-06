import React from 'react';
import { Tabs } from 'antd';
import {  EnterOutlined,FilterOutlined,TableOutlined } from '@ant-design/icons';
import DailyEntry from '../components/safariDailyEntry';
import Report from '../components/safariReport';
import ReportTable from '../components/safariReportTable';

const SafariReport=()=>{
    const tabs=[
        {
        icon:<EnterOutlined />,
        components:<DailyEntry/>,
        label:"Daily Entry"
      },{
        icon:<FilterOutlined />,
        components:<Report/>,
        label:"Report"
      },{
        icon:<TableOutlined />,
        components:<ReportTable/>,
        label:"Details"
      }
    ]
    return(
        <div style={{padding:"10px"}}>
       <Tabs
    defaultActiveKey="1"
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