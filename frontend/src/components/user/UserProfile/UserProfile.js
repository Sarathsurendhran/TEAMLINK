import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setProfileImage } from "../../../Redux/UserProfile/userProfileSlice";

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
  const dispatch = useDispatch()

  const accessToken = localStorage.getItem("access");
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  

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
        setProfilePicUrl(response.data.profile_picture);
        dispatch(setProfileImage(response.data.profile_picture))
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

  // Change About
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

  // Change profile pic
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
        setIsPhotoSelected(false)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const DrawerList = (
    <>
      <Box
        sx={{
          width: 400,
          p: 3,
          color: "white",
          height: "100vh",
          backgroundColor: "#323232",
        }}
        role="presentation"
      >
        <IconButton
          sx={{ position: "absolute", top: 8, left: 8, color: "white" }}
          onClick={toggleDrawer(false)}
        >
          <CloseIcon />
        </IconButton>
        <Divider sx={{ mt: 5 }} />

        {/* Photo Upload Section */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Avatar
            alt="User Photo"
            src={baseURL.replace(/\/$/, '') + profilePicUrl} 
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
              sx={{ mt: 2, ml:1 }}
            >
              Submit
            </Button>
          )}
        </Box>

        {/* Name Edit Section */}
        <div className="mt-6">
          <div className=" mb-1 text-lg">
            <label htmlFor="">Name</label>
          </div>
          <div className=" flex items-center">
            <input
              type="text"
              className={`w-full border border-gray-300 p-2 rounded focus:border-blue-500 ${
                isEditingName ? "text-black" : ""
              }`}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditingName}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setIsEditingName(!isEditingName)}
            >
              {isEditingName ? (
                <button onClick={changeUserName}>Submit</button>
              ) : (
                "Edit"
              )}
            </button>
          </div>
        </div>
        {/* About Me Section */}
        <div className="flex-col mt-4 ">
          <div className=" mb-1 text-lg">
            <label htmlFor="">About</label>
          </div>

          <div className=" flex items-center ">
            <textarea
              className={`w-full border border-gray-300 p-2 rounded focus:border-blue-500 ${
                isEditingAbout ? "text-black" : ""
              }`}
              placeholder="About Me"
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              disabled={!isEditingAbout}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setIsEditingAbout(!isEditingAbout)}
            >
              {isEditingAbout ? (
                <button onClick={changeAbout}>Submit</button>
              ) : (
                "Edit"
              )}
            </button>
          </div>
        </div>

        {/* Email Section */}
        <div className="mt-3 flex flex-col">
          <label className="mb-1 text-lg" htmlFor="">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditingEmail}
          />
        </div>
      </Box>
    </>
  );

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
