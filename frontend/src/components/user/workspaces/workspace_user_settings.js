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



  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
