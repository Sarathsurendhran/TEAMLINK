import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import OTP from '../user/auth/otp_verification'
import Register from "../user/auth/Register";
import Login from "../user/auth/login";
import CreateWorkSpace from "../user/workspaces/createworkspace"
import WorkSpaces from "../user/workspaces/workspaces"
import WorkspaceHome from "../user/workspaces/workspace_home";
import PrivateRoutes from '../private_routes/private_routes'
import { useDispatch, useSelector } from "react-redux";
import isAuthUser from "../../utils/isAuth";
import { setAuthentication } from "../../Redux/Authentication/authenticationSlice";

const UserWrapper = ()=>{
  const authentication_user = useSelector(state=>state.authentication_user)
  const dispatch = useDispatch()


  //checking if the user is authenticated or not
  const checkAuth = async()=>{
    const isAuthenticated = await isAuthUser()
    dispatch(
      setAuthentication({
        id:isAuthenticated.id,
        username:isAuthenticated.username,
        isAuthenticated:isAuthenticated.isAuthenticated,
        isAdmin:isAuthenticated.isAdmin
      })

    )

  }


  useEffect(()=>{
    if(!authentication_user){
      checkAuth()
    }
  }, [authentication_user])

  return(
    <>
    <Routes>
      <Route path="/otp" element={<OTP/>}/>
      <Route path="/" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/createworkspace" element={<CreateWorkSpace/>}/>
      <Route path="/workspaces" element={<PrivateRoutes><WorkSpaces/></PrivateRoutes>}/>
      <Route path="/createworkspace/workspacehome" element={<PrivateRoutes><WorkspaceHome/></PrivateRoutes>}/>
    </Routes>
    
    </>
  )
}

export default UserWrapper