import React, { useEffect, useState } from "react";
import ProfileModal from "../Group/GroupChat/ProfileModal";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import AddIcCallOutlinedIcon from "@mui/icons-material/AddIcCallOutlined";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { Phone } from "lucide-react";

const WorkspaceInnerHeader = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const navigate = useNavigate();

  const profileImage = useSelector((state) => state.userProfile.profileImage);
  const groupName = useSelector((state) => state.group.groupName);
  const workspaceID = useSelector((state) => state.workspace.workspaceId);

  const selectedUser = useSelector((state) => state.selectedUser.selectedUser);
  const selectedUserName = useSelector(
    (state) => state.selectedUser.selectedUserName
  );

  // const [startVideoCall, setStartVideoCall] = useState(false);
  // const [startAudioCall, setStartAudioCall] = useState(false);


  const handleVideoCall = () => {
    const path = selectedUser
      ? "/workspacehome/one-to-one-chat"
      : "/workspacehome/chat";
    navigate(path, { state: { startVideoCall: true } });
  };

  const handleAudioCall = () => {
    const path = selectedUser
      ? "/workspacehome/one-to-one-chat"
      : "/workspacehome/chat";
    navigate(path, { state: { startAudioCall: true } });
  };

 

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 flex-1 p-2   bg-blue-950 h-14 ml-auto max-w-[78rem] flex justify-around items-center ">
        <h3
          className="text-white ml-3 text-2xl font-sans font-bold cursor-pointer"
          onClick={selectedUserName ? undefined : handleOpen}
        >
          {selectedUserName ? selectedUserName : `# ${groupName}`}
        </h3>
        <div className="w-12"></div>
        <div className="w-12"></div>
        <div className="w-12"></div>
        <div className="w-12"></div>

        <div className="text-white flex items-center">
          <button title="Video Call" onClick={handleVideoCall}>
            <Video size={30} />
          </button>
         
          <button title="Voice Call" onClick={handleAudioCall}>
            <Phone size={22} style={{ marginLeft: "20px" }} />
          </button>
        </div>

      </nav>
      {!selectedUserName && <ProfileModal open={modalOpen} handleClose={handleClose} />}
    </>
  );
};

export default WorkspaceInnerHeader;
