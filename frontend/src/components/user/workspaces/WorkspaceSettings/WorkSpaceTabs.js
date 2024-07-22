import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setWorkspaceId,
  setWorkspaceName,
} from "../../../../Redux/WorkspaceID/workspaceSlice";
import axios from "axios";
import { toast } from "react-toastify";

import "./WorkSpaceTabStyle.css";

import ConfirmMessageModal from "../../../ConfirmMessageModals/RemoveUser";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

/// ........................................Main Component................................
export default function WorkSpaceTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState([]);
  const [currentWorkspaceCreaterName, setCurrentWorkspceCreaterName] = useState()
  const [user, setUser] = useState(null);
  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workspaceID = useSelector((state) => state.workspace.workspaceId);

  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  // Fetching Workspaces.....................
  useEffect(() => {
    fetechWorkspace();
  }, [workspaceID]);

  const fetechWorkspace = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const res = await axios.get(
        `${baseURL}workspace/list-workspaces/`,
        config
      );

      setWorkspaces(res.data.workspaces);
      setUser(res.data.user.email);
    } catch (error) {
      console.log(error);
    }
  };

  // feteching all the data of the current workspace and user
  const [menuItems, setMenuItems] = useState([]);
  const [isWorkspaceAdmin, setIsWorkspaceAdmin] = useState(false);

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error)
    }
  }, [workspaceID]);

  const fetchData = async () => {
    const accessToken = localStorage.getItem("access");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.get(
        `${baseURL}workspace/workspace-home/${workspaceID}/`,
        config
      );
      if (res.status === 200) {
        // toast.success(res.data.message);
        setIsWorkspaceAdmin(res.data.members_data.is_admin);

        setCurrentWorkspace(res.data.workspace_data);
        setCurrentWorkspaceName(res.data.workspace_data.workspace_name);
        setDescription(res.data.workspace_data.description);
        setCurrentWorkspceCreaterName(res.data.user_name)

        const members_data = res.data.members_data;
        const members = Array.isArray(members_data) ? members_data : [];
        setMenuItems(members);
      }
    } catch (error) {
      console.error("Error launching workspace:", error);
    }
  };

  const handleLaunch = (id, name) => {
    dispatch(setWorkspaceId(id));
    dispatch(setWorkspaceName(name));
    navigate(`/workspacehome`);
  };

  const filteredWorkspaces = workspaces.filter(
    (workspace) => workspace.id !== workspaceID
  );

  //remove member
  const removeMember = async (user_id) => {
    const accessToken = localStorage.getItem("access");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const res = await axios.post(
        `${baseURL}workspace/remove-user/`,
        { user_id, workspaceID },
        config
      );
      if (res.status === 200) {
        fetchData();
        toast.success(res.data.message);
      }
    } catch (error) {
      fetchData();
      console.error("Error removing user:", error);
    }
  };

  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [currentWorkspaceName, setCurrentWorkspaceName] = useState();
  const [description, setDescription] = useState();

  const handleDescriptionEdit = () => {
    setIsDescriptionEditing(!isDescriptionEditing);
  };

  const handleNameEdit = () => {
    setIsNameEditing(!isNameEditing);
  };

  const handleWorkspaceNameChange = (e) => {
    setCurrentWorkspaceName(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const changeWorkspaceName = async () => {
    const data = {
      workspace_name: currentWorkspaceName,
      workspace_id: workspaceID,
    };
    try {
      const res = await axios.put(
        `${baseURL}workspace/update-workspace-name/`,
        data,
        config
      );
      if (res.status === 200) {
        toast.success("Workspace Name Updated Sucessfully");
        fetchData();
        fetechWorkspace()
        dispatch(setWorkspaceName(currentWorkspaceName));
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Error: " + JSON.stringify(error.response.data));
      } else {
        console.error("An unexpected error occurred", error);
      }
    }
  };

  const ChangeWorksapceDescription = async () => {
    const data = {
      workspace_description: description,
      workspace_id: workspaceID,
    };
    try {
      const response = await axios.put(
        `${baseURL}workspace/update-workspace-description/`,
        data,
        config
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchData()
        fetechWorkspace()
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(JSON.stringify(error.response.data));
      } else {
        console.error("An unexpected error occurred", error);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "#323232", width: 550 }}>
      <AppBar position="static" sx={{ bgcolor: "#323232" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="About" {...a11yProps(0)} />
          <Tab label="Workspaces" {...a11yProps(1)} />
          <Tab label="Users" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel
          className="text-white"
          value={value}
          index={0}
          dir={theme.direction}
        >
          <div className="mt-3 max-w-lg mx-auto text-gray-300">
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-1"
                htmlFor="workspaceName"
              >
                <span className="text-lg mb-3">Workspace Name</span>
                <button className="ml-2 text-base" onClick={handleNameEdit}>
                  {isNameEditing ? (
                    <button
                      className="text-base bg-blue-700 p-2 rounded"
                      onClick={changeWorkspaceName}
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
                  id="workspaceName"
                  value={currentWorkspaceName}
                  onChange={handleWorkspaceNameChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200  leading-tight focus:outline-none focus:shadow-outline"
                />
              ) : (
                <span className="text-lg ">
                  {currentWorkspaceName}
                </span>
              )}
            </div>
            <div className="mb-3">
              <label
                className="block text-sm font-bold mb-1"
                htmlFor="description"
              >
                <span className="text-lg">Description</span>

                <button
                  className="ml-2 text-base"
                  onClick={handleDescriptionEdit}
                >
                  {isDescriptionEditing ? (
                    <button
                      className="text-base bg-blue-700 p-2 rounded"
                      onClick={ChangeWorksapceDescription}
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
            <div className="mb-2">
              <label
                className="block text-lg font-bold mb-1  text-gray-100"
                htmlFor="createdBy"
              >
                Created By
              </label>
              <hr className="mb-3" />

              <span className="mb-2 mt-2">{currentWorkspaceCreaterName}</span>
            </div>
            <div className="mb-2">
              <label
                className="block text-lg font-bold mb-2"
                htmlFor="createdOn"
              >
                Created On
              </label>
              <hr className="mb-3" />
              <span className="mb-2 mt-2">{currentWorkspace.created_on}</span>
            </div>
          </div>
        </TabPanel>

        {/* Workspaces Tabpanel */}
        <TabPanel
          className="text-white"
          value={value}
          index={1}
          dir={theme.direction}
        >
          <div className="flex flex-col items-center max-h-96 w-full  max-w-xl overflow-y-auto custom-scrollbar">
            {filteredWorkspaces.length > 0 ? (
              filteredWorkspaces.map((workspace, index) => (
                <div
                  key={index}
                  className="w-full h-9 max-w-xl border mb-2 mt-2 rounded-sm transition cursor-pointer hover:-translate-y-1.5 text-center flex items-center justify-center  hover:bg-indigo-500"
                  onClick={() =>
                    handleLaunch(workspace.id, workspace.workspace_name)
                  }
                >
                  <h1 className="text-2xl font-bold font-sans text-white">
                    {workspace.workspace_name}
                  </h1>
                </div>
              ))
            ) : (
              <p>NO workspaces</p>
            )}
          </div>
        </TabPanel>

        {/* Users Tabpanel */}
        <TabPanel
          className="text-white"
          value={value}
          index={2}
          dir={theme.direction}
        >
          <ul className="">
            {menuItems.map((member, index) => (
              <li
                key={index}
                className="flex justify-between p-2 m-2 rounded-sm items-center border"
              >
                <div className="flex items-center space-x-2">
                  <span>{member.user.username}</span>
                  {member.is_admin && (
                    <span className="text-red-500 text-sm">admin</span>
                  )}
                  {member.user.id === authenticated_user_id && (
                    <span className="text-red-500 text-sm">(you)</span>
                  )}
                </div>
                {!member.is_admin &&
                  member.user.id !== authenticated_user_id &&
                  isWorkspaceAdmin && (
                    <ConfirmMessageModal
                      removeMember={() => removeMember(member.user.id)}
                    />
                  )}
              </li>
            ))}
          </ul>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
