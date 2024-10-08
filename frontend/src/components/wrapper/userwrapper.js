import React, { useEffect } from "react";
import { Routes, Outlet, Route, useNavigate } from "react-router-dom";
import OTP from "../user/auth/otp_verification";
import Register from "../user/auth/Register";
import Login from "../user/auth/login";
import CreateWorkSpace from "../user/workspaces/createworkspace";
import WorkSpaces from "../user/workspaces/WorkspaceList";
import WorkspaceHome from "../user/workspaces/WorkspaceHome";
import PrivateRoutes from "../private_routes/private_routes";
import { useDispatch, useSelector } from "react-redux";
import isAuthUser from "../../utils/isAuth";
import { setAuthentication } from "../../Redux/Authentication/authenticationSlice";
import LoginPrivateRoute from "../private_routes/LoginPrivateRoute";
import HomePage from "../../pages/home_page";
import ThreeDBackground from "../vantajs/ThreeDBackground";
import UserCheckingWrapper from "./userchecking_wrapper";
import WorkspaceIsblocked from "./checking_workspace_isblocked";
import { useRoutes } from "react-router-dom";
import Chat from "../user/Group/GroupChat/GroupChat";
import OneToOneChat from "../user/OneToOneChat/OneToOneChat";
import AssignedTaskTables from "../user/TaskManagement/AssinedTask";
import Tasks from "../user/TaskManagement/Tasks";

import GroupVideoCall from "../user/Group/GroupCall/GroupVideoCall";
import GroupAudioCall from "../user/Group/GroupCall/GroupAudioCall";

import OneToOneVideoCall from "../user/OneToOneChat/OneToOneCall/OneToOneVideoCall";
import OneToOneAudioCall from "../user/OneToOneChat/OneToOneCall/OneToOneAudioCall";

import WorkspaceAdminPrivateRoute from "../private_routes/WorkspaceAdminPrivateRoute";

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

  const routes = useRoutes([
    {
      path: "/workspacehome",
      element: (
        <PrivateRoutes>
          <WorkspaceIsblocked>
            <WorkspaceHome />
          </WorkspaceIsblocked>
        </PrivateRoutes>
      ),
      children: [
        { path: "chat", element: <Chat /> },
        { path: "one-to-one-chat", element: <OneToOneChat /> },
        {
          path: "assigned-tasks",
          element: (
            <WorkspaceAdminPrivateRoute>
              <AssignedTaskTables />
            </WorkspaceAdminPrivateRoute>
          ),
        },
        {
          path: "tasks",
          element: <Tasks />,
        },
      ],
    },

    {
      path: "/register",
      element: (
        <UserCheckingWrapper>
          <LoginPrivateRoute>
            <Register />
          </LoginPrivateRoute>
        </UserCheckingWrapper>
      ),
    },
    {
      path: "/login",
      element: (
        <LoginPrivateRoute>
          <Login />
        </LoginPrivateRoute>
      ),
    },
    {
      path: "/createworkspace",
      element: (
        <PrivateRoutes>
          <CreateWorkSpace />
        </PrivateRoutes>
      ),
    },
    {
      path: "/workspaces",
      element: (
        <PrivateRoutes>
          <WorkSpaces />
        </PrivateRoutes>
      ),
    },
    {
      path: "/",
      element: (
        <ThreeDBackground>
          <HomePage />
        </ThreeDBackground>
      ),
    },
    { path: "/otp", element: <OTP /> },

    {
      path: "/group-video/:roomId",
      element: (
        <PrivateRoutes>
          <GroupVideoCall />
        </PrivateRoutes>
      ),
    },
    {
      path: "/audio-call/:roomId",
      element: (
        <PrivateRoutes>
          <GroupAudioCall />
        </PrivateRoutes>
      ),
    },
    {
      path: "/one-to-one-video/:roomId",
      element: (
        <PrivateRoutes>
          <OneToOneVideoCall />
        </PrivateRoutes>
      ),
    },
    {
      path: "/one-to-one-audio/:roomId",
      element: (
        <PrivateRoutes>
          <OneToOneAudioCall />
        </PrivateRoutes>
      ),
    },
  ]);

  return routes;
};

export default UserWrapper;

// changed import
