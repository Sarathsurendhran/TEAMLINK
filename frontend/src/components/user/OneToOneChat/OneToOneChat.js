import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import { ReadyState } from "react-use-websocket";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import OneToOneChatTextEditor from "./OneToOneChatTextEditor";
import { useLocation, useNavigate } from "react-router-dom";

import OneToOneVideoCallAlert from "./OneToOneCall/OneToOneVideoCallAlert";
import OneToOneAudioCallAlert from "./OneToOneCall/OneToOneAudioCallAlert";

export default function OneToOneChat() {
  const baseURL = process.env.REACT_APP_baseURL;
  const webSocketURL = process.env.REACT_APP_webSocketURL;
  const navigate = useNavigate();

  const { id, username } = useSelector((state) => state.authenticationUser);
  const [chatHistory, setChatHistory] = useState([]);
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
      onOpen: () => console.log("Websocket connection is opened"),
      onClose: () => {
        console.log("Websocket connection is closed");
        setChatHistory([]);
      },
      shouldReconnect: (closeEvent) => true,
    }
  );

  useEffect(() => {
    if (lastMessage?.data) {
      const messageData = JSON.parse(lastMessage.data);

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
          // Navigate to the audio call route if the current user initiated the call
          navigate(`/one-to-one-audio/${roomId}/`);
        } else {
          // Show audio call alert if the call was initiated by someone else
          setAudioCallAlert(true);
        }
      } else {
        // Handle other message types
        setChatHistory((prev) => prev.concat(messageData));
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

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
        className="h-screen bg-[#1f1e1f] flex ml-auto max-w-[76rem] flex-col overflow-y-scroll"
        ref={chatContainerRef}
      >
        <div>
          <div className="flex-1 px-4 py-2 mt-24 mb-28 max-h-full ">
            {chatHistory.length === 0 && (
              <div className="text-white">No messages yet...</div>
            )}
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 mr-4 flex ${
                  msg.sender === id ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-sm">
                  <div className="text-white font-medium">{msg.username}</div>
                  <div className="bg-gray-800 text-white rounded-lg p-2 shadow mb-2 text-lg">
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
                    ) : msg.message.match(/\.(docx|pdf|txt|xlsx|xls)$/) ? (
                      <div className="flex items-center">
                        <InsertDriveFileIcon className="mr-2" />
                        <a
                          href={msg.message}
                          download
                          className="text-blue-500 underline"
                        >
                          {msg.message.split("/").pop()}
                        </a>
                      </div>
                    ) : (
                      msg.message
                    )}
                  </div>
                </div>
              </div>
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
      </div>
      <OneToOneChatTextEditor
        sendMessage={sendMessage}
        readyState={readyState}
      />
    </>
  );
}
