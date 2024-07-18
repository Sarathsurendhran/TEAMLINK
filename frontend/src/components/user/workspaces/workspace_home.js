import React from "react";
import WorkspaceHeader from "./workspace_header";
import WorkspaceSidebar from "./workspace_sidebar";
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
