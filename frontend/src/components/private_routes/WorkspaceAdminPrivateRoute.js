import React, { useEffect, useState } from "react";
import Loader from "../loader/loader";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import isAuthUser from "../../utils/isAuth";
import { useNavigate } from "react-router-dom";

const WorkspaceAdminPrivateRoute = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const workspaceAdmin = useSelector((state) => state.workspace.workspaceAdmin);
  const authenticatedUser = useSelector((state) => state.authenticationUser.id);
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const navigate = useNavigate();

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
      <div className="ml-64">
        <Loader />
      </div>
    );
  }

  // Redirect to login if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (workspaceAdmin !== authenticatedUser) {
    navigate(-1);
  }

  return children;
};

export default WorkspaceAdminPrivateRoute;
