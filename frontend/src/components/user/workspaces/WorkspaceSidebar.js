import React, { useEffect, useState, useRef } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import UserProfile from "../UserProfile/UserProfile";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkSpaceUserList from "./WorkSpaceUserList/WorkSpaceUserList";
import WorkspacesGroups from "./WorkspaceGroups/WorkspacesGroups";
import WorkspaceAddUsers from "./WorkspaceAddUsers/WorkspaceAddUsers";
import WorkspaceSettingsModal from "./WorkspaceSettings/WorkspaceSettingsModal";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";

const WorkspaceSidebar = () => {
  const profileImage = useSelector((state) => state.userProfile.profileImage);
  const baseURL = process.env.REACT_APP_baseURL;

  // ...............................handiling logout......................................
  const handleLogout = (event) => {
    event.preventDefault();
    // Clear authentication tokens and any other user-related data
    localStorage.clear();
    window.location.reload();
    // Adjust according to how you store the token
    // Perform any additional cleanup if necessary
  };

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => (event) => {
    setOpen(newOpen);
    event.stopPropagation();
  };

  //.............................................For Profile Menu ...................
  const [profileopen, setProfileOpen] = useState(false);
  const handleProfileOpen = (event) => {
    setProfileOpen((prevState) => !prevState);
    event.stopPropagation();
  };

  const handleProfileClose = () => setProfileOpen(false);

  useEffect(() => {
    const handleClickAnywhere = (event) => {
      handleProfileClose();
    };

    // Add event listener
    document.addEventListener("click", handleClickAnywhere);

    // Cleanup function to remove event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickAnywhere);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      handleProfileClose();
    }
  }, [open]);


  return (
    <>
      {/* Sidebar */}

      <div
        id="docs-sidebar"
        className="bg-blue-950  h-screen mt-6 hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-80   pb-10  lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <div className=" flex h-screen">
          <div className="h-full bg-[#543ae9] w-14 border border-[#543ae9] flex justify-center items-end">
            <div
              className="w-10 h-10 bg-blue-500 rounded-full border cursor-pointer mb-20"
              onClick={handleProfileOpen}
            >
              <Avatar
                src={
                  profileImage
                    ? baseURL.replace(/\/$/, "") + profileImage
                    : "/broken-image.jpg"
                }
              />
            </div>
          </div>
          {/* profile menu */}
          {profileopen && (
            <div className="mt-96">
              <div className="mt-28">
                <ul
                  role="menu"
                  data-popover="profile-menu"
                  data-popover-placement="bottom"
                  className="text-white bg-[#1f1e1f]  absolute z-10 flex min-w-[180px] flex-col gap-2 overflow-auto rounded-md border border-blue-gray-50  p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
                >
                  <button
                    role="menuitem"
                    className="flex w-full cursor-pointer hover:bg-[#323232] select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                    onClick={toggleDrawer(true)}
                  >
                    <AccountCircleIcon />
                    <p className="block cursor-pointer font-sans text-sm antialiased font-medium leading-normal text-inherit">
                      My Profile
                    </p>
                  </button>

                  <hr className="my-2 border-blue-gray-50" role="menuitem" />
                  <button
                    role="menuitem"
                    className="flex w-full hover:bg-[#323232] cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <LogoutIcon />
                    <p className="block font-sans text-sm antialiased font-medium leading-normal text-inherit">
                      Sign Out
                    </p>
                  </button>
                </ul>
              </div>
            </div>
          )}

          {/* profile menu end */}

          <UserProfile open={open} toggleDrawer={toggleDrawer} />

          <div className="flex-1 border border-blue-800">
            {/* <div className="px-6 mt-9">
              <a
                className="flex-none text-2xl font-semibold text-white"
                href="#"
                onClick={openWSModal}
                aria-label="Brand"
              >
                {workspaceData.workspace_name}
                <KeyboardArrowDownOutlinedIcon />
              </a>

              <WorkspaceSettings />
            </div> */}

            <WorkspaceSettingsModal />

            <nav
              className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
              data-hs-accordion-always-open=""
            >
              <ul className="space-y-1.5 ">
                <WorkspacesGroups />

                <WorkSpaceUserList />

                <WorkspaceAddUsers />

                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-start flex items-center gap-x-2 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-500"
                  >
                    <LogoutIcon /> Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* End Sidebar */}
    </>
  );
};

export default WorkspaceSidebar;
