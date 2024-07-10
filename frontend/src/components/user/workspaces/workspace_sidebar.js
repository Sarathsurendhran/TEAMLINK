import axios from "axios";
import React, { useEffect, useState } from "react";
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

const WorkspaceSidebar = () => {
  const [usersOpen, setUsersOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const baseURL = process.env.REACT_APP_baseURL;
  const navigate = useNavigate();
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const [loading, setLoading] = useState(false);
  const [wsModalOpen, setWsModalOpen] = useState(false);

  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  const [menuItems, setMenuItems] = useState([]);
  const [workspaceData, setWorkspaceData] = useState([]);

  const toggleUsersAccordion = () => {
    setUsersOpen(!usersOpen);
  };

  const toggleProjectsAccordion = () => {
    setProjectsOpen(!projectsOpen);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // feteching all the data of the current workspace and user
  useEffect(() => {
   try {
     fetchData();
    
   } catch (error) {
    
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
      }
    } catch (error) {
      closeWSModal();
      console.error("Error launching workspace:", error);
    }
  };

  //send invitation
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
        className="h-screen mt-12 hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-80 bg-black border-e border-gray-900  pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <div className="flex h-full">
          <div className="h-full bg-[#543ae9] w-9 "></div>
          <div className="flex-1">
            <div className="px-6 mt-11">
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
                      usersOpen
                        ? "hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent"
                        : ""
                    } w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-slate-800 `}
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
                            className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-700"
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

                <button
                  type="button"
                  className="w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-slate-800"
                  onClick={openModal}
                >
                  <Tooltip title="Users">
                    <PersonAddAltIcon sx={{ color: "white" }} />
                  </Tooltip>
                  Add Users
                </button>
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
