import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view user details");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://civiceye-1-mrbx.onrender.com/user/details/${id}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setUser(response.data);
      setLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch user details. Please try again."
      );
      setLoading(false);
    }
  };

  const handleDelete = async (UserId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(true); // Set deleting state to true
      const token = localStorage.getItem("token");
      console.log(token);
      console.log(id);
      console.log(UserId);
      await axios.put(`https://civiceye-1-mrbx.onrender.com/user/deleted/${UserId}`,{}, {
        headers: {
          "x-auth-token": token,
        },
      });
      console.log(token);
      console.log(id);
      

      toast.success("User deleted successfully");
      setTimeout(() => {
        navigate("/usermanagement");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete user. Please try again."
      );
      setDeleting(false); // Reset deleting state on error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-100 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <p className="text-center text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Details</h2>
        <button
          onClick={() => navigate("/usermanagement")}
          className="text-white hover:bg-blue-800 rounded-2xl bg-blue-600 px-2 py-1"
        >
          Back to User Management
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">{user.mobile}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium">{user.address || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ID Proof</p>
          <p className="font-medium">
            {user.idProofType && user.idProofNumber
              ? `${user.idProofType}: ${user.idProofNumber}`
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-medium">{user.role}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Reports</p>
          <p className="font-medium">{user.reports}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => handleDelete(user._id)}
          disabled={deleting}
          className="text-white hover:bg-red-800 rounded-2xl bg-red-600 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Deleting..." : "Delete User"}
        </button>
      </div>
    </div>
  );
};
