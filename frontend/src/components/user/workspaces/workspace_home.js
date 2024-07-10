import React from "react";
import WorkspaceHeader from "./workspace_header";
import WorkspaceSidebar from "./workspace_sidebar";
import { Outlet } from "react-router-dom";

const WorkspaceHome = () => {
  return (
    <>
      <WorkspaceHeader />
      <WorkspaceSidebar />
      <Outlet />
    </>
  );
};

export default WorkspaceHome;
