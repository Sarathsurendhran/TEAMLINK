import React, { useEffect, useState } from "react";
import ProfileModal from "../chat/ProfileModal";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

const WorkspaceInnerHeader = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const profileImage = useSelector((state) => state.userProfile.profileImage);
  const groupName = useSelector((state) => state.group.groupName);
  const workspaceID = useSelector((state)=>state.workspace.workspaceId)
  const baseURL = process.env.REACT_APP_baseURL



  //.............. fetechig the general group...........

  const fetchGroupData = async () => {
    try {
      const response = await axios.get(`${baseURL}group/group-detail/${workspaceID}/`);
      // Handle the response data
      console.log(response.data);
    } catch (error) {
      // Handle errors
      console.error("Error fetching group data:", error);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, []); 

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 flex-1 p-2 bg-blue-950 h-16 ml-auto max-w-[78rem] ">
        <div className="flex justify-start items-center ">
          <div
            className="w-12 h-12  ml-16 bg-blue-500 rounded-full border cursor-pointer"
            onClick={handleOpen}
          ></div>
          {/* <Avatar src="/broken-image.jpg" /> */}

          <h3
            className="text-white ml-3 text-xl font-sans font-bold cursor-pointer"
            onClick={handleOpen}
          >
            {groupName}
          </h3>
        </div>
      </nav>
      <ProfileModal open={modalOpen} handleClose={handleClose} />
    </>
  );
};

export default WorkspaceInnerHeader;
