

import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import ListIcon from "@mui/icons-material/List";
import ReportIcon from "@mui/icons-material/Report";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWorkspaces, setTotalWorkspaces] = useState(0);
  const [totalReportedPosts, setTotalReportedPosts] = useState(0);
  const [chartData, setChartData] = useState([]);
  const baseURL = process.env.REACT_APP_baseURL;

  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${baseURL}admin/total-user/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user list:", error);
      return 0;
    }
  };

  const fetchTotalWorkspaces = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${baseURL}admin/total-workspaces/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching workspaces list:", error);
      return 0;
    }
  };

  const fetchReportedPostsList = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${baseURL}admin/reports/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.length;
    } catch (error) {
      console.error("Error fetching reported posts list:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userCount = await fetchUserCount();
        setTotalUsers(userCount);

        const workspaceCount = await fetchTotalWorkspaces();
        setTotalWorkspaces(workspaceCount);

        const reportedPostsCount = await fetchReportedPostsList();
        setTotalReportedPosts(reportedPostsCount);

        setChartData([
          { name: "Total Users", value: userCount },
          { name: "Total Workspaces", value: workspaceCount },
          { name: "Total Reported Posts", value: reportedPostsCount },
        ]);
      } catch (error) {
        console.error("Error in fetching details:", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 h-full overflow-hidden">
      <div className="grid grid-cols-1 h-full">
        <div className="md:col-span-3">
          <main className="p-6">
            <h3 className="text-xl font-semibold mb-6">DASHBOARD</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-600 p-4 rounded-md shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <h3 className="text-white">WORKSPACES</h3>
                  <ListIcon className="text-white" fontSize="large" />
                </div>
                <h1 className="text-2xl font-bold mt-4 text-white">
                  {totalWorkspaces}
                </h1>
              </div>
              <div className="bg-orange-500 p-4 rounded-md shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <h3 className="text-white">USERS</h3>
                  <PeopleIcon className="text-white" fontSize="large" />
                </div>
                <h1 className="text-2xl font-bold mt-4 text-white">
                  {totalUsers}
                </h1>
              </div>
              <div className="bg-red-600 p-4 rounded-md shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <h3 className="text-white">REPORTS</h3>
                  <ReportIcon className="text-white" fontSize="large" />
                </div>
                <h1 className="text-2xl font-bold mt-4 text-white">
                  {totalReportedPosts}
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="bg-gray-800 p-4 rounded-md shadow-md">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-800 p-4 rounded-md shadow-md">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

