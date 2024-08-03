import React, { useState, useEffect, useRef } from "react";
import ChatTextEditor from "./ChatTextEditor";
import { useSelector } from "react-redux";
import { w3cwebsocket } from "websocket";

const Chat = () => {
  const groupId = useSelector((state) => state.group.groupId);
  const webSocketURL = process.env.REACT_APP_webSocketURL;
  const [chatMessages, setChatMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const chatContainerRef = useRef(null);
  const { id, username } = useSelector((state) => state.authenticationUser);

  useEffect(() => {
    if (groupId) {
      setChatMessages([]);
      connectToWebSocket();
    }
    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, [groupId]);

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

        console.log("Received data:", data);

        if (data.username && data.message) {
          setChatMessages((prevMessages) => [...prevMessages, data]);
          scrollToBottom();
        } else {
          console.error("Invalid message format:", data);
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    newConnection.onclose = () => {
      console.log("WebSocket client disconnected, attempting to reconnect...");
      setTimeout(connectToWebSocket, 2000); // Reconnect after 2 seconds
    };

    newConnection.onerror = (error) => {
      console.error("WebSocket error:", error);
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
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ChatTextEditor connection={connection} />
    </>
  );
};

export default Chat;
