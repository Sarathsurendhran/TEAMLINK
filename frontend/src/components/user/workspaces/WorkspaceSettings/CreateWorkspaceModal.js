import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#f0f0f0",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CreateWorkspaceModal({fetechWorkspace}) {
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const baseURL = process.env.REACT_APP_baseURL;
  const dispatch = useDispatch()

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!workspaceName) {
      toast.warning("Workspace Name cannot be empty!");

      return false;
    }

    if (!workspaceDescription) {
      toast.warning("Workspace Descriptiion cannot be empty!");
      return false;
    }

    const formData = new FormData();
    formData.append("workspace_name", workspaceName);
    formData.append("description", workspaceDescription);

    try {
      const access_token = localStorage.getItem("access");

      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      const res = await axios.post(
        `${baseURL}workspace/create-workspace/`,
        formData,
        config
      );
      if (res.status === 201) {
        toast.success("Workspace Created Successfully");
        fetechWorkspace()
      }
    } catch (error) {
      console.log(error);
      toast.error("error");
    }

    handleClose();
  };

  return (
    <>
      <div>
        <button
          onClick={handleOpen}
          className="text-white bg-green-600 p-2 rounded"
        >
          Create Another Workspace
        </button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create Workspace
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              id="workspace-name"
              label="Workspace Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              id="workspace-description"
              label="Workspace Description"
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              multiline
              rows={4} // Adjust the number of rows as needed
              variant="outlined" // Optional: to add an outline around the text field
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
}
