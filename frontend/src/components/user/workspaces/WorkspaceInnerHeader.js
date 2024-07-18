import React,{useState} from "react";
import ProfileModal from "../chat/ProfileModal";

const WorkspaceInnerHeader = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 flex-1 p-2 bg-blue-950 h-16 ml-auto max-w-[78rem]">
        <div
          className="w-12 h-12  ml-16 bg-blue-500 rounded-full border cursor-pointer"
          onClick={handleOpen}
        ></div>
      </nav>
      <ProfileModal open={modalOpen} handleClose={handleClose}/>
    </>
  );
};

export default WorkspaceInnerHeader;
