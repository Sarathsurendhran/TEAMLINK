import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PeopleIcon from "@mui/icons-material/People";
import { IconButton, Tooltip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import ArrowRightSharpIcon from "@mui/icons-material/ArrowRightSharp";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import Loader from "../../loader/loader";
import WorkspaceSettings from "./workspace_settings";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import LogoutIcon from "@mui/icons-material/Logout";
import UserProfile from "../user_profile/UserProfile";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import CreateGroupModal from "../Group/CreateGroup";

const WorkspaceSidebar = () => {
  const [usersOpen, setUsersOpen] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const baseURL = process.env.REACT_APP_baseURL;
  const navigate = useNavigate();
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const [loading, setLoading] = useState(false);
  const [wsModalOpen, setWsModalOpen] = useState(false);
  const divRef = useRef(null);

  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  const [menuItems, setMenuItems] = useState([]);
  const [workspaceData, setWorkspaceData] = useState([]);

  const toggleUsersAccordion = () => {
    setUsersOpen(!usersOpen);
  };

  const toggleGroupsAccordion = () => {
    setGroupsOpen(!groupsOpen);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaceAdmin, setWorkspaceAdmin] = useState(false)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //.................. feteching all the data of the current workspace and user............
  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [workspaceID]);

  const fetchData = async () => {
    const accessToken = localStorage.getItem("access");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const res = await axios.get(
        `${baseURL}workspace/workspace-home/${workspaceID}/`,
        config
      );
      if (res.status === 200) {
        closeWSModal();
        toast.success(res.data.message);

        const workspace_data = res.data.workspace_data;
        setWorkspaceData(workspace_data);

        const members_data = res.data.members_data;
        const members = Array.isArray(members_data) ? members_data : [];
        setMenuItems(members);
        const checkIsAdmin = members.some((member)=>member.user.id === authenticated_user_id && member.is_admin)
        if (checkIsAdmin){
          setWorkspaceAdmin(true)
        }
        
      }
    } catch (error) {
      closeWSModal();
      console.error("Error launching workspace:", error);
    }
  };

  //........................................send invitation..................................
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("email", e.target.email.value);
    formData.append("workspace_id", workspaceID);

    try {
      const accessToken = localStorage.getItem("access");

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await axios.post(
        `${baseURL}workspace/add-members/`,
        formData,
        config
      );

      if (res.status === 200) {
        setLoading(false);
        toast.success(res.data.message);
        closeModal();
        closeWSModal();
      }
    } catch (error) {
      setLoading(false);
      closeModal();
      closeWSModal();
      if (error.response && error.response.data && error.response.data.email) {
        toast.warning(error.response.data.email[0]);
      } else if (error.response.data.non_field_errors) {
        toast.warning(error.response.data.non_field_errors[0]);
      } else {
        console.log(error.message);
        toast.error("Failed to add member.");
      }
    }
  };

  const openWSModal = (e) => {
    e.preventDefault();
    setWsModalOpen(true);
  };

  const closeWSModal = () => {
    setWsModalOpen(false);
  };

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

  //............................................Fetching Groups...................................

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroupsData();
  }, []);

  const fetchGroupsData = async () => {
    const accessTokem = localStorage.getItem("access");
    const config = {
      headers: {
        Authorization: `Bearer ${accessTokem}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseURL}group/list-groups/`,
        config
      );
      if (response.status === 200) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //......................For create group modal.....................
  const [creategroupopen, setCreateGroupOpen] = useState(false);
  const handleGroupModalOpen = () => setCreateGroupOpen(true);
  const handleGroupModalClose = () => setCreateGroupOpen(false);


  useEffect(()=>{

  }, [])

  return (
    <>
      {/* Main modal */}
      {isModalOpen && (
        <div
          id="authentication-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75"
        >
          {!loading ? (
            <div className="relative p-4 w-full max-w-md max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Members
                  </h3>
                  <button
                    type="button"
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={closeModal}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* Modal body */}
                <div className="p-4 md:p-5">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Add email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="name@company.com"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Send Invitation
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div>{<Loader />}</div>
          )}
        </div>
      )}

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
            ></div>
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
            <div className="px-6 mt-9">
              <a
                className="flex-none text-2xl font-semibold text-white"
                href="#"
                onClick={openWSModal}
                aria-label="Brand"
              >
                {workspaceData.workspace_name}
                <KeyboardArrowDownOutlinedIcon />
              </a>

              <WorkspaceSettings
                open={wsModalOpen}
                handleClose={closeWSModal}
                fetchDataFunction={fetchData}
              />
            </div>

            <nav
              className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
              data-hs-accordion-always-open=""
            >
              <ul className="space-y-1.5 ">
                <li className="hs-accordion ">
                  <button
                    type="button"
                    className={`hs-accordion-toggle ${
                      groupsOpen
                        ? "hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent"
                        : ""
                    } w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-500 hover:text-white`}
                    onClick={toggleGroupsAccordion}
                    aria-expanded={groupsOpen}
                  >
                    <div className="flex items-center pt-1 space-x-2">
                      <div className="flex items-center">
                        {groupsOpen ? (
                          <ArrowDropDownSharpIcon
                            style={{ fontSize: "24px" }}
                          />
                        ) : (
                          <ArrowRightSharpIcon style={{ fontSize: "24px" }} />
                        )}
                        <Diversity3Icon
                          sx={{ color: "white", marginLeft: "8px" }}
                        />{" "}
                        {/* Adjust margin as needed */}
                        <span className="ml-1 text-white">Groups</span>{" "}
                        {/* Adjust margin and text color as needed */}
                      </div>
                    </div>
                  </button>
                  <div
                    id="groups-accordion-content"
                    className={` hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                      groupsOpen ? "block" : "hidden"
                    }`}
                  >
                    <ul
                      className=" hs-accordion-group ps-3 pt-2"
                      data-hs-accordion-always-open=""
                    >
                      {workspaceAdmin && (
                        <>
                        <Button
                        variant="contained"
                        color="success"
                        onClick={handleGroupModalOpen}
                      >
                        Create new Group
                      </Button>
                      <CreateGroupModal
                        open={creategroupopen}
                        close={handleGroupModalClose}
                        fetchGroupsData={fetchGroupsData}
                      />
                        </>
                      )}

                      {groups.map((group, index) => (
                        <li
                          className="hs-accordion  flex justify-between"
                          id={`users-accordion-sub-${index}`}
                          key={index}
                        >
                          <button
                            type="button"
                            className=" border border-white mt-2 hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-500"
                          >
                            <div className="flex items-center ">
                              <span className="mr-10">{group.group_name}</span>
                              {/* {member.is_admin && (
                                <span className="text-red-500 font-sm mr-3">
                                  admin
                                </span>
                              )}
                              {member.user.id === authenticated_user_id && (
                                <span className="text-red-500 font-sm">
                                  ( you )
                                </span>
                              )} */}
                            </div>

                            {/* Adjust the property based on your data structure */}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                <li className="hs-accordion ">
                  <button
                    type="button"
                    className={`hs-accordion-toggle ${
                      usersOpen
                        ? "hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent"
                        : ""
                    } w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-500 `}
                    onClick={toggleUsersAccordion}
                    aria-expanded={usersOpen}
                  >
                    <div className="flex items-center pt-1 space-x-2">
                      <div className="flex items-center">
                        {usersOpen ? (
                          <ArrowDropDownSharpIcon
                            style={{ fontSize: "24px" }}
                          />
                        ) : (
                          <ArrowRightSharpIcon style={{ fontSize: "24px" }} />
                        )}
                        <PeopleIcon
                          sx={{ color: "white", marginLeft: "8px" }}
                        />{" "}
                        {/* Adjust margin as needed */}
                        <span className="ml-1 text-white">Users</span>{" "}
                        {/* Adjust margin and text color as needed */}
                      </div>
                    </div>
                  </button>
                  <div
                    id="users-accordion-content"
                    className={` hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                      usersOpen ? "block" : "hidden"
                    }`}
                  >
                    <ul
                      className=" hs-accordion-group ps-3 pt-2"
                      data-hs-accordion-always-open=""
                    >
                      {menuItems.map((member, index) => (
                        <li
                          className="hs-accordion flex justify-between"
                          id={`users-accordion-sub-${index}`}
                          key={index}
                        >
                          <button
                            type="button"
                            className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-500"
                          >
                            <div className="flex items-center">
                              <span className="mr-10">
                                {member.user.username}
                              </span>
                              {member.is_admin && (
                                <span className="text-red-500 font-sm mr-3">
                                  admin
                                </span>
                              )}
                              {member.user.id === authenticated_user_id && (
                                <span className="text-red-500 font-sm">
                                  ( you )
                                </span>
                              )}
                            </div>

                            {/* Adjust the property based on your data structure */}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                <li>
                  <button
                    type="button"
                    className="w-full text-start flex items-center gap-x-2 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-500"
                    onClick={openModal}
                  >
                    <Tooltip title="Users">
                      <PersonAddAltIcon sx={{ color: "white" }} />
                    </Tooltip>
                    Add Users
                  </button>
                </li>

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
