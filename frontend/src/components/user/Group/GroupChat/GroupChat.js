import React, { useState, useEffect, useRef } from "react";
import ChatTextEditor from "./ChatTextEditor";
import { useSelector, useDispatch } from "react-redux";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { setGroupId, setGroupName } from "../../../../Redux/Groups/GroupSlice";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCallAlert from "../GroupCall/GroupVideoCallAlert";
import AudioCallAlert from "../GroupCall/GroupAudioCallAlert";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const Chat = () => {
  const baseURL = process.env.REACT_APP_baseURL;
  const webSocketURL = process.env.REACT_APP_webSocketURL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const groupId = useSelector((state) => state.group.groupId);
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const { id, username } = useSelector((state) => state.authenticationUser);

  const [chatMessages, setChatMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const chatContainerRef = useRef(null);

  const [videoCallAlert, setVideoCallAlert] = useState(false);
  const [audioCallAlert, setAudioCallAlert] = useState(false);

  const location = useLocation();
  const { startVideoCall } = location.state || {};
  const { startAudioCall } = location.state || {};

  // WebSocket connection using useWebSocket hook
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${webSocketURL}ws/group-chat/${groupId}/`,
    {
      onOpen: () => {
        console.log("WebSocket connected");
        loadInitialMessages();
      },
      onClose: () => {
        console.log("WebSocket disconnected");
        setChatMessages([]);
      },
      shouldReconnect: (closeEvent) => true,
    }
  );

  const loadInitialMessages = () => {
    sendMessage(
      JSON.stringify({ action: "load_more", page_number: pageNumber })
    );
  };

  const loadMoreMessages = () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    sendMessage(
      JSON.stringify({ action: "load_more", page_number: pageNumber })
    );
  };

  // Fetching group data
  const fetchGroupData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}group/group-detail/${workspaceID}/`
      );
      dispatch(setGroupId(response.data.id));
      dispatch(setGroupName(response.data.group_name));
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  };

  useEffect(() => {
    // if (!groupId) {
    //   fetchGroupData();
    // }
    fetchGroupData();
  }, [workspaceID]);

  // WebSocket message handling
  useEffect(() => {
    if (lastMessage?.data) {
      const messageData = JSON.parse(lastMessage.data);

      if (messageData.type === "video_call") {
        if (messageData.sender === id) {
          navigate(`/group-video/${groupId}/`);
        } else {
          setVideoCallAlert(true);
        }
      } else if (messageData.type === "audio_call") {
        if (messageData.sender === id) {
          navigate(`/audio-call/${groupId}/`);
        } else {
          setAudioCallAlert(true);
        }
      } else if (messageData.message_type === "paginated_messages") {
        setChatMessages((prev) => [...messageData.messages, ...prev]);
        setPageNumber(messageData.next_page_number || pageNumber);
        setHasMore(Boolean(messageData.next_page_number));
        setIsLoadingMore(false);

        if (chatContainerRef.current) {
          const chatContainer = chatContainerRef.current;
          const offset = 50;
          chatContainer.scrollTop = offset;
        }
      } else if (messageData.message_type === "real_time_message") {
        setChatMessages((prev) => [...prev, messageData]);
    
        if (chatContainerRef.current) {
          const chatContainer = chatContainerRef.current;
          // chatContainer.scrollTop = chatContainer.scrollHeight;
      
        setTimeout(() => {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
      }
      }
    }
  }, [lastMessage]);

  // Scroll to load more messages
  const handleScroll = () => {
    if (
      chatContainerRef.current &&
      chatContainerRef.current.scrollTop === 0 &&
      hasMore &&
      !isLoadingMore
    ) {
      loadMoreMessages();
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, isLoadingMore]);

  // Video and audio call triggers
  const videoCall = () => {
    const message = {
      message: "started video call",
      type: "video_call",
      sender: id,
      username: username,
    };

    if (readyState === WebSocket.OPEN) {
      sendMessage(JSON.stringify(message));
    } else {
      console.log("WebSocket is not open");
    }
  };

  if (startVideoCall) {
    videoCall();
  }

  const audioCall = () => {
    const message = {
      message: "started audio call",
      type: "audio_call",
      sender: id,
      username: username,
    };
    if (readyState === WebSocket.OPEN) {
      sendMessage(JSON.stringify(message));
    } else {
      console.log("WebSocket is not open");
    }
  };

  if (startAudioCall) {
    audioCall();
  }


  return (
    <>
      <div
        className="h-screen bg-[#e9e9e9] border flex ml-auto max-w-[76rem] flex-col overflow-y-scroll"
        ref={chatContainerRef}
      >
        <div>
          <div className="flex-1 px-4 py-2 mt-24 mb-28 max-h-full ">
            {/* {chatMessages.length === 0 && (
              <div className="text-white">No messages yet...</div>
            )} */}
            {chatMessages.map((msg, index) => (
              <>
                <div className="text-slate-900 flex justify-center items-center">
                  {new Date(msg.time).toLocaleDateString()}
                </div>
                <div
                  key={index}
                  className={`mb-2 mr-2 ml-2 flex ${
                    msg.sender === id ? "justify-end " : "justify-start"
                  }`}
                >
                  <div className="max-w-sm">
                    <div className="text-slate-800 text-lg font-medium">
                      {msg.username}
                    </div>
                    <div className="bg-white   text-black rounded-lg p-2 shadow-xl mb-2 text-lg">
                      {msg.message.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) ? (
                        <img
                          src={msg.message}
                          alt="Message Content"
                          className="max-w-full h-auto rounded"
                        />
                      ) : msg.message.match(/\.(mp3|wav|ogg|m4a)$/) ? (
                        <>
                          <audio
                            key={index}
                            controls
                            className="max-w-full h-auto rounded"
                          >
                            <source
                              src={msg.message}
                              type={`audio/${msg.message.split(".").pop()}`}
                            />
                          </audio>
                        </>
                      ) : msg.message.match(/\.(mp4|webm|ogg|avi)$/) ? (
                        <video controls className="max-w-full h-auto rounded">
                          <source
                            src={msg.message}
                            type={`video/${msg.message.split(".").pop()}`}
                          />
                          Your browser does not support the video element.
                        </video>
                      ) : msg.message.match(/\.(docx|pdf|txt|xlsx|xls|html|csv|zip)$/) ? (
                        <div className="flex items-center">
                          <span className="material-icons mr-2">
                            <InsertDriveFileIcon />
                          </span>
                          <a
                            href={msg.message}
                            download
                            className="text-blue-500 underline"
                          >
                            {msg.message.split("/").pop().length > 20
                              ? msg.message.split("/").pop().substring(0, 20) +
                                "..."
                              : msg.message.split("/").pop()}
                            {/* Display truncated file name */}
                          </a>
                        </div>
                      ) : (
                        <div className="">
                          <div className="mr-10 text-start ">{msg.message}</div>
                          <div className="text-slate-900 text-xs min-w-8 text-end">
                            {new Date(msg.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>

        {videoCallAlert && (
          <VideoCallAlert
            setVideoCallAlert={setVideoCallAlert}
            roomId={groupId}
          />
        )}
        {audioCallAlert && (
          <AudioCallAlert
            setAudioCallAlert={setAudioCallAlert}
            roomId={groupId}
          />
        )}
        <div className="flex justify-center items-center">
          <ChatTextEditor sendMessage={sendMessage} readyState={readyState} />
        </div>
      </div>
    </>
  );
};

export default Chat;
