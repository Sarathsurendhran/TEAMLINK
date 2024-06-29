import React from "react";
import logo from "../../../assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Register = () => {
  const baseURL = process.env.REACT_APP_baseURL;
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const joinValue = queryParameters.get("join");

  // validating user input data
  const validate = (e) => {
    let username = e.target.username.value;
    let email = e.target.email.value;
    let password = e.target.password.value;

    if (username.length <= 3) {
      toast.warning("Username should have at least 4 characters");
      return false;
    }

    if (username.includes(" ")) {
      toast.warning("Username cannot contain blank spaces");
      return false;
    }

    const usernameRegex = /^[a-zA-Z][a-zA-Z\d]*$/;
    if (!usernameRegex.test(username)) {
      toast.warning(
        "Invalid Username Format, Username should only contain alphanumeric characters"
      );
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Invalid Email Format");
      return false;
    }

    // Password validation
    if (password.includes(" ")) {
      toast.warning("Password should not contain blank spaces");
      return false;
    }

    if (password.length < 8) {
      toast.warning("Password should contain at least 8 characters");
      return false;
    }
    return true;
  };

  // sending credentials to the backend
  const hadleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", e.target.username.value.trim());
    formData.append("email", e.target.email.value.trim());
    formData.append("password", e.target.password.value.trim());

    // Append join parameter only if it exists
    if (joinValue) {
      formData.append("workspace_id", joinValue);
    }

    if (validate(e)) {
      try {
        console.log(formData);
        const res = await axios.post(`${baseURL}user/register/`, formData);
        if (res.status === 201) {
          sessionStorage.setItem("registrationEmail", e.target.email.value);
          navigate("/otp", {
            state: res.data.message,
          });
          toast.success(res.data.message);
          return res;
        }
      } catch (error) {
        let errorMessage;

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // Check if message is an array
          if (Array.isArray(error.response.data.message)) {
            error.response.data.message.forEach((errorMessage) => {
              toast.error(errorMessage);
            });
          } else {
            // If message is not an array, treat it as a single string message
            toast.error(error.response.data.message);
          }
        } else {
          toast.error("An error occurred. Please try again later");
        }

        if (error.response.status === 406) {
          console.log(error.response.data);
          // Assuming message is a string in this case
          toast.error(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <>
      <div className="w-full h-screen text-gray-900 flex justify-center sm:px-10 lg:px-40 xl:px-80 ">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white sm:rounded-lg flex justify-center flex-1 ">
          <div className=" lg:w-20 xl:w-full p-2 ">
            <div className="-ml-10">
              <img src={logo} className="w-60 mx-auto" />
            </div>
            <div className="mt-6 flex flex-col items-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold">Sign up</h1>
              <div className="w-full flex-1 mt-6">
                <div className="flex flex-col items-center">
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
                    <span className="ml-4">Sign Up with Google</span>
                  </button>
                </div>
                <div className="my-8 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or sign up with e-mail
                  </div>
                </div>
                <form onSubmit={hadleSubmit}>
                  <div className="mx-auto max-w-sm">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      name="username"
                      placeholder="Name"
                    />

                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="email"
                      name="email"
                      placeholder="Email"
                    />

                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    <button
                      type="submit"
                      className="mt-5 tracking-wide font-semibold bg-[#7157FE] text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
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

                      <span className="ml-3">Continue</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
