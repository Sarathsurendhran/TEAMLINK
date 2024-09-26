import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";

import axios from "axios";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";

export default function AssignTaskModal() {
  const [open, setOpen] = React.useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState({ id: null, username: "" });
  const [userSearch, setUserSearch] = useState("");
  const [members, setMembers] = useState([]);

  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");

  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const groupID = useSelector((state) => state.group.groupId);
  const authenticatedUser = useSelector((state) => state.authenticationUser.id);
  const workspaceAdmin = useSelector((state) => state.workspace.workspaceAdmin);

  const filteredUsers = members.filter((user) =>
    user.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const fetechUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.get(`${baseURL}group/members-list`, {
        config,
        params: { groupID: groupID, workspaceID: workspaceID },
      });
      if (response.status === 200) {
        setMembers(response.data);
      }
    } catch (error) {
      console.log("error fetching data");
    }
  };

  useEffect(()=>{
    fetechUsers();
  },[groupID, workspaceID])

  const handleSubmit = () => {
    if (!taskName || !taskDesc || !startDate || !endDate || !selectedUser) {
      toast.error("Please fill all the fields");
      return;
    } else {
      submitTask();
    }

    // Further submit logic...
    handleClose();
  };

  const submitTask = async () => {
    const taskData = {
      task_name: taskName,
      task_description: taskDesc,
      start_date: startDate,
      end_date: endDate,
      workspace: workspaceID,
      group: groupID,
      assigned_to: selectedUser.id,
      assigned_by: authenticatedUser,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseURL}group/assign-task`,
        taskData,
        config
      );
      if (response.status === 201) {
        toast.success("Task created sucessfully");
      }
    } catch (error) {
      if (error.response) {
        console.log("Response Error:", error.response.data);
        toast.error(
          `Error: ${error.response.data.detail} || Something Went Wrong`
        );
      } else if (error.request) {
        console.log("Request error", error.request);
        toast.error("No response received from the server");
      } else {
        console.log("Error", error.message);
        toast.error("Error in sending the request");
      }
    }
  };

  return (
    <div>
      <button
        className={`bg-green-500 p-1 rounded text-white ${
          members.length <= 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={members.length > 1 ? handleOpen : null}
        disabled={members.length <= 1}
      >
        Assign Tasks
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-[#323232]  shadow-lg p-6 rounded-lg">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center font-bold text-lg text-white"
          >
            Assign Task
          </Typography>
          <div className="mt-4">
            <div className="mb-4">
              <label className="block text-white">Task Name</label>
              <input
                type="text"
                className="w-full border border-white p-2 rounded bg-[#323232] text-white"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Task Description</label>
              <textarea
                className="w-full border border-white p-2 rounded bg-[#323232] text-white"
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-between gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-white">Start Date</label>
                <input
                  type="date"
                  className="w-full border border-white p-2 rounded bg-[#323232] text-white cursor-pointer"
                  value={startDate}
                  min={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-white">End Date</label>
                <input
                  type="date"
                  className="w-full border border-white p-2 rounded bg-[#323232] text-white cursor-pointer"
                  value={endDate}
                  min={startDate || dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-white">Assign to User</label>
              <input
                type="text"
                placeholder="Search for user"
                className="w-full border border-white p-2 rounded bg-[#323232] text-white"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <div className="mt-2 text-white">
                {filteredUsers.length > 1 ? (
                  <ul className="border border-white rounded p-2 h-24 overflow-auto">
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        className={`p-1 hover:bg-gray-300 hover:text-black cursor-pointer ${
                          selectedUser.username === user.username
                            ? "bg-gray-300 text-black"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedUser({
                            id: user.user_id,
                            username: user.username,
                          })
                        }
                      >
                        {user.user_id !== workspaceAdmin && (
                          <li>{user.username}</li>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-red-500 text-center p-2">
                    No users found
                  </div>
                )}
              </div>
              {selectedUser && (
                <div className="mt-2 text-sm text-green-400">
                  Selected User: {selectedUser.username}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleClose}
              className="text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded"
            >
              Assign Task
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
