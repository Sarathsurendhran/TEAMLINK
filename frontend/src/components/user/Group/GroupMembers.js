import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmMessageModalForGroup from "../../ConfirmMessageModals/RemoveUserFromGroup";
import AddMembers from "./AddMembers";

const GroupMembers = () => {
  const [groupData, setGroupData] = useState();
  const [groupMembers, setGroupMembers] = useState([]);
  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");

  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const workspaceAdmin = useSelector((state) => state.workspace.workspaceAdmin);
  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  const groupId = useSelector((state) => state.group.groupId);

  // fetching current group details and members of the current groups
  useEffect(() => {
    fetchGroupsData();
  }, [groupId]);

  const fetchGroupsData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        groupId: groupId,
      },
    };
    try {
      const response = await axios.get(
        `${baseURL}group/get-group-details/`,
        config
      );
      if (response.status === 200) {
        setGroupMembers(response.data.members);
        console.log("success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // removing from the group
  const removeMember = async (member_id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        groupId: groupId,
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}group/remove-group-member/`,
        { member_id },
        config
      );
      if (response.status === 200) {
        fetchGroupsData();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(workspaceAdmin, authenticated_user_id);

  return (
    <>
      {authenticated_user_id === workspaceAdmin && (
        <AddMembers fetchGroupsData={fetchGroupsData} />
      )}

      <ul className="">
        {groupMembers.map((member, index) => (
          <li
            key={index}
            className="flex justify-between p-2 m-2 rounded-sm items-center border"
          >
            <div className="flex items-center space-x-2">
              <span>{member.username}</span>
              {/* {member.is_admin && (
                <span className="text-red-500 text-sm">admin</span>
              )} */}
              {/* {member.user.id === authenticated_user_id && (
                <span className="text-red-500 text-sm">(you)</span>
              )} */}
            </div>

            {/* {workspaceAdmin !== member.user_id &&
              authenticated_user_id !== member.user_id && (
                <ConfirmMessageModalForGroup
                  removeMember={() => removeMember(member.member)}
                />
              )} */}
            {authenticated_user_id === workspaceAdmin &&
              authenticated_user_id !== member.user_id && (
                <ConfirmMessageModalForGroup
                  removeMember={() => removeMember(member.member)}
                />
              )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default GroupMembers;
