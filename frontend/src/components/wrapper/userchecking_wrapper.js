import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UserCheckingWrapper = ({ children }) => {
  const [joinParam, setJoinParam] = useState("");
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_baseURL;

  useEffect(() => {
    const shouldExecute = async (joinValue) => {
      try {
        const response = await axios.post(
          `${baseURL}user/user-checking/${joinValue}`
        );

        if (response.status === 208) {
          toast.info(response.data.message);
          navigate("/login");
        } else if (response.status === 404) {
          navigate("/register");
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);
    const joinValue = params.get("join");

    if (!joinValue) {
      navigate("/register");
    } else {
      setJoinParam(joinValue);
      shouldExecute(joinValue);
    }
  }, [navigate, baseURL]);

  return children;
};

export default UserCheckingWrapper;
