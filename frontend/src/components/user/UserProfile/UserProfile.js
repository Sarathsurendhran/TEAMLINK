import { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UserProfile({ open, toggleDrawer }) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [photo, setPhoto] = useState(null);
  const [email, setEmail] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const baseURL = process.env.REACT_APP_baseURL;
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  const accessToken = localStorage.getItem("access");
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handlePhotoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
      setIsPhotoSelected(true);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [workspaceID, open]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseURL}user/get-user-profile/`, {
        params: {
          user_id: authenticated_user_id,
          workspace_id: workspaceID,
        },
      });
      if (response.status === 200) {
        setName(response.data.user.username);
        setAbout(response.data.about_me);
        setEmail(response.data.user.email);
        setProfilePicUrl(`${baseURL}${response.data.profile_picture}`);  
       
      }
    } catch (error) {
      console.log(error);
    }
  };

  // For change user name

  const changeUserName = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const data = {
      username: name,
      user_id: authenticated_user_id,
    };

    try {
      const response = await axios.post(
        `${baseURL}user/change-user-name/`,
        data,
        config
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("username updated");
        fetchUserData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // change About
  const changeAbout = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const data = {
      about: about,
      user_id: authenticated_user_id,
      workspace_id: workspaceID,
    };

    try {
      const response = await axios.post(
        `${baseURL}user/change-about-user/`,
        data,
        config
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("about updated");
        fetchUserData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // chnage profile pic
  const changeUserProfilePic = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const formData = new FormData();

    formData.append("profile_pic", photo);
    formData.append("user_id", authenticated_user_id);
    formData.append("workspace_id", workspaceID);

    try {
      const response = await axios.post(
        `${baseURL}user/change-profile-pic/`,
        formData,
        config
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("ProfilePic updated");
        fetchUserData();
        setPhoto(null);
        setIsPhotoSelected(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Create a preview URL when the photo changes
    if (photo) {
      const newPreviewUrl = URL.createObjectURL(photo);
      setPreviewUrl(newPreviewUrl);

      // Clean up the previous preview URL
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }
  }, [photo]);

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
          src={profilePicUrl}
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
        {isPhotoSelected && (
          <Button
            variant="contained"
            color="secondary"
            onClick={changeUserProfilePic}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        )}
      </Box>

      {/* Name Edit Section */}
      <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditingName}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditingName(!isEditingName)}
          sx={{ ml: 2 }}
        >
          {isEditingName ? (
            <button onClick={changeUserName}>Submit</button>
          ) : (
            "Edit"
          )}
        </Button>
      </Box>

      {/* About Me Section */}
      <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          label="About Me"
          multiline
          rows={4}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          disabled={!isEditingAbout}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditingAbout(!isEditingAbout)}
          sx={{ ml: 2 }}
        >
          {isEditingAbout ? (
            <button onClick={changeAbout}>Submit</button>
          ) : (
            "Edit"
          )}
        </Button>
      </Box>

      {/* Email Section */}
      <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditingEmail}
        />
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditingEmail(!isEditingEmail)}
          sx={{ ml: 2 }}
        >
          {isEditingEmail ? "Submit" : "Edit"}
        </Button> */}
      </Box>

      {/* <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Save the changes logic
            console.log("Profile Updated:", { name, about, email, photo });
            toggleDrawer(false)();
          }}
        >
          Save Changes
        </Button>
      </Box> */}
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
