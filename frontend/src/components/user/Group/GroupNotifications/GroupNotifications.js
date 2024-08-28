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
import Box from "@mui/material/Box";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";

import { formatDistanceToNow, parseISO } from "date-fns";

export default function GroupNotifications() {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = useState(0);


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
      onOpen: () =>
        console.log("Websocket connection is opened (Notification)"),
      onClose: () => {
        console.log("Websocket connection is closed(Notification)");
        setNotifications([]);
      },
      shouldReconnect: () => true,
    }
  );

    // WebSocket for personal chat notifications
    const { lastMessage: lastPersonalMessage, readyState: personalReadyState } = useWebSocket(
      `${webSocketURL}ws/personal-notification/${id}/`,
      {
        onOpen: () => console.log("Personal chat notification WebSocket opened"),
        onClose: () => {
          console.log("Personal chat notification WebSocket closed");
          setNotifications([]);
        },
        shouldReconnect: () => true,
      }
    );



  useEffect(() => {
    if (lastMessage?.data) {
      const notifications = JSON.parse(lastMessage.data);
      if (notifications.unread_count !== undefined) {
        setUnreadCount(notifications.unread_count);
      }
      setNotifications((prev) => [notifications, ...prev]);
    }
  }, [lastMessage]);

  const formatTime = (time) => {
    return formatDistanceToNow(parseISO(time), { addSuffix: true }).replace(
      "about ",
      ""
    );
  };


  return (
    <React.Fragment>
      <button
        type="button"
        className="w-full text-start flex justify-between items-center py-2 px-1.5 text-sm text-white rounded-lg hover:bg-gray-500"
        onClick={handleClickOpen("paper")}
      >
        <div className="flex items-center">
          <NotificationsNoneOutlinedIcon
            sx={{ color: "white", fontSize: 28, mr: 1 }}
          />
          <span>Notifications</span>
        </div>

        {unreadCount > 0 ? (
          <span className="bg-red-600 text-white text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        ) : (
          <span className="bg-red-600 text-white text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full">
            0
          </span>
        )}
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="notification-dialog-title"
        aria-describedby="notification-dialog-description"
        PaperProps={{
          style: {
            minWidth: "22rem",
            minHeight: "22rem",
            maxHeight: "22rem",
            color: "white",
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
                  className="bg-gray-800 mb-2 cursor-pointer shadow-md hover:bg-gray-700 p-4"
                >
                  <div>
                    {/* Group name aligned to the left */}

                    <h4 className="text-white text-xl mb-2 font-bold">
                      {notification.group_name}
                    </h4>

                    {/* Notification details stacked vertically */}
                    <div className="flex flex-col">
                      {/* Check if the message exists and show the sender's name with a formatted message */}
                      {notification.message && (
                        <h4 className="text-white text-base mb-1">
                          {notification.sender_name} sends a message
                        </h4>
                      )}

                      {/* Conditionally display the time if it exists */}
                      {notification.time && (
                        <h4 className="text-slate-400 text-xs">
                          {formatTime(notification.time)}
                        </h4>
                      )}
                    </div>
                  </div>
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
