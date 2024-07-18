import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 500,
  bgcolor: "#323232",

  p: 4,
};

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function CreateGroupModal({ open, close, fetchGroupsData }) { 
  const [isPrivate, setIsPrivate] = useState(false);
  const WorkspaceID = useSelector((state) => state.workspace.workspaceId);
  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  const baseURL = process.env.REACT_APP_baseURL;

  const validate = (e) => {
    let group_name = e.target.group_name.value;
    let group_description = e.target.group_description.value;
    let topic = e.target.topic.value;

    // Check if group_name is not empty
    if (!group_name) {
      toast.warning("Group Name cannot be empty!")
      return false; // Validation failed
    }
    if (!group_description) {
      toast.warning("Group Description cannot be empty!")
      return false; // Validation failed
    }
    if (!topic) {
      toast.warning("Group Topic cannot be empty!")
      return false; // Validation failed
    }

    // Check if all values are strings
    if (
      typeof group_name !== "string" ||
      typeof group_description !== "string" ||
      typeof topic !== "string"
    ) {
      toast.warning("All values must be strings.")
      return false; // Validation failed
    }

    // If all validations pass
    return true; // Validation successful
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("group_name", e.target.group_name.value);
    formData.append("description", e.target.group_description.value);
    formData.append("topic", e.target.topic.value);
    formData.append("isPrivate", e.target.elements.isPrivate.checked);

    formData.append("workspace_id", WorkspaceID)
    formData.append("user", authenticated_user_id)

    if (validate(e)) {
      try {
        const accessToken = localStorage.getItem("access");
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        };

        const response = await axios.post(
          `${baseURL}group/create-group/`,
          formData,
          config
        );
        if (response.status === 201) {
          toast.success(response.data.message);
          close()
          fetchGroupsData()
        }
      } catch (error) {
        close()
        console.log("error", error);
          // Loop through each key in the error response data
    Object.keys(error.response.data).forEach((key) => {
      const errorMessages = error.response.data[key];

      // Check the type of errorMessages and handle accordingly
      if (Array.isArray(errorMessages)) {
        // If errorMessages is an array, iterate over each message
        errorMessages.forEach((errorMsg) => {
          toast.error(errorMsg);
        });
      } else if (typeof errorMessages === 'string') {
        // If errorMessages is a string, display it directly
        toast.error(errorMessages);
      } else if (typeof errorMessages === 'object' && errorMessages !== null) {
        // If errorMessages is an object, handle nested errors
        Object.values(errorMessages).forEach((nestedErrorMsg) => {
          if (Array.isArray(nestedErrorMsg)) {
            nestedErrorMsg.forEach((msg) => toast.error(msg));
          } else if (typeof nestedErrorMsg === 'string') {
            toast.error(nestedErrorMsg);
          }
        });
      }
    });
        } 
      }
      }


  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={close}
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
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              className="text-white"
              sx={{ mt: 2, fontSize: "22px" }}
            >
              Create Group
            </Typography>
            <form onSubmit={handleSubmit}>
              <Typography
                id="transition-modal-description"
                sx={{ mt: 2 }}
                className="text-white"
                component="div"
              >
                <TextField
                  id="filled-basic"
                  label="Group Name"
                  variant="standard"
                  name="group_name"
                  sx={{
                    mb: 2,
                    width: "400px",
                    height: "80px",
                    input: { color: "white" },
                    label: { color: "white" },
                  }}
                />
                <TextField
                  id="filled-basic"
                  label="Group Description"
                  variant="standard"
                  name="group_description"
                  sx={{
                    mb: 2,
                    width: "400px",
                    height: "80px",
                    input: { color: "white" },
                    label: { color: "white" },
                  }}
                />
                <TextField
                  id="filled-basic"
                  label="Topic"
                  variant="standard"
                  name="topic"
                  sx={{
                    mb: 2,
                    width: "400px",
                    height: "80px",
                    input: { color: "white" },
                    label: { color: "white" },
                  }}
                />

                <div className="flex justify-between">
                  <div>
                    Private :
                    <Checkbox
                      {...label}
                      name="isPrivate"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "white",
                        },
                      }}
                    />
                  </div>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </div>
              </Typography>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
