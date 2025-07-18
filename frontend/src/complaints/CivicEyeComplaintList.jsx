import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const CivicEyeComplaintList = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to view complaints');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'https://civiceye-1-mrbx.onrender.com/complaint/list',
        {
          headers: {
            "x-auth-token": token,
          }
        }
      );

      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to fetch complaints. Please try again.'
      );
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-100 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate("/userhome")}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-800 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Complaints</h2>
        <Link 
          to="/registercomplaint" 
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Register New Complaint
        </Link>
      </div>

      {complaints.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven't filed any complaints yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{complaint.type}</td>
                  <td className="py-3 px-4 truncate max-w-xs">
                    {complaint.description.substring(0, 50)}
                    {complaint.description.length > 50 ? '...' : ''}
                  </td>
                  <td className="py-3 px-4">{complaint.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{complaint.createdAt}</td>
                  <td className="py-3 px-4">
                    <Link 
                      to={`/complaintdetail/${complaint._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
