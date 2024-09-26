import React, { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import axios from "axios";
import { toast } from "react-toastify";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const baseURL = process.env.REACT_APP_baseURL;
  const accessToken = localStorage.getItem("access");
  const [searchQuery, setSearchQuery] = useState("");

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchuserData();
  }, [accessToken]);

  const fetchuserData = async (url = `${baseURL}admin/users-list/`) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(url, config);
      if (response.status === 200) {
        console.log("success");
        setUsers(response.data.results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  // handling the user status
  const handleUserStatus = async (user_id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.post(
        `${baseURL}admin/change-user-status/${user_id}/`,
        config
      );
      if (response.status === 200) {
        // set user status for component rerender
        const updatedUsers = users.map((user) =>
          user.id === user_id
            ? { ...user, is_active: response.data.is_active }
            : user
        );
        setUsers(updatedUsers);

        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNextPage = () => {
    fetchuserData(nextPage);
  };

  const handlePrevPage = () => {
    fetchuserData(prevPage);
  };

  return (
    <>
      <div className="w-full h-full bg-gray-800">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-gray-900">
          <span className="text-white text-3xl font-serif font-bold mt-6 p-3">Users List</span>

          <div className="relative mr-3 ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <SearchOutlinedIcon style={{ color: "gray" }} />
            </div>
            <input  
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for users"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>

        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Joined Date
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-white"
                >
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {user.username}
                    </div>
                    <div className="font-normal text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-bold ${
                      user.is_active
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-600">
                    {user.date_joined}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {user.is_active ? (
                    <button
                      type="button"
                      onClick={() => handleUserStatus(user.id)}
                      className="bg-white text-red-600 hover:bg-gray-100 border border-gray-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-100 font-medium rounded-lg text-sm px-7 py-2.5"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUserStatus(user.id)}
                      className="bg-white text-green-600 hover:bg-gray-100 border border-gray-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-100 font-medium rounded-lg text-sm px-7 py-2.5"
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
              className="px-4 py-2 text-sm text-gray-700 cursor-pointer bg-white border rounded-lg hover:bg-gray-100"
              onClick={handlePrevPage}
            >
              Previous
            </button>
          ) : (
            <button
              className="px-4 py-2 text-sm text-gray-700 cursor-pointer bg-white border rounded-lg hover:bg-gray-100"
              disabled
            >
              Previous
            </button>
          )}
          {nextPage ? (
            <button
              className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100"
              onClick={handleNextPage}
            >
              Next
            </button>
          ) : (
            <button
              className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100"
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

export default AdminUserList;
