import React, { useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const ChatTextEditor = ({ connection }) => {
  const groupId = useSelector((state) => state.group.groupId);
  const { id, username } = useSelector((state) => state.authenticationUser);
  const workspaceID = useSelector((state)=>state.workspace.workspaceId)
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!connection || connection.readyState !== connection.OPEN) {
      console.log("Websocket is not open");
      return;
    }
    const currentTime = new Date();
    const time = format(currentTime, "yyyy-MM-dd HH:mm:ss");

    const messageData = {
      message,
      sender: id,
      username,
      time,
    };

    const messageString = JSON.stringify(messageData);
    connection.send(messageString);

    setMessage(""); // Clear the input after sending the message
    inputRef.current.focus(); // Refocus on the input field
  };
  const isButtonDisabled = !message.trim();

  return (
    <div className="fixed bottom-4 left-0 right-4 ml-auto max-w-[74rem] w-ful mt-4 ">
      <form
        onSubmit={sendMessage}
        className="flex items-center p-4 bg-[#323232] rounded-md shadow-md"
      >
        <input
          type="text"
          value={message} // Control the input value with state
          onChange={(e) => setMessage(e.target.value)}
          ref={inputRef}
          placeholder="Type your message..."
          className="flex-1 p-2 bg-[#323232] text-white rounded-md focus:outline-none focus:border-blue-500"
        />

        <button
          className={`flex items-center gap-1 px-4 py-2 cursor-pointer font-semibold tracking-widest rounded-md ${
            isButtonDisabled
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
          disabled={isButtonDisabled}
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatTextEditor;
