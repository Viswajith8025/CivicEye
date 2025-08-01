import React, { useEffect, useState } from "react";
import logo from "../assets/celogofull.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiBarChart2, FiBell, FiUsers, FiFileText, FiLogOut, FiSearch } from "react-icons/fi";

export const CiviEyeComplaintManagement = () => {
  const [userData, setUserData] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (userId) {
      const getUserData = async () => {
        try {
          const response = await axios.get(
            `https://civiceye-backend-7le4.onrender.com/user/viewuser/${userId}`
          );

          if (response.data) {
            setUserData(response.data);
          }
        } catch (error) {
          console.error("Error getting user data:", error);
          setError("Failed to fetch user data");
        }
      };

      getUserData();
    }
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          "https://civiceye-backend-7le4.onrender.com/complaint/alllist",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        const formattedComplaints = response.data.map((item) => ({
          id: item._id,
          date: new Date(item.createdAt).toLocaleDateString(),
          description: item.description,
          location: item.location,
          uploader: item.userId?.name || "User",
          type: item.type,
          status: item.status || "Pending",
          proof: item.proof,
        }));

        setComplaints(formattedComplaints);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setError("Failed to fetch complaints");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userData.name]);

  const filteredComplaints = complaints.filter((complaint) => {
    if (activeTab === "All") return true;
    if (activeTab === "Open") return complaint.status === "Pending";
    if (activeTab === "In Progress") return complaint.status === "In Progress";
    if (activeTab === "Resolved") return complaint.status === "Resolved";
    if (activeTab === "Rejected") return complaint.status === "Rejected";
    return true;
  });

  const searchedComplaints = filteredComplaints.filter(
    (complaint) =>
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <div className="flex items-center px-6 py-3 bg-blue-50 text-blue-700 border-l-4 border-blue-500">
            <FiBell className="mr-3 text-lg" />
            <span>Complaints</span>
          </div>
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
                <span className="text-sm font-medium">{userData.name ? userData.name.charAt(0) : "U"}</span>
              </div>
              <span className="text-gray-700 font-medium">{userData.name || "User"}</span>
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
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-xl font-medium">Complaints Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "All"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors`}
              onClick={() => setActiveTab("All")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "Open"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors`}
              onClick={() => setActiveTab("Open")}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "In Progress"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors`}
              onClick={() => setActiveTab("In Progress")}
            >
              In Progress
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "Resolved"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors`}
              onClick={() => setActiveTab("Resolved")}
            >
              Resolved
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "Rejected"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors`}
              onClick={() => setActiveTab("Rejected")}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {loading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
          {error && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-red-500">
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow">
              {/* Table Header Actions */}
              <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <div className="flex space-x-2">
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Sort by Date
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Sort by Type
                  </button>
                </div>
                <div className="text-gray-500">
                  {complaints.length} complaints found
                </div>
              </div>

              {/* Empty state */}
              {searchedComplaints.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>
                    No complaints found.{" "}
                    {searchTerm ? "Try a different search term." : ""}
                  </p>
                </div>
              )}

              {/* Table */}
              {searchedComplaints.length > 0 && (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700">
                      <th className="text-left p-4 font-semibold">Date</th>
                      <th className="text-left p-4 font-semibold">Description</th>
                      <th className="text-left p-4 font-semibold">Location</th>
                      <th className="text-left p-4 font-semibold">Uploader</th>
                      <th className="text-left p-4 font-semibold">Type</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchedComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-600">{complaint.date}</td>
                        <td className="p-4 text-gray-600">{complaint.description}</td>
                        <td className="p-4 text-gray-600">{complaint.location}</td>
                        <td className="p-4 text-gray-600">{complaint.uploader}</td>
                        <td className="p-4">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {complaint.type}
                          </span>
                        </td>
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
                          <Link to={`/admincomplaintdetail/${complaint.id}`}>
                            <button
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => console.log("Clicked complaint ID:", complaint.id)}
                            >
                              View Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Pagination */}
              {searchedComplaints.length > 0 && (
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <div>
                    Showing {searchedComplaints.length} of {complaints.length} entries
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-gray-100 text-gray-400 px-3 py-1 rounded-lg"
                      disabled
                    >
                      Previous
                    </button>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-lg">
                      1
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CiviEyeComplaintManagement;