import React, { useEffect, useState } from "react";
import logo from "../assets/celogofull.png";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiBarChart2, FiBell, FiUsers, FiFileText, FiLogOut } from "react-icons/fi";

export const AdminFeedbackDetails = () => {
  const { id } = useParams(); // Get feedback ID from URL
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState("Admin Name");
  const [newStatus, setNewStatus] = useState(""); // For status update
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // Fetch feedback details
  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(`https://civiceye-1-mrbx.onrender.com/feedback/all`, {
          headers: { "x-auth-token": token },
        });

        // Find the feedback with the matching ID
        const feedbackData = response.data.find((item) => item._id === id);
        if (!feedbackData) {
          throw new Error("Feedback not found");
        }

        // Format the feedback data
        const formattedFeedback = {
          id: feedbackData._id,
          userName: feedbackData.userId?.name || "Unknown",
          email: feedbackData.userId?.email || "N/A",
          description: feedbackData.description,
          timestamp: new Date(feedbackData.timestamp).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: feedbackData.status,
        };

        setFeedback(formattedFeedback);
        setNewStatus(formattedFeedback.status); // Set initial status in dropdown
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedback details:", error);
        setError(error.message || "Failed to fetch feedback details");
        setLoading(false);
      }
    };

    fetchFeedbackDetails();

    const storedAdminName = localStorage.getItem("name") || "Admin Name";
    setAdminName(storedAdminName);
  }, [id]);

  // Handle status update
  const handleStatusUpdate = async () => {
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Ensure newStatus is valid and lowercase
      if (!newStatus || !["pending", "accepted", "rejected"].includes(newStatus.toLowerCase())) {
        setUpdateError("Please select a valid status");
        return;
      }

      const statusToSend = newStatus.toLowerCase();
      const response = await axios.put(
        "https://civiceye-1-mrbx.onrender.com/feedback/updatestatus",
        { feedbackId: id, status: statusToSend },
        { headers: { "x-auth-token": token } }
      );

      setFeedback({ ...feedback, status: statusToSend });
      setUpdateSuccess("Status updated successfully!");
    } catch (error) {
      console.error("Error updating feedback status:", error);
      setUpdateError(
        error.response?.data?.message || 
        error.message || 
        "Failed to update status. Please try again."
      );
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
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
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-xl font-medium">Feedback Details</h1>
          <button
            onClick={() => navigate("/feedbackmanagement")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Feedback List
          </button>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {loading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
          {error && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={() => navigate("/feedbackmanagement")}
                className="mt-4 text-blue-600 hover:underline"
              >
                Go Back
              </button>
            </div>
          )}
          {!loading && !error && feedback && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-700">User Name</h2>
                  <p className="mt-1 text-gray-600">{feedback.userName}</p>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-700">Email</h2>
                  <p className="mt-1 text-gray-600">{feedback.email}</p>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-700">Date</h2>
                  <p className="mt-1 text-gray-600">{feedback.timestamp}</p>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-700">Status</h2>
                  <p className="mt-1 text-gray-600 capitalize">{feedback.status}</p>
                </div>
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-700">Description</h2>
                  <p className="mt-1 text-gray-600">{feedback.description}</p>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-700">Update Status</h2>
                <div className="mt-2 flex items-center space-x-4">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Update Status
                  </button>
                </div>
                {updateSuccess && (
                  <p className="mt-2 text-green-600">{updateSuccess}</p>
                )}
                {updateError && (
                  <p className="mt-2 text-red-600">{updateError}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackDetails;