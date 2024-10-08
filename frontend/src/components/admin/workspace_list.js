import React, { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import axios from "axios";
import { toast } from "react-toastify";

const WorkspaceList = () => {
  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");
  const [workspaces, setWorkspaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchWorkspaceData();
  }, [accessToken]);

  const fetchWorkspaceData = async (
    url = `${baseURL}admin/workspace-list/`
  ) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.get(url, config);
      if (response.status === 200) {
        console.log("success");

        setWorkspaces(response.data.results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //handle search
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filtered workspaces based on search query
  const filteredWorkspaces = workspaces.filter((data) =>
    data.workspace_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //handle the status

  const handleWorkspaceStatus = async (workspace_id) => {
    try {
      const response = await axios.post(
        `${baseURL}admin/change-workspace-status/${workspace_id}/`
      );

      if (response.status === 200) {
        // set user status for component rerender
        const updatedWorkspaces = workspaces.map((data) =>
          data.id === workspace_id
            ? { ...data, is_active: response.data.is_active }
            : data
        );
        setWorkspaces(updatedWorkspaces);
        console.log("Updated workspaces:", updatedWorkspaces);

        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update workspace status");
    }
  };

  const handleNextPage = () => {
    fetchWorkspaceData(nextPage);
  };

  const handlePrevPage = () => {
    fetchWorkspaceData(prevPage);
  };

  return (
    <>
      <div className="w-full h-full bg-gray-800">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-gray-900">
          <span className="text-white text-3xl p-3 font-serif font-bold mt-6">Workspace List</span>

          <div className="relative mr-3">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <SearchOutlinedIcon style={{ color: "white" }} />
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-white border border-gray-600 rounded-lg w-80 bg-gray-700 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Search for users"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Workspace Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Created On
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Created By
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkspaces.map((data, index) => (
              <tr
                key={data.id}
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-white whitespace-nowrap"
                >
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {data.workspace_name}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-bold ${
                      data.is_active
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {data.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-600">
                    {data.created_on}
                  </span>
                </td>
                <td className="px-6 text-base font-bold text-white py-4 text-center">
                  {data.created_by.username}
                </td>
                <td className="px-6 py-4 text-center">
                  {data.is_active ? (
                    <button
                      type="button"
                      onClick={() => handleWorkspaceStatus(data.id)}
                      className="bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-600 font-medium rounded-lg text-sm px-7 py-2.5 me-2 mb-2"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleWorkspaceStatus(data.id)}
                      className="bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-600 font-medium rounded-lg text-sm px-7 py-2.5 me-2 mb-2"
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-between items-center ml-2 mr-2 py-4">
          {prevPage ? (
            <button
              className="px-4 py-2 text-sm text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
              onClick={handlePrevPage}
            >
              Previous
            </button>
          ) : (
            <button
              className="px-4 py-2 text-sm text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
              disabled
            >
              Previous
            </button>
          )}
          {nextPage ? (
            <button
              className="px-4 py-2 text-sm text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
              onClick={handleNextPage}
            >
              Next
            </button>
          ) : (
            <button
              className="px-4 py-2 text-sm text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
              disabled
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkspaceList;
