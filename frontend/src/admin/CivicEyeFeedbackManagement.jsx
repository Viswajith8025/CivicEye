import React, { useEffect, useState } from "react";
import logo from "../assets/celogofull.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiBarChart2, FiBell, FiUsers, FiFileText, FiLogOut, FiSearch, FiRefreshCw } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

export const CivicEyeFeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState("Admin Name");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const feedbackResponse = await axios.get("https://civiceye-1-mrbx.onrender.com/feedback/all", {
        headers: { "x-auth-token": token },
      });

      const formattedFeedbacks = feedbackResponse.data.map((feedback) => ({
        id: feedback._id,
        userName: feedback.userId?.name || "Unknown",
        description: feedback.description,
        timestamp: new Date(feedback.timestamp).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: feedback.status,
      }));

      setFeedbacks(formattedFeedbacks);
      setFilteredFeedbacks(formattedFeedbacks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to fetch feedback data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    const storedAdminName = localStorage.getItem("name") || "Admin Name";
    setAdminName(storedAdminName);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = feedbacks.filter(
      (feedback) =>
        feedback.userName.toLowerCase().includes(query) ||
        feedback.description.toLowerCase().includes(query) ||
        feedback.status.toLowerCase().includes(query)
    );
    setFilteredFeedbacks(filtered);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    fetchFeedbacks();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <img src={logo} alt="CivicEYE Logo" className="h-10" />
        </div>
        <div className="flex flex-col mt-4">
          <Link to="/overview">
            <div className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
              <FiBarChart2 className="mr-3 text-lg" />
              <span>Overview</span>
            </div>
          </Link>
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
          <div className="flex items-center px-6 py-3 bg-blue-50 text-blue-700 border-l-4 border-blue-500">
            <FiFileText className="mr-3 text-lg" />
            <span>Feedback</span>
          </div>
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
        <div className="bg-white shadow-sm border-b border-gray-200 p-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Feedback Management</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-xl shadow-md">
            {loading && (
              <div className="p-12 text-center">
                <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
                <p className="mt-4 text-gray-600">Loading feedback data...</p>
              </div>
            )}
            {error && (
              <div className="p-12 text-center bg-red-50 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Try Again
                </button>
              </div>
            )}
            {!loading && !error && filteredFeedbacks.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <p>No feedback found.</p>
              </div>
            )}
            {!loading && !error && filteredFeedbacks.length > 0 && (
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
                    {filteredFeedbacks.map((feedback) => (
                      <tr
                        key={feedback.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-800">{feedback.userName}</td>
                        <td className="p-4 text-gray-600">{feedback.description}</td>
                        <td className="p-4 text-gray-600">{feedback.timestamp}</td>
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
                            onClick={() => {
                              navigate(`/adminfeedbackdetails/${feedback.id}`);
                            }}
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
  );
};
