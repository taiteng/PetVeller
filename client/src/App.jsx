import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import Admin from './Admin'
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    
    <div>
      {/* Test push and commit by zc */}
      <b>Hi, Test Again </b>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Signup/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/admin" element={<Admin/>}></Route>
          <Route path="/ZC" element={<Admin/>}></Route>
        
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
