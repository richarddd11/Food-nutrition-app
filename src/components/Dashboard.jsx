import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Dashboard = () => {

  const [savedFoods, setSavedFoods] = useState([]);

  const handleAddCustomFood = (food) => {
    setSavedFoods((prev) => [...prev, food]);
  };
  return (
    <div className='flex flex-col lg:flex-row gap-6 p-4 mt-20'>
      <Sidebar />
      <div className="flex-1">
        {/* Tu sa vykreslia podstránky z routingu */}
        <Outlet context={{ savedFoods, handleAddCustomFood }} />
      </div>
    </div>
  )
}

export default Dashboard