import React from "react";
import { useRoutes } from "react-router-dom";
import AdminLayout from "../admin/admin_layout";
import AdminDashboard from "../admin/admin_dashboard";
import AdminUserList from "../admin/admin_userlist";
import WorkspaceList from "../admin/workspace_list";
import AdminPrivateRoutes from "../private_routes/AdminPrivateRoutes";

const AdminWrapper = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <AdminPrivateRoutes>
          <AdminLayout />
        </AdminPrivateRoutes> 
      ),
      children: [
        { path: "/", element: <AdminDashboard /> },
        { path: "/user-list", element: <AdminUserList /> },
        { path: "/workspace-list", element: <WorkspaceList /> },
      ],
    },
  ]);

  return routes;
};

export default AdminWrapper;
