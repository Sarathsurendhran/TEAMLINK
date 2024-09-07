import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import ArrowRightSharpIcon from "@mui/icons-material/ArrowRightSharp";
import PeopleIcon from "@mui/icons-material/People";
import { setWorkspaceAdmin } from "../../../../Redux/WorkspaceID/workspaceSlice";
import { setSelectedUser, setselectedUserName } from "../../../../Redux/SelectedUser/SelectedUser";

const WorkSpaceUserList = () => {
  const [usersOpen, setUsersOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [workspaceData, setWorkspaceData] = useState([]);
  // const [workspaceAdmin, setWorkspaceAdmin] = useState(false)

  const baseURL = process.env.REACT_APP_baseURL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;


  const toggleUsersAccordion = () => {
    setUsersOpen(!usersOpen);
  };

  const selectedUser = useSelector((state) => state.selectedUser.selectedUser);
  // const selectedUserName = useSelector((state) => state.selectedUser.selectedUserName);


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
        toast.success(res.data.message);

        const workspace_data = res.data.workspace_data;
        setWorkspaceData(workspace_data);
        dispatch(setWorkspaceAdmin(res.data.workspace_data.created_by));

        const members_data = res.data.members_data;
        const members = Array.isArray(members_data) ? members_data : [];
        setMenuItems(members);
      
      }
    } catch (error) {
      console.error("Error launching workspace:", error);
    }
  }; 


  const updateReadStatus = async (selectedUserId, authenticated_user_id) => {
    try {
      const response = await axios.post(`${baseURL}dm-chat/read-status-update/${selectedUserId}/${authenticated_user_id}/`);
      if (response.status === 200) {
        console.log("Group reading status updated");
      }
    } catch (error) {
      console.error("Error updating group reading status:", error);
    }
  };


  
  const handleSelectedUser = (user_id, username) => {
    dispatch(setSelectedUser(user_id))
    dispatch(setselectedUserName(username))

    updateReadStatus(user_id, authenticated_user_id)

    navigate('one-to-one-chat')
  }

  return (
    <div>
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
                <ArrowDropDownSharpIcon style={{ fontSize: "35px" }} />
              ) : (
                <ArrowRightSharpIcon style={{ fontSize: "35px" }} />
              )}
              <PeopleIcon sx={{ color: "white", marginLeft: "3px" }} />{" "}
              {/* Adjust margin as needed */}
              <span className="ml-1 text-white text-base">Users</span>{" "}
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
                  className={`hs-accordion-toggle mt-1 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-500 ${ selectedUser === member.user.id ? "bg-gray-500" : "text-white"}`}
                  onClick={() => handleSelectedUser(member.user.id, member.user.username )}
                >
                  <div className="flex items-center" >
                    <span className="mr-10">{member.user.username}</span>
                    {member.is_admin && (
                      <span className="text-red-500 font-sm mr-3">admin</span>
                    )}
                    {member.user.id === authenticated_user_id && (
                      <span className="text-red-500 font-sm">( you )</span>
                    )}
                  </div>

                  {/* Adjust the property based on your data structure */}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </div>
  );
};

export default WorkSpaceUserList;
