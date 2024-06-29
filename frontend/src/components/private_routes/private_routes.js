import React, {useState, useEffect} from "react";
import isAuthUser from "../../utils/isAuth";
import Loader from "../loader/loader";
import { Navigate } from "react-router-dom";


const PrivateRoutes = ({children})=>{

  const [isAuthenticated, setisAuthenticated] = useState(false)
  const[isLoading, setLoading] = useState(true)

  //jwt authentication checking, is the user is authenticated or not
  useEffect(()=>{
    const fetchData = async()=>{
      const authInfo = await isAuthUser()
      setisAuthenticated(authInfo.isAuthenticated)
      setTimeout(()=>{setLoading(false)}, 2000)
    }
    fetchData()
  }, [])

  if (isLoading){
    return <div><Loader/></div>
  }

  if(!isAuthenticated){
    return <Navigate to="/login"/>
  }
  return children

}

export default  PrivateRoutes