import React from "react";
import logo from "../../../assets/logo.png";
import worklife from "../../../assets/worklife.webp";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import WorkspaceHome from "./workspace_home";

const CreateWorkSpace = () => {
  const baseURL = process.env.REACT_APP_baseURL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let workspace_name = e.target.workspace_name.value;

    if (!workspace_name) {
      toast.warning("Workspace cannot be empty!");

      return false;
    }
    const formData = new FormData();
    formData.append("workspace_name", workspace_name);

    try {
      const access_token = localStorage.getItem("access");

      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      const res = await axios.post(
        `${baseURL}workspace/create-workspace/`,
        formData,
        config
      );
      if (res.status === 201) {
  
        navigate("workspacehome");
      }
    } catch (error) {
      console.log(error);
      toast.error("error");
    }
  };

  return (
    <>
      <div className="flex justify-center min-h-screen bg-white">
        <div className="bg-white p-6  max-w-5xl w-full">
          <div className="-ml-10">
            <img src={logo} className="w-60 mx-auto" />
          </div>

          <div className=" flex mt-7 flex-col sm:flex-row">
            <div className="flex w-full flex-col sm:w-1/2 ">
              <h2 className="text-4xl font-bold max-w-md">
                Create a new TeamLink workspace
              </h2>
              <p className="text-lg mb-2 mt-3 max-w-md  ">
                TeamLink gives your team a home — a place where they can talk
                and work together. To create a new workspace, click the button
                below.
              </p>

              <form onSubmit={handleSubmit}>
                <input
                  className="w-full max-w-md  px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-400 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="text"
                  placeholder="Workspace Name"
                  name="workspace_name"
                />
                <button className="w-full max-w-md mt-5 bg-[#7157FE] rounded-md text-white text-lg px-4 py-2 hover:bg-indigo-600">
                  Create a Workspace
                </button>
              </form>

              <p className=" max-w-md text-xs mt-3">
                By continuing, you’re agreeing to our Main Services Agreement,
                User Terms of Service, and TeamLink Supplemental Terms.
                Additional disclosures are available in our Privacy Policy and
                Cookie Policy.
              </p>
            </div>

            <div className="flex w-full   md:w-1/2  ">
              <img src={worklife} className=" hidden sm:block mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateWorkSpace;
