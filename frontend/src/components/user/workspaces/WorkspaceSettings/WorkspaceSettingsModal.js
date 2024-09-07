import React, { Suspense, lazy } from "react";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";

import WorkSpaceTabs from "./WorkSpaceTabs";
import { useSelector } from "react-redux";
import PrivateRoutes from "../../../private_routes/private_routes";

const WorkspaceSettingsModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const workspaceName = useSelector((state) => state.workspace.workspaceName);
  const previousWorkspaceName = React.useRef(workspaceName);

  React.useEffect(() => {
    if (workspaceName !== previousWorkspaceName.current) {
      setOpen(false);
    }
    previousWorkspaceName.current = workspaceName;
  }, [workspaceName]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "90%" : 600,
    height: isSmallScreen ? "90%" : 600,
    bgcolor: "#323232",
    border: "2px solid #000",
    boxShadow: 20,
    p: 3,
    color: "white",
  };

  return (
    <div>
      <div className="px-6 mt-9">
        <a
          className="flex-none text-3xl  font-semibold text-white"
          href="#"
          onClick={handleOpen}
          aria-label="Brand"
        >
          {workspaceName}

          <ArrowDropDownSharpIcon />
        </a>
      </div>

      {/* <div className="mt-6">
        <hr className="border-slate-500" />
      </div> */}


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
            <div
              id="transition-modal-title"
              className="text-white font-bold text-2xl font-serif ml-1 mt-2 border-b-2 border-gray-400 pb-2"
              variant="h6"
              component="h2"
            >
              Workspace Settings
            </div>

            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <PrivateRoutes>
                <WorkSpaceTabs />
              </PrivateRoutes>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default WorkspaceSettingsModal;
