import React from 'react'
import { Routes , Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import VerifyEmail from './utils/VerifyEmail'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/register' element ={<Register/>}/>
        <Route path='/login' element ={<Login/>}/>
        <Route path='/' element={<Home/>} />
        <Route path='/verify-email' element={<VerifyEmail/>} />
      </Routes>
    </div>
  )
}

export default App