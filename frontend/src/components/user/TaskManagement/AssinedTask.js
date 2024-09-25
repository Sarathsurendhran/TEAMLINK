import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import EditTaskModal from "./EditTask";
import { toast } from "react-toastify";

export default function AssignedTaskTables() {
  const baseURL = process.env.REACT_APP_baseURL;
  const workspaceID = useSelector((state) => state.workspace.workspaceId);
  const accessToken = localStorage.getItem("access");
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(false);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const fetchTaskDetails = async (url = null) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { workspaceID },
    };
    try {
      const response = await axios.get(
        url || `${baseURL}group/get-tasks`,
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
    fetchTaskDetails();
  }, [workspaceID]);

  const handlePageChange = (url) => {
    if (url) {
      fetchTaskDetails(url);
    }
  };

  // Delete Task............
  const deleteTask = async (taskID) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { taskID },
    };
    try {
      const response = await axios.delete(`${baseURL}group/delete-task`, config);
      if (response.status === 200) {
        toast.success(response.data.message)
        fetchTaskDetails()
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const handleDeleteTask = (taskID) => {
    deleteTask(taskID);
  };

  return (
    <>
      <div className="mt-20  max-w-[76rem] ml-auto">
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
                    Assigned To
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
                  <th
                    scope="col"
                    className="py-3 px-6 text-sm font-medium tracking-wider text-left text-gray-700 uppercase"
                  >
                    Action
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
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 uppercase">
                      {task.assigned_to_username}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 uppercase">
                      {task.status}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {new Date(task.start_date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 ">
                    {new Date(task.end_date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="flex mt-3 text-sm font-medium text-gray-900">
                      <EditTaskModal taskID={task.id} fetchTaskDetails={fetchTaskDetails}/>
                      <button
                        className="py-1 px-2 bg-red-400 rounded"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination Controls */}
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
      </div>
    </>
  );
}
