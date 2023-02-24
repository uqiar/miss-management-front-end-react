import React from 'react';
 import FoodExpenses from '../components/foodExpenseTab';
 import {  CoffeeOutlined } from '@ant-design/icons';
 import { Tabs } from 'antd';
import OtherExpensesTab from '../components/otherExpensesTab';

const Expenses=()=>{
  const tabs=[
    {
    icon:<CoffeeOutlined/>,
    components:<FoodExpenses/>,
    label:"Food Expense"
  },{
    icon:<CoffeeOutlined/>,
    components:<OtherExpensesTab/>,
    label:"Other Expense"
  }
]
  return(
    <div>
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

export default Expenses