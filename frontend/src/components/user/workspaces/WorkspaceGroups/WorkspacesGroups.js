import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import ArrowRightSharpIcon from "@mui/icons-material/ArrowRightSharp";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import Button from "@mui/material/Button";
import CreateGroupModal from "../../Group/CreateGroup";
import { setGroupId, setGroupName } from "../../../../Redux/Groups/GroupSlice";
import { setSelectedUser, setselectedUserName } from "../../../../Redux/SelectedUser/SelectedUser";

const WorkspacesGroups = () => {
  const [groupsOpen, setGroupsOpen] = useState(false);

  const toggleGroupsAccordion = () => {
    setGroupsOpen(!groupsOpen);
  };

  const baseURL = process.env.REACT_APP_baseURL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const workspaceAdmin = useSelector((state) => state.workspace.workspaceAdmin);
  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  //............................................Fetching Groups...................................

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroupsData();
  }, [workspaceID]);

  const fetchGroupsData = async () => {
    const accessTokem = localStorage.getItem("access");
    const config = {
      headers: {
        Authorization: `Bearer ${accessTokem}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseURL}group/list-groups/${workspaceID}/`,
        config
      );
      if (response.status === 200) {
        setGroups(response.data.groups);
      } else {
        setGroups([]);
      }
    } catch (error) {
      setGroups([]);
      console.log(error);
    }
  };

  const handleGroupLaunch = (id, group_name) => {
    dispatch(setGroupId(id));
    dispatch(setGroupName(group_name));

    dispatch(setselectedUserName(null))
    dispatch(setSelectedUser(null))
    
    navigate("chat");
  };

  return (
    <div>
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
                <ArrowDropDownSharpIcon style={{ fontSize: "24px" }} />
              ) : (
                <ArrowRightSharpIcon style={{ fontSize: "24px" }} />
              )}
              <Diversity3Icon sx={{ color: "white", marginLeft: "8px" }} />{" "}
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
            {workspaceAdmin === authenticated_user_id && (
              <>
                <CreateGroupModal fetchGroupsData={fetchGroupsData} />
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
                  className="  mt-2 hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-500"
                  onClick={() => handleGroupLaunch(group.id, group.group_name)}
                >
                  <div className="flex items-center ">
                    <span className="mr-10 text-base">
                      # {group.group_name}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </div>
  );
};

export default WorkspacesGroups;
