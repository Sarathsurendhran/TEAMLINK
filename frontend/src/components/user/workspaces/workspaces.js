import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import avatar1 from "../../../assets/avatar1.svg";
import axios from "axios";
import "../../../style/style.css";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setWorkspaceId } from "../../../Redux/WorkspaceID/workspaceSlice";


const WorkSpaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [user, setUser] = useState(null);
  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  useEffect(() => {
    const fetechWorkspace = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const res = await axios.get(
          `${baseURL}workspace/list-workspaces/`,
          config
        );

        setWorkspaces(res.data.workspaces);
        setUser(res.data.user.email);
      } catch (error) {
        console.log(error);
      }
    };
    fetechWorkspace();
  }, []);

  const handleLaunch = async (id) => {
    dispatch(setWorkspaceId(id));

    navigate(`/createworkspace/workspacehome`);
  };

  return (
    <>
      <div className="flex justify-center min-h-screen bg-white">
        <div className="bg-white p-6  max-w-4xl w-full">
          <div className="-ml-10">
            <img src={logo} className="w-60 mx-auto" />
          </div>
          <h2 className="text-center mb-2 mt-4 text-2xl md:text-4xl font-bold ">
            Welcome back
          </h2>
          <p className="text-center mb-6  text-base">
            Choose a workspace below to get back to working with your team.
          </p>

          <div className="workspace w-full flex flex-col justify-center items-center ">
            <h3 className="text-lg mb-2  font-bold">
              Workspaces for {user ? user : " "}
            </h3>

            <div className="w-full max-w-xl  overflow-y-auto scrollbar-hide ">
              {workspaces.length > 0 ? (
                workspaces.map((workspace, index) => (
                  <div
                    key={index}
                    className="w-full max-w-xl rounded-xl bg-[#7157FE] mb-2 mt-2 h-16 transition cursor-pointer hover:-translate-y-1.5 text-center flex items-center justify-center  hover:bg-indigo-500"
                    onClick={() => handleLaunch(workspace.id)}
                  >
                    <h1 className="text-2xl font-bold font-sans text-white">
                      {workspace.workspace_name}
                    </h1>{" "}
                  </div>
                ))
              ) : (
                <p>NO workspaces</p>
              )}
            </div>

            <div className="w-full max-w-xl rounded-lg  flex justify-between items-center bg-gray-200 mb-2 mt-2 h-16 ">
              <div>
                <img src={avatar1} className="ml-2 w-16 mx-auto" />
              </div>
              <p className="text-xs  ml-4 sm:ml-0 md:text-base">
                Want to use TeamLink with a different team?
              </p>
              <Link to="/createworkspace">
              <button className="px-2 py-2  bg-[#7157FE]  text-white rounded-lg  mr-2  transition cursor-pointer hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500">
                Create another workspace
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkSpaces;
