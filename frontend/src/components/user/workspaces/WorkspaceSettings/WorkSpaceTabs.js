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
    fetechWorkspace();
  }, [workspaceID]);

  // feteching all the data of the current workspace and user
  const [menuItems, setMenuItems] = useState([]);
  const [workspaceAdmin, setWorkspaceAdmin] = useState();
  useEffect(() => {
    try {
      fetchData();
    } catch (error) {}
  }, [workspaceID]);

  const fetchData = async () => {
    const accessToken = localStorage.getItem("access");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const res = await axios.get(
        `${baseURL}workspace/workspace-home/${workspaceID}/`,
        config
      );
      if (res.status === 200) {
        // toast.success(res.data.message);
        setWorkspaceAdmin(res.data.workspace_data.created_by);

        const members_data = res.data.members_data;
        const members = Array.isArray(members_data) ? members_data : [];
        setMenuItems(members);
      }
    } catch (error) {
      console.error("Error launching workspace:", error);
    }
  };

  const handleLaunch = async (id, name) => {
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
          Item One
        </TabPanel>

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
                  member.user.id !== authenticated_user_id && (
                    <button
                      className="text-white bg-red-500 hover:bg-red-700 p-1 rounded"
                      // onClick={() => removeMember(member.user.id)}
                    >
                      <ConfirmMessageModal
                        removeMember={() => removeMember(member.user.id)}
                      />
                    </button>
                  )}
              </li>
            ))}
          </ul>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
