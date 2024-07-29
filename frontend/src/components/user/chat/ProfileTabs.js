import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views-react-18-fix"
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import EditGroup from "../Group/EditGroup";
import GroupMembers from "../Group/GroupMembers";
import AddMembers from "../Group/AddMembers";

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
export default function ProfileTab() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
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
          <Tab label="Members" {...a11yProps(1)} />
          {/* <Tab label="Settings" {...a11yProps(2)} /> */}
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
          <EditGroup />
        </TabPanel>

        <TabPanel
          className="text-white"
          value={value}
          index={1}
          dir={theme.direction}
        >
          {/* <AddMembers/> */}
          <GroupMembers />
        </TabPanel>

        {/* <TabPanel
          className="text-white"
          value={value}
          index={2}
          dir={theme.direction}
        >
          Item Three
        </TabPanel> */}
      </SwipeableViews>
    </Box>
  );
}
