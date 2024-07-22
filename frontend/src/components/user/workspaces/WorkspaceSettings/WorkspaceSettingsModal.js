import * as React from "react";

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
          className="flex-none text-2xl font-semibold text-white"
          href="#"
          onClick={handleOpen}
          aria-label="Brand"
        >
          {workspaceName}

          <ArrowDropDownSharpIcon />
        </a>
      </div>
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
            <Typography
              id="transition-modal-title"
              className="bg-white h-14"
              variant="h6"
              component="h2"
            >
              Text in a modal
            </Typography>

            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <WorkSpaceTabs />
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default WorkspaceSettingsModal;
