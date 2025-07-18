import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export const CivicEyeComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
        `https://civiceye-1-mrbx.onrender.com/complaint/detail/${id}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setComplaint(response.data);
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to delete a complaint');
        setDeleting(false);
        return;
      }

      await axios.delete(
        `https://civiceye-1-mrbx.onrender.com/complaint/delete/${id}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      toast.success('Complaint deleted successfully');
      setTimeout(() => {
        navigate('/complaintlist');
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to delete complaint. Please try again.'
      );
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'In Progress': 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

 const renderProofMedia = () => {
  if (!complaint || !complaint.proof) return null;

  const serverUrl = 'https://civiceye-1-mrbx.onrender.com';
  const fileName = complaint.proof.split('/').pop(); // Extract only filename
  const mediaUrl = `${serverUrl}/uploads/${fileName}`;

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
          <source src={mediaUrl} type={`video/${fileName.split('.').pop().toLowerCase()}`} />
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

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Toaster />
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

      {complaint.status === 'Pending' && (
        <div className="border-t pt-6 mt-6">
          <p className="text-gray-600 italic">
            Your complaint is currently under review. You'll be notified once there's an update.
          </p>
        </div>
      )}

      {/* Delete Button at Bottom */}
      {complaint.status === 'Pending' && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-white hover:bg-red-800 rounded-2xl bg-red-600 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete Complaint'}
          </button>
        </div>
      )}
    </div>
  );
};