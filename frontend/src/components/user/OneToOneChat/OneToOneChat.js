import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import { ReadyState } from "react-use-websocket";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import OneToOneChatTextEditor from "./OneToOneChatTextEditor";
import { useLocation, useNavigate } from "react-router-dom";

import OneToOneVideoCallAlert from "./OneToOneCall/OneToOneVideoCallAlert";
import OneToOneAudioCallAlert from "./OneToOneCall/OneToOneAudioCallAlert";
import { set } from "date-fns";

export default function OneToOneChat() {
  const baseURL = process.env.REACT_APP_baseURL;
  const webSocketURL = process.env.REACT_APP_webSocketURL;
  const navigate = useNavigate();

  const { id, username } = useSelector((state) => state.authenticationUser);
  const [chatHistory, setChatHistory] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const chatContainerRef = useRef(null);

  const selectedUser = useSelector((state) => state.selectedUser.selectedUser);
  const selectedUserName = useSelector(
    (state) => state.selectedUser.selectedUserName
  );

  // Compute roomId
  const roomId = `chat_${Math.min(id, selectedUser)}-${Math.max(
    id,
    selectedUser
  )}`;

  const [videoCallAlert, setVideoCallAlert] = useState(false);
  const [audioCallAlert, setAudioCallAlert] = useState(false);

  const location = useLocation();
  const { startVideoCall } = location.state || {};

  const { startAudioCall } = location.state || {};

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${webSocketURL}ws/dm-chat/${id}/${selectedUser}/`,
    {
      onOpen: () => {
        console.log("Websocket connection is opened");
        loadInitialMessages();
      },
      onClose: () => {
        console.log("Websocket connection is closed");
        setChatHistory([]);
      },
      shouldReconnect: (closeEvent) => true,
    }
  );

  const loadInitialMessages = () => {
    sendMessage(
      JSON.stringify({ action: "load_more", page_number: pageNumber })
    );
  };

  console.log("pageNumber", pageNumber);

  const loadMoreMessages = () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    // setIsLoadingOldMessages(false);

    sendMessage(
      JSON.stringify({ action: "load_more", page_number: pageNumber })
    );
  };

  useEffect(() => {
    if (lastMessage?.data) {
      const messageData = JSON.parse(lastMessage.data);

      console.log(messageData);

      if (messageData.type === "video_call") {
        if (messageData.sender === id) {
          // Navigate to the video call route if the current user initiated the call
          navigate(`/one-to-one-video/${roomId}/`);
        } else {
          // Show video call alert if the call was initiated by someone else
          setVideoCallAlert(true);
        }
      } else if (messageData.type === "audio_call") {
        if (messageData.sender === id) {
          navigate(`/one-to-one-audio/${roomId}/`);
        } else {
          setAudioCallAlert(true);
        }
      } else if (messageData.message_type === "paginated_messages") {
        setChatHistory((prev) => [...messageData.messages, ...prev]);
        setPageNumber(messageData.next_page_number || pageNumber);
        setHasMore(Boolean(messageData.next_page_number));

        setIsLoadingMore(false);

        if (chatContainerRef.current) {
          const chatContainer = chatContainerRef.current;
          const offset = 50;
          chatContainer.scrollTop = offset;
        }
      } else if (messageData.message_type === "real_time_message") {
        setChatHistory((prev) => [...prev, messageData]);
        if (chatContainerRef.current) {
          const chatContainer = chatContainerRef.current;
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }
    }
  }, [lastMessage]);

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

  //------------------------------------call--------------------------------
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
      console.log("Websocket is not open");
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
      console.log("Websocket is not open");
    }
  };

  if (startAudioCall) {
    audioCall();
  }

  return (
    <>
      <div
        className="h-screen bg-[#e9e9e9] flex ml-auto max-w-[76rem] flex-col overflow-y-scroll"
        ref={chatContainerRef}
      >
        <div>
          <div className="flex-1 px-4 py-2 mt-24 mb-28 max-h-full ">
            {/* Display loader at the top when loading old messages */}
            {/* {isLoadingOldMessages && (
              <div className="flex justify-center items-center my-4">
                <div className="loader" />
                <span className="text-white ml-2">Loading...</span>
              </div>
            )} */}

            {chatHistory.map((msg, index) => (
              <>
                <div className="text-slate-900 flex justify-center items-center">
                  {new Date(msg.time).toLocaleDateString()}
                </div>
                <div
                  key={index}
                  className={`mb-2 mr-4 flex ${
                    msg.sender === id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-sm">
                    <div className="text-white font-medium">{msg.username}</div>
                    <div className="bg-white   text-black rounded-lg p-2 shadow-xl mb-2 text-lg">
                      {msg.message.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                        <img
                          src={msg.message}
                          alt="Message Content"
                          className="max-w-full h-auto rounded"
                        />
                      ) : msg.message.match(/\.(mp3|wav|ogg|m4a)$/) ? (
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
                      ) : msg.message.match(/\.(mp4|webm|ogg|avi)$/) ? (
                        <video controls className="max-w-full h-auto rounded">
                          <source
                            src={msg.message}
                            type={`video/${msg.message.split(".").pop()}`}
                          />
                          Your browser does not support the video element.
                        </video>
                      ) : msg.message.match(
                          /\.(docx|pdf|txt|xlsx|xls|html|csv|zip)$/
                        ) ? (
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
                        <>
                          <div className="">
                            <div className="mr-10 text-start ">
                              {msg.message}
                            </div>
                            <div className="text-slate-900 text-xs min-w-8 text-end">
                              {new Date(msg.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>

        {videoCallAlert && (
          <OneToOneVideoCallAlert
            setVideoCallAlert={setVideoCallAlert}
            roomId={roomId}
          />
        )}
        {audioCallAlert && (
          <OneToOneAudioCallAlert
            setAudioCallAlert={setAudioCallAlert}
            roomId={roomId}
          />
        )}
        <div className="flex justify-center items-center">
          <OneToOneChatTextEditor
            sendMessage={sendMessage}
            readyState={readyState}
          />
        </div>
      </div>
    </>
  );
}
