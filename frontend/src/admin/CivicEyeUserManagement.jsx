import React, { useEffect, useState } from "react";
import logo from "../assets/celogofull.png"; // Adjust the path to your logo
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiBarChart2, FiBell, FiUsers, FiFileText, FiLogOut } from "react-icons/fi";

export const CivicEyeUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState("Admin Name");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get("https://civiceye-backend-7le4.onrender.com/user/allusers", {
          headers: {
            "x-auth-token": token,
          },
        });

        const formattedUsers = response.data.filter((user)=>user.deletestate !== true).map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.mobile,
          address: user.address || "N/A",
          idProof:
            user.idProofType && user.idProofNumber
              ? `${user.idProofType}: ${user.idProofNumber}`
              : "N/A",
        }));

        setUsers(formattedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();

    const storedAdminName = localStorage.getItem("name") || "Admin Name";
    setAdminName(storedAdminName);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login"); // Adjust the route to your login page
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
          <div className="flex items-center px-6 py-3 bg-blue-50 text-blue-700 border-l-4 border-blue-500">
            <FiUsers className="mr-3 text-lg" />
            <span>User Management</span>
          </div>
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
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-medium">User Management</h1>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow">
            {loading && (
              <div className="p-8 text-center">
                <p>Loading users data...</p>
              </div>
            )}
            {error && (
              <div className="p-8 text-center text-red-500">
                <p>{error}</p>
              </div>
            )}
            {!loading && !error && users.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No users found.</p>
              </div>
            )}
            {!loading && !error && users.length > 0 && (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-700">Name</th>
                    <th className="text-left p-4 font-medium text-gray-700">Email</th>
                    <th className="text-left p-4 font-medium text-gray-700">Phone</th>
                    <th className="text-left p-4 font-medium text-gray-700">Address</th>
                    <th className="text-left p-4 font-medium text-gray-700">ID Proof</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.phone}</td>
                      <td className="p-4">{user.address}</td>
                      <td className="p-4">{user.idProof}</td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            navigate(`/user/details/${user.id}`);
                            console.log("Navigating to:", `/user/details/${user.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicEyeUserManagement;