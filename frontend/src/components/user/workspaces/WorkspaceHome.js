import React from "react";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceSidebar from "./WorkspaceSidebar";
import { Outlet } from "react-router-dom";
import WorkspaceInnerHeader from "./WorkspaceInnerHeader";

const WorkspaceHome = () => {
  return (
    <>
      <WorkspaceHeader />
      <WorkspaceInnerHeader />
      <WorkspaceSidebar />
      <Outlet />
    </>
  );
};

export default WorkspaceHome;
