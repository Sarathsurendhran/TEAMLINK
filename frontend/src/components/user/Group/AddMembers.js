import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmMessageModalForGroup from "../../ConfirmMessageModals/RemoveUserFromGroup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 500,
  bgcolor: "#323232",
  border: "2px solid #000",
  boxShadow: 20,
  p: 3,
  color: "white",
};

export default function AddMembers({fetchGroupsData}) {
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const workspaceAdmin = useSelector((state) => state.workspace.workspaceAdmin);
  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [groupData, setGroupData] = useState();
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");

  const groupId = useSelector((state) => state.group.groupId);

  // fetching current group details and members of the current groups
  useEffect(() => {
    fetchUsers();
  }, [workspaceID, groupId]);

  const fetchUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        workspaceID: workspaceID,
        groupId:groupId,
      },
    };
    try {
      const response = await axios.get(
        `${baseURL}workspace/get-user-list/`,
        config
      );
      if (response.status === 200) {
        setWorkspaceMembers(response.data.users);
        console.log("success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if(open){
    fetchUsers()
  }

  // add members to the group
  const addMember = async (member_id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        groupId: groupId,
        workspaceID:workspaceID,
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}group/add-member/`,
        { member_id },
        config
      );
      if (response.status === 201) {
        fetchUsers()
        toast.success(response.data.message)
        handleClose()
        fetchGroupsData()
      }else{
        handleClose()
        toast.error(response.data.message)
        fetchGroupsData()
      }
    } catch (error) {
      handleClose()
      console.log(error);
    }
  };

  return (
    <div>
      <button className="p-1 bg-green-600 rounded" onClick={handleOpen}>Add Members</button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className="text-white font-bold text-xl ml-3 mb-3">Add Users</h1>
          <ul className="">
            {workspaceMembers.map((member, index) => (
              <li
                key={index}
                className="flex justify-between p-2 text-white m-2 rounded-sm items-center border"
              >
                <div className="flex items-center space-x-2">
                  <span>{member.user.username}</span>
                  {/* {member.is_admin && (
                <span className="text-red-500 text-sm">admin</span>
              )} */}
                  {/* {member.user.id === authenticated_user_id && (
                <span className="text-red-500 text-sm">(you)</span>
              )} */}
                </div>

                {/* {!member.is_admin &&
              member.user.id !== authenticated_user_id &&
              isWorkspaceAdmin && (
                <ConfirmMessageModal
                  removeMember={() => removeMember(member.user.id)}
                />
              )} */}
                
                <button className="p-1 bg-blue-700 rounded" onClick={()=>addMember(member.id)}>ADD</button>
           
              </li>
            ))}
          </ul>
        </Box>
      </Modal>
    </div>
  );
}
