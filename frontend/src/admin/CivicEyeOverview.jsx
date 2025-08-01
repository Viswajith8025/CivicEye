import React, { useEffect, useState } from "react";
import logo from "../assets/celogofull.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiBarChart2, FiBell, FiUsers, FiFileText, FiLogOut } from "react-icons/fi";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const CivicEyeOverview = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [adminName, setAdminName] = useState("Admin Name");
  const [feedbackStats, setFeedbackStats] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [complaintStats, setComplaintStats] = useState({
    totalComplaints: 0,
    statusCounts: {
      Pending: 0,
      "In Progress": 0,
      Resolved: 0,
      Rejected: 0,
    },
    categoryCounts: {},
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [activityData, setActivityData] = useState([]);

  // Check if user is logged in
  useEffect(() => {
    if (!userId) {
      toast.error("Please log in to access this page.");
      navigate("/signin");
    }

    const storedAdminName = localStorage.getItem("name") || "Admin Name";
    setAdminName(storedAdminName);
  }, [userId, navigate]);

  // Fetch feedback stats
  const fetchFeedbackStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get("https://civiceye-backend-7le4.onrender.com/feedback/countbystatus", {
        headers: { "x-auth-token": token },
      });
      setFeedbackStats(response.data);
    } catch (error) {
      console.error("Error fetching feedback stats:", error);
      toast.error("Failed to fetch feedback stats.");
    }
  };

  // Fetch recent feedback and complaints
  const fetchRecentData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Fetch feedback
      const feedbackResponse = await axios.get("https://civiceye-backend-7le4.onrender.com/feedback/all", {
        headers: { "x-auth-token": token },
      });

      const formattedFeedback = feedbackResponse.data
        .map((feedback) => ({
          id: feedback._id,
          userName: feedback.userId?.name || "Unknown",
          description: feedback.description,
          timestamp: new Date(feedback.timestamp).toISOString(), // Keep as ISO for activity calculation
          displayTimestamp: new Date(feedback.timestamp).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: feedback.status,
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      setRecentFeedback(formattedFeedback);

      // Fetch complaints
      const complaintResponse = await axios.get("https://civiceye-backend-7le4.onrender.com/complaint/alllist", {
        headers: { "x-auth-token": token },
      });

      // Calculate complaint stats manually
      const statusCounts = {
        Pending: 0,
        "In Progress": 0,
        Resolved: 0,
        Rejected: 0,
      };
      const categoryCounts = {};

      complaintResponse.data.forEach((complaint) => {
        // Status counts
        if (statusCounts.hasOwnProperty(complaint.status)) {
          statusCounts[complaint.status]++;
        }
        // Category counts
        const category = complaint.type || "Other";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      setComplaintStats({
        totalComplaints: complaintResponse.data.length,
        statusCounts,
        categoryCounts,
      });

      const formattedComplaints = complaintResponse.data
        .map((complaint) => ({
          id: complaint._id,
          userName: complaint.userId?.name || "Unknown",
          description: complaint.description,
          category: complaint.type || "N/A",
          timestamp: new Date(complaint.createdAt).toISOString(), // Keep as ISO for activity calculation
          displayTimestamp: new Date(complaint.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: complaint.status,
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      setRecentComplaints(formattedComplaints);

      // Calculate activity data for the last 7 days (combined feedback and complaints)
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toISOString().split("T")[0];
      }).reverse();

      const activity = last7Days.map((date) => {
        const feedbackCount = feedbackResponse.data.filter((feedback) => {
          const feedbackDate = new Date(feedback.timestamp).toISOString().split("T")[0];
          return feedbackDate === date;
        }).length;

        const complaintCount = complaintResponse.data.filter((complaint) => {
          const complaintDate = new Date(complaint.createdAt).toISOString().split("T")[0];
          return complaintDate === date;
        }).length;

        return {
          day: new Date(date).toLocaleDateString("en-GB", { weekday: "short" }),
          feedback: feedbackCount,
          complaints: complaintCount,
        };
      });

      setActivityData(activity);
    } catch (error) {
      console.error("Error fetching recent data:", error);
      toast.error("Failed to fetch recent feedback or complaints.");
    }
  };

  useEffect(() => {
    fetchFeedbackStats();
    fetchRecentData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Prepare data for charts
  const feedbackStatusData = Object.entries(feedbackStats).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));
  const complaintStatusData = Object.entries(complaintStats.statusCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const complaintCategoryData = Object.entries(complaintStats.categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Colors for the charts
  const feedbackStatusColors = ["#FF9F40", "#36A2EB", "#FF6384"];
  const complaintStatusColors = ["#FF9F40", "#36A2EB", "#FF6384", "#4BC0C0"];
  const complaintCategoryColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"];

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
      case "approved":
      case "resolved":
      case "in progress":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Toaster />

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <img src={logo} alt="CivicEYE Logo" className="h-10" />
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex items-center px-6 py-3 bg-blue-50 text-blue-700 border-l-4 border-blue-500">
            <FiBarChart2 className="mr-3 text-lg" />
            <span>Overview</span>
          </div>
          <Link to="/complaintmanagement">
            <div className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
              <FiBell className="mr-3 text-lg" />
              <span>Complaints</span>
            </div>
          </Link>
          <Link to="/usermanagement">
            <div className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
              <FiUsers className="mr-3 text-lg" />
              <span>User Management</span>
            </div>
          </Link>
          <Link to="/feedbackmanagement">
            <div className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
              <FiFileText className="mr-3 text-lg" />
              <span>Feedback</span>
            </div>
          </Link>
        </div>
        <div className="mt-auto border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center mr-3">
                <span className="text-sm font-medium">{adminName.charAt(0)}</span>
              </div>
              <span className="text-gray-700 font-medium">{adminName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <FiLogOut className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Feedback Stats */}
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm">Total Feedback</h3>
                <p className="text-3xl font-bold">
                  {feedbackStats.pending + feedbackStats.accepted + feedbackStats.rejected}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm">Pending Feedback</h3>
                <p className="text-3xl font-bold">{feedbackStats.pending}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm">Accepted Feedback</h3>
                <p className="text-3xl font-bold">{feedbackStats.accepted}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                <h3 className="text-gray-500 text-sm">Rejected Feedback</h3>
                <p className="text-3xl font-bold">{feedbackStats.rejected}</p>
              </div>
              {/* Complaint Stats */}
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm">Total Complaints</h3>
                <p className="text-3xl font-bold">{complaintStats.totalComplaints}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm">Pending Complaints</h3>
                <p className="text-3xl font-bold">{complaintStats.statusCounts.Pending}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm">Resolved Complaints</h3>
                <p className="text-3xl font-bold">{complaintStats.statusCounts.Resolved}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                <h3 className="text-gray-500 text-sm">Rejected Complaints</h3>
                <p className="text-3xl font-bold">{complaintStats.statusCounts.Rejected}</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feedback Status Distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Feedback Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={feedbackStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {feedbackStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={feedbackStatusColors[index % feedbackStatusColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Complaint Status Distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Complaint Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complaintStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complaintStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={complaintStatusColors[index % complaintStatusColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Complaint Category Distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Complaint Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complaintCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complaintCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={complaintCategoryColors[index % complaintCategoryColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Activity Chart (Feedback and Complaints) */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Activity (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={activityData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="feedback" fill="#00B9FF" name="Feedback" />
                    <Bar dataKey="complaints" fill="#FF9F40" name="Complaints" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Feedback Table */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Feedback</h3>
              {recentFeedback.length === 0 ? (
                <p className="text-gray-500 text-center">No recent feedback available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="text-left p-4 font-semibold">User Name</th>
                        <th className="text-left p-4 font-semibold">Description</th>
                        <th className="text-left p-4 font-semibold">Date</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentFeedback.map((feedback) => (
                        <tr
                          key={feedback.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 text-gray-800">{feedback.userName}</td>
                          <td className="p-4 text-gray-600">{feedback.description}</td>
                          <td className="p-4 text-gray-600">{feedback.displayTimestamp}</td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                                feedback.status
                              )}`}
                            >
                              {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => navigate(`/adminfeedbackdetails/${feedback.id}`)}
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Complaints Table */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Complaints</h3>
              {recentComplaints.length === 0 ? (
                <p className="text-gray-500 text-center">No recent complaints available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="text-left p-4 font-semibold">User Name</th>
                        <th className="text-left p-4 font-semibold">Description</th>
                        <th className="text-left p-4 font-semibold">Category</th>
                        <th className="text-left p-4 font-semibold">Date</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentComplaints.map((complaint) => (
                        <tr
                          key={complaint.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 text-gray-800">{complaint.userName}</td>
                          <td className="p-4 text-gray-600">{complaint.description}</td>
                          <td className="p-4 text-gray-600">{complaint.category}</td>
                          <td className="p-4 text-gray-600">{complaint.displayTimestamp}</td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                                complaint.status
                              )}`}
                            >
                              {complaint.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => navigate(`/admincomplaintdetail/${complaint.id}`)}
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

