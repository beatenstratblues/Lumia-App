import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div className='appLayout'>
        <Outlet/>
    </div>
  )
}

export default AppLayout