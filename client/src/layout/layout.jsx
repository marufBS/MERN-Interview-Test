import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Dashboard from '../pages/dashboard'
import Drawingpad from '../components/drawingpad'

const Layout = () => {
  return (
    <div className='flex h-dvh flex-col'>
        <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/drawing/:id' element={<Drawingpad/>}/>
        </Routes>
    </div>
  )
}

export default Layout