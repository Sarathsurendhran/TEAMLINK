import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const GroupVideoCall = () => {
  let { roomId } = useParams();
  const containerRef = useRef(null);
  // const workspaceProfile = useSelector((state)=> state.workspaceUserProfile)

  const navigate = useNavigate();

  const { id, username } = useSelector((state) => state.authenticationUser);
  const groupId = useSelector((state) => state.group.groupId);
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const zpRef = useRef(null);

  const handleLeaveRoom = () => {
    console.log("Leaving room...");
    if (zpRef.current) {
      zpRef.current.destroy(); // Destroy the ZegoUIKitPrebuilt instance
      zpRef.current = null; // Reset the reference
    }
    navigate(`/workspacehome/chat`);
  };

  useEffect(() => {
    const MyVideoCallMeet = async () => {
      try {
        const appID = 1689713443;
        const serverSecret = "a48fc9c6896ec0c746ea45b80769cda1";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          Date.now().toString(),
          username
        );
        console.log(kitToken, "THIS IS KIT TOKEN");

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          showPreJoinView: false,
          onLeaveRoom: handleLeaveRoom,
        });
      } catch (error) {
        console.error("Error generating kit token:", error);
      }
    };
    MyVideoCallMeet(); // Call MyVideoCallMeet with the ref element
  }, [roomId, id, username, navigate]);

  return (
    <>
    <div className="w-screen h-screen">
      <div className="w-full h-full" ref={containerRef} />
    </div>
    </>
  );
};

export default GroupVideoCall;
