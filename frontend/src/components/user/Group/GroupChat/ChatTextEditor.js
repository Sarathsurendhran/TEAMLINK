import React, { useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import PhotoIcon from "@mui/icons-material/Photo";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { toast } from "react-toastify";
import { Paperclip } from "lucide-react";

const ChatTextEditor = ({ connection }) => {
  const groupId = useSelector((state) => state.group.groupId);
  const { id, username } = useSelector((state) => state.authenticationUser);
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState(null);

  console.log(file);

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

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return; // Handle empty selection (optional)
    }

    setIsLoading(true);

    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "TeamLink");
    formData.append("cloud_name", "daymlb11q");
    formData.append("folder", "TeamLink");
    formData.append("use_filename", "true");
    formData.append("unique_filename", "false");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/daymlb11q/auto/upload",
        {
          method: "post",
          body: formData,
        }
      );
      const newurl = response.url;
      console.log("newurl", newurl);
      const data = await response.json();
      setIsLoading(false);

      // if the image is uploaded successfully then send the message
      if (data.public_id) {
        const sender = id;
        const currentTime = new Date();
        const time = format(currentTime, "yyyy-MM-dd HH:mm:ss");

        const messageData = {
          message: data.secure_url, // Use secure URL from Cloudinary response
          type: "photo",
          sender: sender,
          username: username,
          time: time,
        };

        // Send the message via WebSocket
        if (connection && connection.readyState === connection.OPEN) {
          connection.send(JSON.stringify(messageData));
        } else {
          console.error("WebSocket is not open");
          // Handle the case when WebSocket is not open (e.g., show an error message)
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-4 ml-auto max-w-[74rem] w-ful mt-4 ">
      <form
        onSubmit={sendMessage}
        className="flex items-center p-4 bg-[#323232] rounded-md shadow-md"
      >
        <label htmlFor="icon-button-file" className="cursor-pointer">
          <input
            id="icon-button-file"
            type="file"
            // accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <AttachFileIcon className="text-white" style={{ fontSize: 30 }} />
        </label>

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
