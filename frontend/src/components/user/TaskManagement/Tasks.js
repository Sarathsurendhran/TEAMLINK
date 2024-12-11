import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

export default function Tasks() {
  const baseURL = process.env.REACT_APP_baseURL;
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const authenticatedUser = useSelector((state) => state.authenticationUser.id);
  const accessToken = localStorage.getItem("access");
  const [tasks, setTasks] = useState([]);
  const [statusChoices, setStatusChoices] = useState([
    "Pending",
    "In Progress",
    "Completed",
    "On Hold",
  ]);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const fetchTasksDetails = async (url = null) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { workspaceID, authenticatedUser },
    };
    try {
      const response = await axios.get(
        url || `${baseURL}group/get-user-tasks`,
        config
      );
      if (response.status === 200) {
        setTasks(response.data.results);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
      }
    } catch {
      console.log("something went wrong");
    }
  };

  useEffect(() => {
    fetchTasksDetails();
  }, [workspaceID]);

  const handleStatusChange = (e, id) => {
    const selectedStatus = e.target.value;
    updateTaskStatus(id, selectedStatus);
  };

  const updateTaskStatus = async (taskID, selectedStatus) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { taskID, selectedStatus },
    };
    try {
      const response = await axios.put(
        `${baseURL}group/update-task-status`,
        null,
        config
      );
      if (response.status === 200) {
        fetchTasksDetails();
        toast.success("Status Updated Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (url) => {
    if (url) {
      fetchTasksDetails(url);
    }
  };

  return (
    <>
      <div className="mt-20  max-w-[76rem] ml-auto">
        {tasks.length > 0 ? (
          <>
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y  divide-gray-300 table-fixed">
                  <thead className="bg-gray-300">
                    <tr>
                      <th
                        scope="col"
                        className="py-4 px-6 text-sm font-medium tracking-wider text-left text-gray-700 uppercase"
                      >
                        Groups
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 text-sm font-medium tracking-wider text-left text-gray-700 uppercase"
                      >
                        Tasks
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 text-sm font-medium tracking-wider text-left text-gray-700 uppercase"
                      >
                        Task Description
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 text-sm font-medium tracking-wider text-left text-gray-700 uppercase"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 text-sm font-medium tracking-wider text-left text-gray-700 uppercase"
                      >
                        start date
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 text-sm font-medium tracking-wider text-left text-gray-700 uppercase"
                      >
                        end date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-300">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-100">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900 uppercase">
                          {task.group_name}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {task.task_name}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {task.task_description}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium cursor-pointer text-gray-900 uppercase">
                          <div>
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(e, task.id)}
                              className="cursor-pointer bg-gray-200"
                            >
                              {statusChoices.map((choice, index) => (
                                <option key={index} value={choice}>
                                  {choice}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {new Date(task.start_date).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {new Date(task.end_date).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-red-500 flex justify-center items-center mt-52 text-xl font-bold">
            <span>No Tasks Available.</span>
          </div>
        )}
        {/* Pagination Controls */}
        {tasks.length > 0 ? (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(prevPageUrl)}
              disabled={!prevPageUrl}
              className="px-4 py-1 bg-gray-300 shadow-xl border ml-2 rounded hover:bg-gray-200 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(nextPageUrl)}
              disabled={!nextPageUrl}
              className="px-4 py-1 bg-gray-300 shadow-xl border mr-2  rounded hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
