import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import OTP from '../user/auth/otp_verification'
import Register from "../user/auth/Register";
import Login from "../user/auth/login";

const UserWrapper = ()=>{

  return(
    <>
    <Routes>
      <Route path="/otp" element={<OTP/>}/>
      <Route path="/" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
    
    </>
  )
}

export default UserWrapper