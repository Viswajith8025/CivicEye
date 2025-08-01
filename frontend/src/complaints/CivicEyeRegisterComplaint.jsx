import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/celogofull.png";
import toast, { Toaster } from "react-hot-toast";

export const CivicEyeRegisterComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    type: "",
    location: "",
  });
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProofFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview({
          type: 'image',
          src: e.target.result
        });
      };
      reader.readAsDataURL(file);
    } 
    // Create preview for videos
    else if (file.type.startsWith('video/')) {
      setFilePreview({
        type: 'video',
        src: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to register a complaint");
        setLoading(false);
        return;
      }

      // Check if proof file is selected
      if (!proofFile) {
        setError("Please upload a proof file (image or video)");
        setLoading(false);
        return;
      }

      // Create FormData object for multipart/form-data
      const submitData = new FormData();
      submitData.append("description", formData.description);
      submitData.append("type", formData.type);
      submitData.append("location", formData.location);
      submitData.append("proof", proofFile);

      // Send request to backend
      const response = await axios.post(
        "https://civiceye-backend-7le4.onrender.com/complaint/register",
        submitData,
        {
          headers: {
            "x-auth-token": token,
            // Don't set Content-Type, it will be set automatically with boundary
          },
        }
      );

      setLoading(false);

      // Show success message and redirect to complaints list
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/complaintlist')
      }, 1000);
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.message ||
          "Failed to register complaint. Please try again."
      );
    }
  };

  const renderFilePreview = () => {
    if (!filePreview) return null;

    if (filePreview.type === 'image') {
      return (
        <div className="mt-2">
          <img 
            src={filePreview.src} 
            alt="Proof preview" 
            className="w-full max-h-40 object-contain rounded-md"
          />
        </div>
      );
    } else if (filePreview.type === 'video') {
      return (
        <div className="mt-2">
          <video 
            src={filePreview.src} 
            controls
            className="w-full max-h-40 object-contain rounded-md"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster/>
      {/* Back button in top left corner */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 text-sm text-white bg-blue-800 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>
      
      {/* Header with Logo and Title */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* Logo and text container */}
            <img src={logo} alt="CivicEye" className="h-10 mb-1" />
            <p className="text-xs text-blue-100">Community Safety Reporting System</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 mb-8">
        <h2 className="text-xl font-bold mt-6 mb-4 px-2 text-center text-blue-800">Report an Incident</h2>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="type">
                Incident Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Select Type</option>
                <optgroup label="Vehicle Related">
                  <option>Riding without helmets</option>
                  <option>Reckless driving</option>
                  <option>Signal line crossing</option>
                  <option>Triples</option>
                  <option>Mirror</option>
                  <option>Using mobile while driving</option>
                  <option>Not giving pass to emergency vehicles</option>
                  <option>Wrong way</option>
                  <option>Underage driving</option>
                  <option>Driving without seatbelt</option>
                  <option>Overloading</option>
                  <option>No parking</option>
                  <option>Driving on footpath</option>
                  <option>Towing</option>
                  <option>Carrying goods unsafe</option>
                </optgroup>
                <optgroup label="Public Order Issues">
                  <option>Waste dumping</option>
                  <option>Public nuisance</option>
                  <option>Theft</option>
                  <option>Shoplifting</option>
                  <option>Smoking in public</option>
                  <option>Overcharging fare</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter location"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="4"
                placeholder="Describe what happened"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="proof">
                Proof (Image or Video)
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  id="proof"
                  name="proof"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,video/*"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Choose File
                </button>
                <span className="ml-3 text-sm text-gray-500">
                  {proofFile ? proofFile.name : "No file chosen"}
                </span>
              </div>
              {renderFilePreview()}
              <p className="text-xs text-gray-500 mt-1">
                Upload an image or video as proof (max 50MB)
              </p>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : "Submit Report"}
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-sm text-gray-500 text-center">
            Your information will be handled confidentially
          </p>
        </div>
      </div>
    </div>
  );
};