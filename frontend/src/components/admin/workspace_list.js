import React, { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import axios from "axios";
import { toast } from "react-toastify";

const WorkspaceList = () => {
  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");
  const [workspaces, setWorkspaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

    
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchWorkspaceData();
  }, [accessToken]);

  const fetchWorkspaceData = async (url = `${baseURL}admin/workspace-list/`) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
     
    };
    try {
      const response = await axios.get(
       url,
        config
      );
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
  const filteredWorkspaces = workspaces.filter(data =>
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
      <div className="w-full h-full">
        <div className="flex justify-start items-center w-full h-full">
          <div className="relative overflow-x-auto shadow-md  w-full h-full p-2 bg-slate-100">
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
              <span className="text-white text-4xl p-5">Workspace List</span>

              <div className="relative mr-3">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <SearchOutlinedIcon style={{ color: "white" }} />
                </div>
                <input
                  type="text"
                  id="table-search-users"
                  className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for users"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                    created on
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    created by
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
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {/* <img
                      className="w-10 h-10 rounded-full"
                      src="profileImg"
                      alt="user image"
                    /> */}
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {data.workspace_name}
                        </div>
                        {/* <div className="font-normal text-gray-500">
                          {data.workspace_name}
                        </div> */}
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
                          className="bg-white text-red-600 hover:bg-gray-100 border border-gray-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-100 font-medium rounded-lg text-sm px-7 py-2.5 text-center inline-flex items-center dark:focus-visible:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleWorkspaceStatus(data.id)}
                          className="bg-white text-green-600 hover:bg-gray-100 border border-gray-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-100 font-medium rounded-lg text-sm px-7 py-2.5 text-center inline-flex items-center dark:focus-visible:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
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
            <div className="flex justify-between items-center py-4">
              {prevPage ? (
                <button className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600" onClick={handlePrevPage}>Previous</button>
              ) : (
                <button className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600" disabled>Previous</button>
              )}
              {nextPage ? (
                <button className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600" onClick={handleNextPage}>Next</button>
              ) : (
                <button className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600" disabled>Next</button>
              )}
            </div>
            {/* <div className="flex justify-between items-center py-4">
              <button className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                Previous
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page 1 of 10
              </span>
              <button className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                Next
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspaceList;
