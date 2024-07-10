import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  height: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function ChildModal({fetchDataFunction}) {
  const baseURL = process.env.REACT_APP_baseURL;
  const navigate = useNavigate();
  const workspaceID = useSelector((state) => state.workspace.workspaceId);

  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  const [menuItems, setMenuItems] = useState([]);
  const [workspaceAdmin, setWorkspaceAdmin] = useState()

  // feteching all the data of the current workspace and user

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {}
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
        // toast.success(res.data.message);
        setWorkspaceAdmin(res.data.workspace_data.created_by)
    

        const members_data = res.data.members_data;
        const members = Array.isArray(members_data) ? members_data : [];
        setMenuItems(members);
        
      }
    } catch (error) {
      console.error("Error launching workspace:", error);
    }
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //remove member
  const removeMember = async (user_id) => {
    const accessToken = localStorage.getItem("access");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const res = await axios.post(
        `${baseURL}workspace/remove-user/`,
        { user_id, workspaceID },
        config
      );
      if (res.status === 200) {
        fetchData();
        toast.success(res.data.message);
        fetchDataFunction() // For triggering sidebar 
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return (
    <React.Fragment>
    {authenticated_user_id === workspaceAdmin && (
      <>
        <Button onClick={handleOpen}>Open User Settings</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style }}>
            <h2 className="font-bold text-2xl">Members</h2>
            <ul className="">
              {menuItems.map((member, index) => (
                <li
                  key={index}
                  className="flex justify-between p-2 m-2 items-center border bg-slate-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span>{member.user.username}</span>
                    {member.is_admin && (
                      <span className="text-red-500 text-sm">admin</span>
                    )}
                    {member.user.id === authenticated_user_id && (
                      <span className="text-red-500 text-sm">(you)</span>
                    )}
                  </div>
                  {!member.is_admin &&
                    member.user.id !== authenticated_user_id && (
                      <button
                        className="text-white bg-red-500 hover:bg-red-700 p-1 rounded"
                        onClick={() => removeMember(member.user.id)}
                      >
                        Remove
                      </button>
                    )}
                </li>
              ))}
            </ul>
            <Button onClick={handleClose}>Close</Button>
          </Box>
        </Modal>
        </>
    )}
    </React.Fragment>
  );
}

export default ChildModal;
