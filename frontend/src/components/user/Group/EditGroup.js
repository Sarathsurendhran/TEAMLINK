import React, { useState, useEffect } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import GroupMembers from "./GroupMembers";

const EditGroup = () => {
  const [groupData, setGroupData] = useState();
  const [groupMembers, setGroupMembers] = useState([]);
  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const groupId = useSelector((state) => state.group.groupId);

  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [isTopicEditing, setIsTopicEditing] = useState(false);

  const [currentGroupName, setCurrentGroupName] = useState();
  const [description, setDescription] = useState();
  const [topic, setTopic] = useState();
  const [currentGroupCreatorName, setCurrentGroupCreatorName] = useState();
  const [currentGroupCreatedOn, setCurrentGroupCreatedOn] = useState();

  // fetching current group details and members of the current groups
  useEffect(() => {
    fetchGroupsData();
  }, [groupId]);

  const fetchGroupsData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        groupId: groupId,
      },
    };
    try {
      const response = await axios.get(
        `${baseURL}group/get-group-details/`,
        config
      );
      if (response.status === 200) {
        setGroupData(response.data.group);
        setGroupMembers(response.data.members);

        setCurrentGroupName(response.data.group.group_name);
        setDescription(response.data.group.description);
        setTopic(response.data.group.topic);
        setCurrentGroupCreatorName(response.data.group_creator)

        const createdDate = new Date(
          response.data.group.created_on
        ).toLocaleDateString();
        setCurrentGroupCreatedOn(createdDate);

        console.log("success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameEdit = () => {
    setIsNameEditing(!isNameEditing);
  };

  const handleDescriptionEdit = () => {
    setIsDescriptionEditing(!isDescriptionEditing);
  };

  const handleTopicEdit = () => {
    setIsTopicEditing(!isTopicEditing);
  };

  const handleGroupNameChange = (e) => {
    setCurrentGroupName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  // Change Group Name
  const changeGroupName = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        groupId: groupId,
      },
    };
    const data = {
      group_name: currentGroupName,
    };
    try {
      const response = await axios.put(
        `${baseURL}group/update-group-name/`,
        data,
        config,
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchGroupsData();
      }
    } catch (error) {
      console.log(error);
    }
    setIsNameEditing(false);
  };

  // change group description
  const changeGroupDescription = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        groupId: groupId,
      },
    };
    const data = {
      group_description: description,
    };
    try {
      const response = await axios.put(
        `${baseURL}group/update-group-description/`,
        data,
        config,
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchGroupsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsDescriptionEditing(false);
  };

  // change group topic
  const changeGroupTopic = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        groupId: groupId,
      },
    };
    const data = {
      group_topic: topic,
    };
    try {
      const response = await axios.put(
        `${baseURL}group/update-group-topic/`,
        data,
        config,
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchGroupsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsTopicEditing(false);
  };

  return (
    <>
      <div className="mt-3 max-w-lg mx-auto text-gray-300">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1" htmlFor="groupName">
            <span className="text-lg mb-3">Group Name</span>
            <button className="ml-2 text-base" onClick={handleNameEdit}>
              {isNameEditing ? (
                <button
                  className="text-base bg-blue-700 p-2 rounded"
                  onClick={changeGroupName}
                >
                  Submit
                </button>
              ) : (
                <EditNoteIcon />
              )}
            </button>
          </label>
          <hr className="mb-3" />
          {isNameEditing ? (
            <input
              type="text"
              id="groupName"
              value={currentGroupName}
              onChange={handleGroupNameChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <span className="text-lg">{currentGroupName}</span>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-bold mb-1" htmlFor="description">
            <span className="text-lg">Group Description</span>
            <button className="ml-2 text-base" onClick={handleDescriptionEdit}>
              {isDescriptionEditing ? (
                <button
                  className="text-base bg-blue-700 p-2 rounded"
                  onClick={changeGroupDescription}
                >
                  Submit
                </button>
              ) : (
                <EditNoteIcon />
              )}
            </button>
          </label>
          <hr className="mb-3" />
          {isDescriptionEditing ? (
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="shadow appearance-none border rounded w-full py-5 px-3 bg-gray-200 text-black leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <span>{description}</span>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-bold mb-1" htmlFor="topic">
            <span className="text-lg">Topic</span>
            <button className="ml-2 text-base" onClick={handleTopicEdit}>
              {isTopicEditing ? (
                <button
                  className="text-base bg-blue-700 p-2 rounded"
                  onClick={changeGroupTopic}
                >
                  Submit
                </button>
              ) : (
                <EditNoteIcon />
              )}
            </button>
          </label>
          <hr className="mb-3" />
          {isTopicEditing ? (
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={handleTopicChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <span>{topic}</span>
          )}
        </div>

        <div className="mb-2">
          <label
            className="block text-lg font-bold mb-1 text-gray-100"
            htmlFor="createdBy"
          >
            Created By
          </label>
          <hr className="mb-3" />
          <span className="mb-2 mt-2">{currentGroupCreatorName}</span>
        </div>

        <div className="mb-2">
          <label className="block text-lg font-bold mb-2" htmlFor="createdOn">
            Created On
          </label>
          <hr className="mb-3" />
          <span className="mb-2 mt-2">{currentGroupCreatedOn}</span>
        </div>
      </div>
    </>
  );
};

export default EditGroup;
