import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";

import { useSelector, useDispatch } from "react-redux";

// WebSocket imports
import { w3cwebsocket as W3CwebSocket } from "websocket";

const ChatTextEditor = () => {
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const webSocketURL = process.env.REACT_APP_webSocketURL;
  const groupId = useSelector((state) => state.group.groupId);

  useEffect(() => {
    if (groupId) {
      connectToWebsocket();
    }
  }, [groupId]);

  // websocket connection
  const connectToWebsocket = () => {
    const newConnection = new W3CwebSocket(
      `${webSocketURL}ws/group-chat/${groupId}/`
    );
    setConnection(newConnection);
    newConnection.onopen = () => {
      console.log("websocket client connected");
    };
    newConnection.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data);
    };
    return () => {
      newConnection.close();
    };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log(message);
      setMessage("");
    }
  };
  

  return (
    <div className="fixed bottom-4 left-0 right-4 ml-auto max-w-[74rem] w-ful mt-4">
      <form
        onSubmit={sendMessage}
        className="flex items-center p-4 bg-[#323232] rounded-md shadow-md"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 bg-[#323232] text-white rounded-md focus:outline-none focus:border-blue-500"
        />

        <button className="flex items-center bg-blue-600 text-white gap-1 px-4 py-2 cursor-pointer  font-semibold tracking-widest rounded-md hover:bg-blue-500 ">
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatTextEditor;
