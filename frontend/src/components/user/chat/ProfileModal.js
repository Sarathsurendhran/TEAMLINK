import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProfileTab from "./ProfileTabs";

const ProfileModal = ({ open, handleClose}) => {
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
              className="bg-white h-24"
              variant="h6"
              component="h2"
            >
              Text in a modal
            </Typography>

            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
               <ProfileTab />
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ProfileModal;
