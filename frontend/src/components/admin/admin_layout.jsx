import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./admin_sidebar";
import Header from "./header";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col antialiased bg-gray-50 text-gray-800">
      <Header />
      <div className="flex flex-auto">
        <div className="fixed flex flex-col top-0 left-0 w-64 mt-16 bg-white h-full border-r">
          <AdminSidebar />
        </div>
        <div className="flex-1 ml-64 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
