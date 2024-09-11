import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CircularProgress from '@mui/material/CircularProgress';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "400px",
  bgcolor: "#1e293b", // dark background color
  color: "#fff", // white text color
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export default function WorkspaceAddUsers() {
  const baseURL = process.env.REACT_APP_baseURL;
  const navigate = useNavigate();
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        handleClose()
        setLoading(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      setLoading(false);

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

  return (
    <div>
      <button
        type="button"
        className="w-full text-start flex items-center gap-x-2 py-2 px-2.5 text-base text-white rounded-lg hover:bg-gray-400"
        onClick={handleOpen}
      >
        <PersonAddAltIcon sx={{ color: "white" }} />
        Add Users
      </button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
      <Fade in={open}>
      <Box sx={style}>
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <>
            {/* Modal header */}
            <div className="p-4 border-b border-gray-600 flex justify-between items-center">
              <Typography variant="h6" component="h3" className="text-white">
                Add Members
              </Typography>
              <Button
                type="button"
                className="text-gray-400 hover:text-gray-900 rounded-lg p-1"
                onClick={handleClose}
              >
                <svg
                  className="w-4 h-4"
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
              </Button>
            </div>
            {/* Modal body */}
            <div className="p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Add email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg w-full p-2.5 placeholder-gray-400"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm py-2.5"
                >
                  Send Invitation
                </Button>
              </form>
            </div>
          </>
        )}
      </Box>
    </Fade>
      </Modal>
    </div>
  );
}
