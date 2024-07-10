import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setAuthentication } from "../../../Redux/Authentication/authenticationSlice";

const Login = () => {
  const baseURL = process.env.REACT_APP_baseURL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = (e) => {
    let email = e.target.email.value;
    let password = e.target.password.value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      toast.warning("Invalid Email Format");
      return false;
    }

    if (password.includes(" ")) {
      toast.warning("Passsword should not include blank space");
      return false;
    }

    if (password.length < 8) {
      toast.warning("Password should contain atleast 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (validate(e)) {
      const formData = new FormData();
      formData.append("email", e.target.email.value);
      formData.append("password", e.target.password.value);

      try {
        const res = await axios.post(`${baseURL}user/user-login/`, formData);
        if (res.status === 200) {
          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);

          // Decode the access token to get user details
          const decodedToken = jwtDecode(res.data.access);

          // Dispatch action to update Redux store
          dispatch(
            setAuthentication({
              id: decodedToken.user_id,
              username: decodedToken.username,
              isAuthenticated: true,
              isAdmin: decodedToken.isAdmin,
            })
          );

          // Check if the user is an admin and navigate accordingly
          if (decodedToken.isAdmin) {
            navigate("/admin");
          } else {
            // If the user is not an admin, check for workspaces
            if (res.data.workspaces) {
              navigate("/workspaces");
            } else {
              navigate("/createworkspace");
            }
          }

          toast.success("Login Success");
        }
      } catch (error) {
        console.log("error:", error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 406) {
            toast.error(data.message);
          } else if (status === 400) {
            handleValidationErrors(data);
          } else {
            toast.error(
              "An unexpected error occurred. Please try again later."
            );
          }
        } else {
          toast.error(
            "Network error. Please check your connection and try again."
          );
        }
      }
    }
  };

  const handleValidationErrors = (errors) => {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const errorMessages = errors[key];
        errorMessages.forEach((message) => toast.error(message));
      }
    }
    setErrors(errors);
  };

  return (
    <>
      <div className="w-full text-gray-900 flex justify-center sm:px-10 lg:px-40 xl:px-80">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-20 xl:w-full p-2 sm:p-12">
            <div className="-ml-10">
              <img src={logo} className="w-60 mx-auto" />
            </div>
            <div className="mt-2 flex flex-col items-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold">Sign In</h1>
              <div className="w-full flex-1 mt-6">
                {/* <div className="flex flex-col items-center">
                  <button className="w-full max-w-sm font-bold shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                    <div className="bg-white p-2 rounded-full">
                      <svg className="w-4" viewBox="0 0 533.5 544.3">
                        <path
                          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                          fill="#4285f4"
                        />
                        <path
                          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                          fill="#34a853"
                        />
                        <path
                          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                          fill="#fbbc04"
                        />
                        <path
                          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                          fill="#ea4335"
                        />
                      </svg>
                    </div>
                    <span className="ml-4">Sign In with Google</span>
                  </button>
                </div> */}
                {/* <div className="my-8 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or sign in with e-mail
                  </div>
                </div> */}
                <form onSubmit={handleSubmit}>
                  <div className="mx-auto max-w-sm">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      placeholder="Email"
                      name="email"
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      placeholder="Password"
                      name="password"
                    />

                    <button className="mt-5 tracking-wide font-semibold bg-[#7157FE] text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                      <svg
                        className="w-6 h-6 -ml-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="8.5" cy={7} r={4} />
                        <path d="M20 8v6M23 11h-6" />
                      </svg>
                      <span className="ml-3">Sign In With Email</span>
                    </button>
                  </div>
                </form>
              </div>
              <span className="ml-1 text-base mt-4">
                Don't have an account?{" "}
                <Link to="/register">
                  <b>Sign Up</b>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
