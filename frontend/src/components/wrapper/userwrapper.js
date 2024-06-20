import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import OTP from '../user/auth/otp_verification'
import Register from "../user/auth/Register";
import Login from "../user/auth/login";
import CreateWorkSpace from "../user/createworkspace"

const UserWrapper = ()=>{

  return(
    <>
    <Routes>
      <Route path="/otp" element={<OTP/>}/>
      <Route path="/" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/createworkspace" element={<CreateWorkSpace/>}/>
    </Routes>
    
    </>
  )
}

export default UserWrapper