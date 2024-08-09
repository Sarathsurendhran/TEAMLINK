import React, { useEffect, useState } from "react";
import ProfileModal from "../chat/ProfileModal";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import AddIcCallOutlinedIcon from "@mui/icons-material/AddIcCallOutlined";
import { useNavigate } from "react-router-dom";

const WorkspaceInnerHeader = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const navigate = useNavigate();

  const profileImage = useSelector((state) => state.userProfile.profileImage);
  const groupName = useSelector((state) => state.group.groupName);
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const [startVideoCall, setStartVideoCall] = useState(false);
  const [startAudioCall, setStartAudioCall] = useState(false);

  const handleVideoCall = () => {
    const newStartVideoCall = true;
    setStartVideoCall(newStartVideoCall);
    navigate("/workspacehome/chat", { state: { startVideoCall: newStartVideoCall } });
  };

  const handleAudioCall = () => {
    const newStartAudioCall = true;
    setStartVideoCall(newStartAudioCall);
    navigate("/workspacehome/chat", { state: { startAudioCall: newStartAudioCall } });
  };
  

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 flex-1 p-2   bg-blue-950 h-14 ml-auto max-w-[78rem] flex justify-around items-center ">
        {/* <div className="flex  items-center "> */}
        {/* <div
            className="w-12 h-12  ml-16 bg-blue-500 rounded-full border cursor-pointer"
            onClick={handleOpen}
          ></div> */}
        {/* <Avatar src="/broken-image.jpg" /> */}

        <h3
          className="text-white ml-3 text-2xl font-sans font-bold cursor-pointer"
          onClick={handleOpen}
        >
          # {groupName}
        </h3>
        <div className="w-12"></div>
        <div className="w-12"></div>
        <div className="w-12"></div>
        <div className="w-12"></div>

        <div className="text-white ">
          <button title="Video Call" onClick={handleVideoCall}>
            <VideoCallOutlinedIcon style={{ fontSize: 40 }} />
          </button>

          <button title="Voice Call" onClick={handleAudioCall}>
            <AddIcCallOutlinedIcon
              style={{ fontSize: 27, marginLeft: "20px" }}
            />
          </button>
        </div>

        {/* </div> */}
      </nav>
      <ProfileModal open={modalOpen} handleClose={handleClose} />
    </>
  );
};

export default WorkspaceInnerHeader;
