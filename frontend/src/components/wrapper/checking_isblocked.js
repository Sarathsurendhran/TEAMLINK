import axios from "axios";
import React, { useEffect , useState} from "react";
import { useSelector } from "react-redux";
import Loader from "../loader/loader";
import { useNavigate } from "react-router-dom";

const CheckingIsBlocked = ({ children }) => {
  const baseURL = process.env.REACT_APP_baseURL;
  const authenticated_user = useSelector((state) => state.authenticationUser);
  const authenticated_user_id = authenticated_user
    ? authenticated_user.id
    : null;

  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const CheckisBlocked = async () => {
      if (!authenticated_user_id) return;
      try {
        const response = await axios.get(`${baseURL}user/check-isblocked/`, {
          params: { user_id: authenticated_user_id },
        })
        if (response.status === 200) {
          console.log("called");
          localStorage.clear();
          setLoading(false)
          navigate("/login")
          
        }else{
          console.log("user is active");
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    CheckisBlocked();
  }, [authenticated_user_id, baseURL]);


  return children;
};

export default CheckingIsBlocked;
