import React from "react";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WorkspacesOutlinedIcon from "@mui/icons-material/WorkspacesOutlined";

const AdminSidebar = () => {
  const handleLogout = () => {
    // Clear authentication tokens and any other user-related data
    localStorage.clear(); // Adjust according to how you store the token
    // Perform any additional cleanup if necessary
    window.location.reload();
  };

  return (
    <>
      {/* component */}
      <div className="overflow-y-auto overflow-x-hidden flex-grow   bg-slate-800">
        <div className="flex justify-start items-center mt-9 ml-5 font-serif font-bold">
          <span className="text-white text-3xl">TeamLink</span>
        </div>
        <ul className="flex flex-col py-4 space-y-1 mt-3">
          <li>
            <Link
              to="/admin"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-300 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <HomeOutlinedIcon />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/user-list"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-300 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <PeopleAltOutlinedIcon />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Users</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/workspace-list"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-300 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <WorkspacesOutlinedIcon />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Workspces
              </span>
            </Link>
          </li>

          <li className="px-5">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-bold tracking-wide text-gray-500">
                Settings
              </div>
            </div>
          </li>

          <li>
            <a
              href="#"
              onClick={handleLogout}
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-300 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Logout
              </span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
