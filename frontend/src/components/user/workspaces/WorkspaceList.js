import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setWorkspaceId, setWorkspaceName } from "../../../Redux/WorkspaceID/workspaceSlice";
import EastIcon from "@mui/icons-material/East";
import SearchIcon from "@mui/icons-material/Search";
import "../../../style/style.css";

const WorkSpaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [user, setUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
    const fetchWorkspaces = async () => {
      try {
        const res = await axios.get(
          `${baseURL}workspace/list-workspaces/`,
          config
        );

        setWorkspaces(res.data.workspaces);
        setUser(res.data.user.email);
        setFilteredData(res.data.workspaces);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch workspaces");
      }
    };

    fetchWorkspaces();
  }, []);

  const handleLaunch = async (id, name) => {
    dispatch(setWorkspaceId(id));
    dispatch(setWorkspaceName(name))
    navigate(`/workspacehome/chat`);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.clear();
    window.location.reload();
  };

  // Function to handle input change
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterData(value);
  };

  // Function to filter data based on search term
  const filterData = (term) => {
    const filtered = workspaces.filter((item) =>
      item.workspace_name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };


    

  return (
    <>
      <div className="min-h-screen bg-[#0274BD]  flex flex-col">
        <header className="m-2 flex justify-between items-center p-4 rounded-lg   ">
          <div className="ml-8">
            {/* <img src={logo} className="w-40 mx-auto" alt="Logo" /> */}
            <h2 className="text-3xl text-gray-100 font-bold">TeamLink</h2>
            <span className="text-gray-100 ">WORK SMARTER TOGETHER</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/createworkspace">
              <button className="px-2 py-2 bg-[#5d40fd] text-white rounded mr-2 transition cursor-pointer hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500">
                Create another workspace
              </button>
            </Link>
            <button
              className="px-3 py-2 bg-red-600 text-white rounded mr-2 transition cursor-pointer hover:-translate-y-1 hover:scale-110 hover:bg-red-500"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-grow ">
          <div className="max-w-4xl mx-auto text-gray-100 p-6 rounded ">
            <h2 className="text-center mb-3 text-2xl md:text-5xl font-bold ">
              Welcome back
            </h2>
            {/* <p className="text-center mb-2 text-base">
              Choose a workspace below to get back to working with your team.
            </p> */}
            <h3 className="text-center text-lg mb-2 font-bold">
              Workspaces for {user ? user : ""}
            </h3>

            <div className="flex justify-center items-center m-2">
              <div className="relative w-96">
                <input
                  className="input pl-12 pr-4 rounded-full px-4 py-2 bg-blue-100 w-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md"
                  placeholder="Search..."
                  required=""
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pl-3">
                  <SearchIcon className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-600 hover:scrollbar-track-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((workspace, index) => (
                  <div
                    key={index}
                    className="w-full max-w-5xl p-3 rounded-lg bg-[#ffffff] h-auto text-center flex items-start justify-between"
                  >
                    <div className="flex flex-col items-start text-left p-2 max-w-xl ">
                      <h1 className="text-2xl font-bold font-sans text-black">
                        {workspace.workspace_name}
                      </h1>

                      <h2 className="text-xl text-black">
                        {workspace.description}
                      </h2>
                    </div>

                    <button
                      className="overflow-hidden  w-32 p-2 h-12 mr-6 border border-blue-900 bg-[#0e7cf4] text-white rounded-md text-xl font-bold cursor-pointer relative z-10 group transform hover:scale-125"
                      onClick={() => handleLaunch(workspace.id, workspace.workspace_name)}
                    >
                      Launch
                      <span className="absolute w-36 h-32 -top-8 -left-2 bg-gray-300 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
                      <span className="absolute w-36 h-32 -top-8 -left-2 bg-red-500 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
                      <span className="absolute w-36 h-32 -top-8 -left-2 bg-red-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
                      <span className="absolute inset-0 text-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <EastIcon />
                      </span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-lg font-bold text-red-600">
                  No workspaces found
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WorkSpaces;
