import React from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const updateUserToken = async () => {
  const refreshToken = localStorage.getItem("refresh");
  const baseURL = process.env.REACT_APP_baseURL;

  try {
    const res = await axios.post(`${baseURL}user/token/refresh`, {
      refresh: refreshToken,
    });
    if (res.status === 200) {
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      let decoded = jwtDecode(res.data.access);
      return {
        username: decoded.username,
        id: decoded.user_id,
        isAuthenticated: true,
        isAdmin: decoded.isAdmin,
      };
    } else {
      return {
        username: null,
        id: null,
        isAuthenticated: false,
        isAdmin: null,
      };
    }
  } catch (error) {
    return { username: null, id: null, isAuthenticated: false, isAdmin: null };
  }
};

const isAuthUser = async () => {
  const accessToken = localStorage.getItem("access");

  if (!accessToken) {
    return { username: null, id: null, isAuthenticated: false, isAdmin: null };
  }

  const currentTime = Date.now() / 1000;

  let decoded_token = jwtDecode(accessToken);

  if (decoded_token.exp > currentTime) {
    return {
      id: decoded_token.user_id,
      username: decoded_token.username,
      isAuthenticated: true,
      isAdmin: decoded_token.isAdmin,
    };
  } else {
    const updateSuccess = await updateUserToken();
    return updateSuccess;
  }
};

export default isAuthUser;
