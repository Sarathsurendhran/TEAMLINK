import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import { ReadyState } from "react-use-websocket";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import OneToOneChatTextEditor from "./OneToOneChatTextEditor";

export default function OneToOneChat() {
  const baseURL = process.env.REACT_APP_baseURL;
  const webSocketURL = process.env.REACT_APP_webSocketURL;
  const { id, username } = useSelector((state) => state.authenticationUser);
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const selectedUser = useSelector((state) => state.selectedUser);
  const selectedUserName = useSelector((state) => state.selectedUser.selectedUserName);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${webSocketURL}one-to-one-chat/${id}/`,
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
      setChatHistory((prev) => [JSON.parse(lastMessage.data)].concat(prev));
    }
  }, [lastMessage]);

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
      </div>
      <OneToOneChatTextEditor
        connection={sendMessage}
        readyState={readyState}
      />
    </>
  );
}
