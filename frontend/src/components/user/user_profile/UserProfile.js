
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";

export default function UserProfile({ open, toggleDrawer }) {
  const [name, setName] = useState("John Doe");
  const [about, setAbout] = useState("A short description about me...");
  const [photo, setPhoto] = useState(null);
  const baseURL = process.env.REACT_APP_baseURL;
  // const workspaceID = useSelector((state) => state.workspace.workspaceId);



  const handlePhotoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(URL.createObjectURL(event.target.files[0]));
    }
  };

  const DrawerList = (
    <Box sx={{ width: 400, p: 3 }} role="presentation">
      <IconButton
        sx={{ position: "absolute", top: 8, left: 8 }}
        onClick={toggleDrawer(false)}
      >
        <CloseIcon />
      </IconButton>
      <Divider sx={{ mt: 5 }} />

      {/* Photo Upload Section */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Avatar
          alt="User Photo"
          src={photo}
          sx={{ width: 100, height: 100, margin: "0 auto" }}
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="upload-photo"
          type="file"
          onChange={handlePhotoChange}
        />
        <label htmlFor="upload-photo">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<PhotoCamera />}
            sx={{ mt: 2 }}
          >
            Upload Photo
          </Button>
        </label>
      </Box>

      {/* Name Edit Section */}
      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>

      {/* About Me Section */}
      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="About Me"
          multiline
          rows={4}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </Box>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Save the changes logic
            console.log("Profile Updated:", { name, about, photo });
            toggleDrawer(false)();
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
