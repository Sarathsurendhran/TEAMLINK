import React, { useEffect, useState } from "react";
import isAuthUser from "../../utils/isAuth";
import Loader from "../loader/loader";
import { Navigate } from "react-router-dom";

const LoginPrivateRoute = ({ children }) => {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const authInfo = await isAuthUser();
      setisAuthenticated(authInfo.isAuthenticated);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
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


  if (isAuthenticated) {
    return <Navigate to="/workspaces" />;
  }
  return children;
};

export default LoginPrivateRoute;
