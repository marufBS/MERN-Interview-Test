import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Dashboard from '../pages/dashboard'

const Layout = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            {/* <Route path='/drawing/:id' element={<Drawingpad2/>}/> */}
        </Routes>
    </div>
  )
}

export default Layout