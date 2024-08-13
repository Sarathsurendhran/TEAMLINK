import React, { useState, useEffect, useRef } from "react";
import ChatTextEditor from "./ChatTextEditor";
import { useSelector, useDispatch } from "react-redux";
import { w3cwebsocket } from "websocket";
import { setGroupId, setGroupName } from "../../../Redux/Groups/GroupSlice";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import VideoCallAlert from "../Group/GroupCall/GroupVideoCallAlert";
import AudioCallAlert from "../Group/GroupCall/GroupAudioCallAlert";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import useSound from 'use-sound';


const Chat = () => {
  const baseURL = process.env.REACT_APP_baseURL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groupId = useSelector((state) => state.group.groupId);
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const webSocketURL = process.env.REACT_APP_webSocketURL;
  const [chatMessages, setChatMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const chatContainerRef = useRef(null);
  const { id, username } = useSelector((state) => state.authenticationUser);

  const [videoCallAlert, setVideoCallAlert] = useState(false);
  const [audioCallAlert, setAudioCallAlert] = useState(false);

  const location = useLocation();
  const { startVideoCall } = location.state || {};

  const { startAudioCall } = location.state || {};


  //.............. fetechig the general group...........

  const fetchGroupData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}group/group-detail/${workspaceID}/`
      );
      // Handle the response data
      // console.log(response.data);

      dispatch(setGroupId(response.data.id));
      dispatch(setGroupName(response.data.group_name));
    } catch (error) {
      // Handle errors
      console.error("Error fetching group data:", error);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [workspaceID]);

  useEffect(() => {
    // Clean up the previous WebSocket connection
    if (connection) {
      connection.close();
      setConnection(null);
    }

    // Clear messages when workspace changes
    setChatMessages([]);
    if (groupId) {
      connectToWebSocket();
    }
    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, [groupId, workspaceID]);

  // WebSocket connection
  const connectToWebSocket = () => {
    const newConnection = new w3cwebsocket(
      `${webSocketURL}ws/group-chat/${groupId}/`
    );
    setConnection(newConnection);
    newConnection.onopen = () => {
      console.log("WebSocket client connected");
    };
    newConnection.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);

        // console.log("Received data:", data);

        if (data.type === "video_call") {
          if (data.sender === id) {
            navigate(`/group-video/${groupId}/`);
          } else {
            setVideoCallAlert(true);
          }
        } else if (data.type === "audio_call") {
          if (data.sender === id) {
            navigate(`/audio-call/${groupId}/`);
          } else {
            setAudioCallAlert(true);
          }
        } else {
          setChatMessages((prevMessages) => [...prevMessages, data]);
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    newConnection.onclose = () => {
      console.log("WebSocket connection closed, attempting to reconnect...");
    };

    newConnection.onerror = (error) => {
      console.error("WebSocket error:", error);
      newConnection.close();
    };

    return () => {
      newConnection.close();
    };
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  //************************************* call ************************************/

  const videoCall = () => {
    const message = {
      message: "started video call",
      type: "video_call",
      sender: id,
      username: username,
    };

    if (connection && connection.readyState === connection.OPEN) {
      connection.send(JSON.stringify(message));
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
    if (connection && connection.readyState === connection.OPEN) {
      connection.send(JSON.stringify(message));
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
            {chatMessages.length === 0 && (
              <div className="text-white">No messages yet...</div>
            )}
            {chatMessages.map((msg, index) => (
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
                    ) : msg.message.match(/\.(docx|pdf|txt|xlsx|xls)$/) ? (
                      <div className="flex items-center">
                        <span className="material-icons mr-2">
                          <InsertDriveFileIcon />
                        </span>
                        <a
                          href={msg.message}
                          download
                          className="text-blue-500 underline"
                        >
                          {msg.message.split("/").pop()}{" "}
                          {/* Display file name */}
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
      </div>
      <ChatTextEditor connection={connection} />
    </>
  );
};

export default Chat;
