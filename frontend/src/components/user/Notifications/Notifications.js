import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [notifications, setNotifications] = useState([]);
  const [unreadCountForGroup, setUnreadCountForGroup] = useState(0);
  const [unreadCountForPersonal, setUnreadCountForPersonal] = useState(0);


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

  // WebSocket for group notifications
  const { lastMessage: lastGroupMessage, readyState: groupReadyState } =
    useWebSocket(`${webSocketURL}ws/group-notification/${id}/${workspaceID}/`, {
      onOpen: () => console.log("Group notification WebSocket opened"),
      onClose: () => {
        console.log("Group notification WebSocket closed");
        setNotifications([]);
      },
      shouldReconnect: (closeEvent) => true,
    });

  // WebSocket for personal chat notifications
  const { lastMessage: lastPersonalMessage, readyState: personalReadyState } =
    useWebSocket(`${webSocketURL}ws/personal-notification/${id}/`, {
      onOpen: () => console.log("Personal chat notification WebSocket opened"),
      onClose: () => {
        console.log("Personal chat notification WebSocket closed");
        setNotifications([]);
      },
      shouldReconnect: (closeEvent) => true,
    });

  useEffect(() => {
    // Handle group notifications
    if (lastGroupMessage?.data) {
      const notification = lastGroupMessage?.data ? JSON.parse(lastGroupMessage.data) : null;

      if (notification.unread_count !== undefined) {
        if (notification.unread_count === 0) {
          // Set the unread count to zero
          setUnreadCountForGroup(0);
        } else {
          // Add the unread count to the previous count
          setUnreadCountForGroup(
            (prevCount) => prevCount + notification.unread_count
          );
        }
      }

      setNotifications((prev) => [{ ...notification, type: "group" }, ...prev]);
    }

  }, [lastGroupMessage]);


  useEffect(() => {
    // Handle personal chat notifications
    if (lastPersonalMessage?.data) {
      const notification = JSON.parse(lastPersonalMessage.data);

      if (notification.unread_count !== undefined) {
        if (notification.unread_count === 0) {
          // Set the unread count to zero
          setUnreadCountForPersonal(0);
        } else {
          // Add the unread count to the previous count
          setUnreadCountForPersonal(
            (prevCount) => prevCount + notification.unread_count
          );
        }
      }

      setNotifications((prev) => [
        { ...notification, type: "personal" },
        ...prev,
      ]);
    }
  }, [lastPersonalMessage]);




  // Reset state when workspaceID changes
  useEffect(() => {
    setNotifications([]);
    setUnreadCountForGroup(0);
    setUnreadCountForPersonal(0);
  }, [workspaceID]);

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

        {unreadCountForGroup + unreadCountForPersonal > 0 ? (
          <span className="bg-red-600 text-white text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full">
            {unreadCountForGroup + unreadCountForPersonal}
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
           
              {notifications.map((notification, index) => (
                <ListItem
                  key={index}
                  className="bg-gray-800 mb-2 cursor-pointer shadow-md hover:bg-gray-700 p-4"
                >
                  <div>
                    {notification.type === "group" ? (
                      <>
                        <h4 className="text-white text-xl mb-2 font-bold">
                          {notification.group_name}
                        </h4>
                        <div className="flex flex-col">
                          {notification.message && (
                            <h4 className="text-white text-base mb-1">
                              {notification.sender_name} sends a message
                            </h4>
                          )}
                          {notification.time && (
                            <h4 className="text-slate-400 text-xs">
                              {formatTime(notification.time)}
                            </h4>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col">
                          {notification.message && (
                            <h4 className="text-white text-base mb-1">
                              {notification.sender_name} sends a message
                            </h4>
                          )}
                          {notification.time && (
                            <h4 className="text-slate-400 text-xs">
                              {formatTime(notification.time)}
                            </h4>
                          )}
                        </div>
                      </>
                    )}
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
      </Dialog>
    </React.Fragment>
  );
}
