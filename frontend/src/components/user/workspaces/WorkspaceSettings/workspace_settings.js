import * as React from "react";
import { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setWorkspaceId } from "../../../../Redux/WorkspaceID/workspaceSlice";
import axios from "axios";
import { Button } from "@mui/material";
import ChildModal from "../workspace_user_settings"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function WorkspaceSettings({ open, handleClose, fetchDataFunction }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [user, setUser] = useState(null);
  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  useEffect(() => {
    const fetechWorkspace = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const res = await axios.get(
          `${baseURL}workspace/list-workspaces/`,
          config
        );

        setWorkspaces(res.data.workspaces);
        setUser(res.data.user.email);
      } catch (error) {
        console.log(error);
      }
    };
    fetechWorkspace();
  }, []);

  const handleLaunch = async (id) => {
    dispatch(setWorkspaceId(id));
    navigate(`/workspacehome`);
  };

  return (
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
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Workspaces
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            <div className="flex flex-col items-center w-full max-w-xl overflow-y-auto ">
              {workspaces.length > 0 ? (
                workspaces.map((workspace, index) => (
                  <div
                    key={index}
                    className="w-full max-w-xl rounded-xl bg-[#7157FE] mb-2 mt-2 h-10 transition cursor-pointer hover:-translate-y-1.5 text-center flex items-center justify-center  hover:bg-indigo-500"
                    onClick={() => handleLaunch(workspace.id)}
                  >
                    <h1 className="text-2xl font-bold font-sans text-white">
                      {workspace.workspace_name}
                    </h1>{" "}
                  </div>
                ))
              ) : (
                <p>NO workspaces</p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <p>OR</p>
              <Link to={"/createworkspace"}>
                <Button variant="contained" color="success">
                  Create Another Workspace
                </Button>
              </Link>
              <ChildModal fetchDataFunction={fetchDataFunction}/>
            </div>
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}
