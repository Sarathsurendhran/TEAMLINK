import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from '@mui/material/Box';

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";

export default function GroupNotifications() {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const [notifications, setNotifications] = React.useState([]);

  // const [notifications, setNotifications] = React.useState([
  //   { id: 1, message: "You have a new message from John" },
  //   { id: 2, message: "Your file upload is complete" },
  //   { id: 3, message: "Team meeting at 3 PM today" },
  // ]);


  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const webSocketURL = process.env.REACT_APP_webSocketURL;
  const { id, username } = useSelector((state) => state.authenticationUser);
  const workspaceID = useSelector((state) => state.workspace.workspaceId);

  const { lastMessage, readyState } = useWebSocket(
    `${webSocketURL}ws/group-notification/${id}/${workspaceID}/`,
    {
      onOpen: () => console.log("Websocket connection is opened (Notification)"),
      onClose: () => {
        console.log("Websocket connection is closed(Notification)");
        setNotifications([])
      },
      shouldReconnect: (closeEvent) => true,
    }
  );

  useEffect(() => {
    if (lastMessage?.data) {
      const notifications = JSON.parse(lastMessage.data);
      setNotifications((prev) => [notifications, ...prev]);
    }
  }, [lastMessage]);
  

  return (
    <React.Fragment>
    <button
      type="button"
      className="w-full text-start flex items-center gap-x-2 py-2 px-1.5 text-sm text-white rounded-lg hover:bg-gray-500"
      onClick={handleClickOpen("paper")}
    >
      <NotificationsNoneOutlinedIcon sx={{ color: "white", fontSize: 28 }} />
      Notifications
    </button>
  
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={scroll}
      aria-labelledby="notification-dialog-title"
      aria-describedby="notification-dialog-description"
      PaperProps={{
        style: {
          minWidth: '22rem',
          minHeight: '22rem',
          maxHeight: '22rem',
          color: 'white',
        },
      }}


    >
       {/* <Box sx={{ minWidth: 350, minHeight: 350, bgcolor: 'gray.800' }}> */}
      <DialogTitle
        id="notification-dialog-title"
        className="bg-gray-800 text-white"
      >
        Notifications
      </DialogTitle>
      <DialogContent
        dividers={scroll === "paper"}
        className="bg-gray-800 text-white"
      >
        <DialogContentText
          id="notification-dialog-description"
          tabIndex={-1}
          className="text-white"
        >
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                className="bg-gray-800 mb-2 border border-gray-700 cursor-pointer shadow-md hover:bg-gray-700"
              >
                <ListItemText
                  primary={notification.message}
                  className="text-white"
                />
              </ListItem>
            ))}
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="bg-gray-800">
        <Button onClick={handleClose} className="text-white">
          Close
        </Button>
      </DialogActions>
      {/* </Box> */}
    </Dialog>
  </React.Fragment>
  
  );
}
