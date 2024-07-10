
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const WorkspaceIsblocked = ({children}) => {
  const baseURL = process.env.REACT_APP_baseURL;
  const navigate = useNavigate();
  const workspaceID = useSelector((state) => state.workspace.workspaceId);

  useEffect(() => {
    const CheckWorkspaceisBlocked = async () => {
      if (!workspaceID) return;
      try {
        const response = await axios.get(`${baseURL}workspace/check-isblocked/${workspaceID}`)
        if (response.status === 200) {
          console.log("called");
          navigate("/workspaces")
          
        }else{
          console.log("workspace is active");
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    CheckWorkspaceisBlocked();
  }, [workspaceID, baseURL]);

  return children
}

export default WorkspaceIsblocked