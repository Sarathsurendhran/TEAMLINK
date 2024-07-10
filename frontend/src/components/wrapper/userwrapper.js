import React, { useEffect } from "react";
import { Routes, Outlet, Route, useNavigate } from "react-router-dom";
import OTP from "../user/auth/otp_verification";
import Register from "../user/auth/Register";
import Login from "../user/auth/login";
import CreateWorkSpace from "../user/workspaces/createworkspace";
import WorkSpaces from "../user/workspaces/workspaces";
import WorkspaceHome from "../user/workspaces/workspace_home";
import PrivateRoutes from "../private_routes/private_routes";
import { useDispatch, useSelector } from "react-redux";
import isAuthUser from "../../utils/isAuth";
import { setAuthentication } from "../../Redux/Authentication/authenticationSlice";
import LoginPrivateRoute from "../private_routes/LoginPrivateRoute";
import HomePage from "../../pages/home_page";
import ThreeDBackground from "../vantajs/ThreeDBackground";
import UserCheckingWrapper from "./userchecking_wrapper";
import WorkspaceIsblocked from "./checking_workspace_isblocked";

const UserWrapper = () => {
  const authentication_user = useSelector((state) => state.authentication_user);
  const dispatch = useDispatch();

  //checking if the user is authenticated or not
  const checkAuth = async () => {
    const isAuthenticated = await isAuthUser();
    dispatch(
      setAuthentication({
        id: isAuthenticated.id,
        username: isAuthenticated.username,
        isAuthenticated: isAuthenticated.isAuthenticated,
        isAdmin: isAuthenticated.isAdmin,
      })
    );
  };

  useEffect(() => {
    if (!authentication_user) {
      checkAuth();
    }
  }, [authentication_user]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ThreeDBackground>
              <HomePage />
            </ThreeDBackground>
          }
        />
        <Route path="/otp" element={<OTP />} />
        <Route
          path="/register"
          element={
            <UserCheckingWrapper>
              <LoginPrivateRoute>
                <Register />
              </LoginPrivateRoute>
            </UserCheckingWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <LoginPrivateRoute>
              <Login />
            </LoginPrivateRoute>
          }
        />
        <Route
          path="/createworkspace"
          element={
            <PrivateRoutes>
              <CreateWorkSpace />
            </PrivateRoutes>
          }
        />
        <Route
          path="/workspaces"
          element={
            <PrivateRoutes>
              <WorkSpaces />
            </PrivateRoutes>
          }
        />
        <Route
          path="/createworkspace/workspacehome"
          element={
            <PrivateRoutes>
              <WorkspaceIsblocked>
                <WorkspaceHome />
              </WorkspaceIsblocked>
            </PrivateRoutes>
          }
        />
      </Routes>
    </>
  );
};

export default UserWrapper;
