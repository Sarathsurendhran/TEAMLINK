import React, { Children, useEffect, useState } from "react";
import isAuthUser from "../../utils/isAuth";
import Loader from "../loader/loader";
import { Navigate } from "react-router-dom";

const AdminPrivateRoutes = ({ children }) => {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const authInfo = await isAuthUser();
      setisAuthenticated(authInfo.isAuthenticated);
      setIsAdmin(authInfo.isAdmin);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }


  // Redirect to login if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />; 
  }

  return children;
};
export default AdminPrivateRoutes;
