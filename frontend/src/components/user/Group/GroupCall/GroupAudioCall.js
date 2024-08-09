import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect } from "react"; // Import useRef and useEffect
import { toast } from "react-toastify";

const GroupAudioCall = () => {
  let { roomId } = useParams();
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { id, username } = useSelector((state) => state.authenticationUser);
  const groupId = useSelector((state) => state.group.groupId);
  const zpRef = useRef(null);

  const handleLeaveRoom = () => {
    console.log('Leaving room...');
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
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: false,
          showPreJoinView: false,
          turnOnMicrophoneWhenJoining: true,
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
      <div className="w-full h-full" ref={containerRef} />
    </>
  );
};

export default GroupAudioCall;
