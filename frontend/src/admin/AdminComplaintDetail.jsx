import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to view complaint details');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://civiceye-backend-7le4.onrender.com/complaint/admin/detail/${id}`,
        {
          headers: {
            "x-auth-token": token,
          }
        }
      );
      
      setComplaint(response.data);
      
      // Determine media type based on file extension
      const proofPath = response.data.proof;
      const extension = proofPath.split('.').pop().toLowerCase();
      
      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        setMediaType('image');
      } else if (['mp4', 'mov', 'avi', 'wmv'].includes(extension)) {
        setMediaType('video');
      } else {
        setMediaType('other');
      }
      
      setLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to fetch complaint details. Please try again.'
      );
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  const renderProofMedia = () => {
    if (!complaint || !complaint.proof) return null;
    
    // Get the server URL (assuming uploads are served from backend)
    const serverUrl = 'https://civiceye-backend-7le4.onrender.com';
    
    // Extract the file path (remove any absolute path and keep relative path)
    const filePath = complaint.proof.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/');
    
    // Construct full URL
    const mediaUrl = `${serverUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    
    if (mediaType === 'image') {
      return (
        <div className="mt-3">
          <img 
            src={mediaUrl} 
            alt="Complaint proof" 
            className="max-w-full h-auto rounded border border-gray-200"
            style={{ maxHeight: '400px' }}
          />
        </div>
      );
    } else if (mediaType === 'video') {
      return (
        <div className="mt-3">
          <video 
            controls 
            className="max-w-full rounded border border-gray-200"
            style={{ maxHeight: '400px' }}
          >
            <source src={mediaUrl} type={`video/${complaint.proof.split('.').pop().toLowerCase()}`} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else {
      return (
        <div className="mt-2">
          <a 
            href={mediaUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View uploaded file
          </a>
        </div>
      );
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

  if (!complaint) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <p className="text-center text-gray-500">Complaint not found</p>
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to update complaint status');
        return;
      }
      if (!newStatus) {
        setError('Please select a status');
        return;
      }

      const response = await axios.put(
        `https://civiceye-backend-7le4.onrender.com//complaint/update/${id}`,
        { status: newStatus },
        {
          headers: {
            "x-auth-token": token,
          }
        }
      );

      // Update the complaint state with the new data
      setComplaint(response.data.complaint);
      setError(''); // Clear any previous errors
      toast.success("status updated succesfully");
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || 
        'Failed to update complaint status. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Toaster/>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Complaint Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:bg-blue-800 rounded-2xl bg-blue-600 px-2 py-1"
        >
          Back to List
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Status</h3>
          {getStatusBadge(complaint.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium">{complaint.createdAt}</p>
          </div>
          
          {complaint.resolvedAt && (
            <div>
              <p className="text-sm text-gray-500">Resolved At</p>
              <p className="font-medium">{complaint.resolvedAt}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Complaint Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{complaint.type}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{complaint.location}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">Description</p>
          <p className="mt-1">{complaint.description}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Proof/Reference</p>
          {renderProofMedia()}
        </div>
      </div>
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-2">Update Status</h3>
        <div className="flex items-center space-x-4">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={!newStatus}
          >
            Update Status
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      
      {complaint.status === 'Pending' && (
        <div className="border-t pt-6 mt-6">
          <p className="text-gray-600 italic">
            Your complaint is currently under review. You'll be notified once there's an update.
          </p>
        </div>
      )}
    </div>
  );
};