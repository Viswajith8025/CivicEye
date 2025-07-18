import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/celogofull.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Sun, Moon, Eye, EyeOff, Loader2, MapPin, Activity, Bell, Search, ArrowRight, Shield, Users, Clock, FileText, Check } from "lucide-react";

export const CivicEyeUserHome = () => {
  const navigate = useNavigate();
  const userid = localStorage.getItem("id");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [feedback, setFeedback] = useState({});
  const [latestFeedbacks, setLatestFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const fetchUserData = async () => {
    try {
      if (!userid) return;
      const response = await axios.get(
        `https://civiceye-1-mrbx.onrender.com/user/viewuser/${userid}`
      );
      if (response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data");
    }
  };

 // In CivicEyeUserHome.jsx, replace the fetchLatestFeedback function with:

const fetchLatestFeedback = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Use the getFeedbackByStatus endpoint to only fetch accepted feedback
    const response = await axios.get(
      "https://civiceye-1-mrbx.onrender.com/feedback/status/accepted", 
      {
        headers: { "x-auth-token": token },
      }
    );

    // Sort by newest first and remove the slice(0, 2) limitation
    const formattedFeedbacks = response.data
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map((item) => ({
        id: item._id,
        userName: item.userId?.name || "Anonymous",
        description: item.description,
        timestamp: new Date(item.timestamp).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

    setLatestFeedbacks(formattedFeedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    setError("Failed to fetch feedback");
  }
};

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchUserData(), fetchLatestFeedback()]);
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    if (!userid) {
      navigate("/home");
    }
  }, [navigate, userid]);

  const handlechange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value,
      userId: userid,
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to submit feedback");
        return;
      }
      if (!feedback.description || feedback.description.trim() === "") {
        toast.error("Please enter your feedback");
        return;
      }

      const response = await axios.post(
        "https://civiceye-1-mrbx.onrender.com/feedback/add",
        {
          userId: userid,
          description: feedback.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      toast.success(response.data.message || "Feedback submitted successfully");
      setFeedback({ ...feedback, description: "" });
      fetchLatestFeedback();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error.response?.data?.message || "Failed to send feedback");
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: 1650, behavior: "smooth" });
  };

  const scrollToAbout = () => {
    window.scrollTo({ top: 780, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className={`${isDarkMode ? "dark bg-gray-900" : "bg-gray-100"} min-h-screen flex items-center justify-center`}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-16 h-16 mb-4 mx-auto border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <div className="text-2xl font-bold">
            <span className={isDarkMode ? "text-white" : "text-black"}>Loading Civic</span>
            <span className="text-blue-500">EYE</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "dark bg-gray-900" : "bg-gray-100"} min-h-screen transition-colors duration-300`}>
      <Toaster position="top-right" />
      
      {/* Navbar */}
      <nav className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-lg py-4 px-8 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300`}>
        <motion.h1
          className="text-2xl font-bold cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className={isDarkMode ? "text-white" : "text-black"}>Civic</span>
          <span className="text-blue-500">EYE</span>
          <Eye className="inline-block ml-2 text-blue-500" size={20} />
        </motion.h1>

        <ul className="hidden md:flex space-x-8">
          <li
            className={`cursor-pointer ${isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-500"} transition duration-300`}
            onClick={() => navigate("/complaintlist")}
          >
            My Complaints
          </li>
          <li
            className={`cursor-pointer ${isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-500"} transition duration-300`}
            onClick={scrollToAbout}
          >
            About
          </li>
          <li
            className={`cursor-pointer ${isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-500"} transition duration-300`}
            onClick={scrollToBottom}
          >
            Contact
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-300" />
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/registercomplaint")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 hidden md:block"
          >
            Report Issue
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="font-medium hidden md:block">
                {userData.name || "Account"}
              </span>
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 ${isDarkMode ? "bg-gray-700" : "bg-white"} shadow-lg rounded-lg border ${isDarkMode ? "border-gray-600" : "border-gray-200"} py-1 z-10`}>
                <Link
                  to="/userprofile"
                  className={`flex items-center px-4 py-2 ${isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-blue-50"} transition-colors duration-200`}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("id");
                    localStorage.removeItem("token");
                    setTimeout(() => {
                      toast.success("Logged out successfully");
                      navigate("/login");
                    }, 1000);
                  }}
                  className={`flex items-center w-full text-left px-4 py-2 ${isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-blue-50"} transition-colors duration-200`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg"
          onClick={() => navigate("/registercomplaint")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </motion.button>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {error && (
          <div className="container mx-auto py-16 px-6 text-center text-red-500">
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && (
          <>
            {/* Hero Section */}
            <header className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-28 md:py-32">
              <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://api.placeholder.com/400/320')] bg-cover bg-center"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-6xl mx-auto px-4 text-center"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Make Your Voice Heard!</h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                  Report Problems, Help Your City, and Earn Rewards!
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/registercomplaint")}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
                  >
                    <span>Register a Complaint</span>
                    <ArrowRight className="ml-2" size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/complaintlist")}
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-800 transition duration-300"
                  >
                    Track Existing Complaint
                  </motion.button>
                </div>
              </motion.div>

              {/* SVG Wave Effect */}
              <div className="absolute bottom-0 left-0 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill={isDarkMode ? "#111827" : "#f3f4f6"}>
                  <path d="M0,32L60,48C120,64,240,96,360,96C480,96,600,64,720,58.7C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
                </svg>
              </div>
            </header>

            {/* Stats Section */}
            <section className={`py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-center text-2xl md:text-3xl font-bold mb-8">Our Impact in Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { icon: <FileText className="text-blue-500" size={28} />, title: "Complaints Registered", value: "1,002" },
                    { icon: <Shield className="text-green-500" size={28} />, title: "Reports Filed", value: "992" },
                    { icon: <Users className="text-purple-500" size={28} />, title: "Rewards Distributed", value: "886" },
                    { icon: <Clock className="text-orange-500" size={28} />, title: "Avg. Resolution Time", value: "72 hrs" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"} p-6 rounded-xl text-center`}
                    >
                      <div className="flex justify-center mb-2">{stat.icon}</div>
                      <h3 className="text-2xl md:text-3xl font-bold">{stat.value}</h3>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{stat.title}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
              <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-center text-2xl md:text-3xl font-bold mb-12">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    {
                      icon: <FileText className="text-blue-500" size={32} />,
                      title: "Report",
                      description: "Submit your complaint with location, photos, and details",
                    },
                    {
                      icon: <Shield className="text-green-500" size={32} />,
                      title: "Verify",
                      description: "Our team verifies and forwards to authorities",
                    },
                    {
                      icon: <Activity className="text-purple-500" size={32} />,
                      title: "Track",
                      description: "Get real-time updates as your issue progresses",
                    },
                    {
                      icon: <Check className="text-orange-500" size={32} />,
                      title: "Resolve",
                      description: "Confirm resolution and rate the service",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg text-center relative`}
                    >
                      {index < 3 && (
                        <div className="hidden md:block absolute top-1/2 right-0 w-8 h-2 bg-blue-500 transform translate-x-1/2"></div>
                      )}
                      <div className="flex justify-center mb-4">{step.icon}</div>
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className={`py-16 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-center text-2xl md:text-3xl font-bold mb-12">What Our Users Say</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {latestFeedbacks.length > 0 ? (
                    latestFeedbacks.map((feedbackItem) => (
                      <motion.div
                        key={feedbackItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className={`${isDarkMode ? "bg-gray-700" : "bg-white"} p-6 rounded-xl shadow-lg`}
                      >
                        <div className="mb-4">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                        </div>
                        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} italic mb-4`}>
                          "{feedbackItem.description}"
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center font-bold">
                            {feedbackItem.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="font-semibold">{feedbackItem.userName}</p>
                            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {feedbackItem.timestamp}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className={`${isDarkMode ? "bg-gray-700" : "bg-white"} p-6 rounded-xl shadow-lg text-center col-span-2`}>
                      <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>No feedback available yet.</p>
                    </div>
                  )}

                  {/* Feedback Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className={`${isDarkMode ? "bg-gray-700" : "bg-white"} p-6 rounded-xl shadow-lg`}
                  >
                    <h4 className="text-xl font-semibold mb-4">Share Your Experience</h4>
                    <textarea
                      placeholder="Write your feedback"
                      name="description"
                      value={feedback.description || ""}
                      onChange={handlechange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${
                        isDarkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300"
                      }`}
                      rows="4"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlesubmit}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Submit Feedback
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
              <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-8 rounded-xl shadow-lg text-center`}
                >
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-4">Support Email</h4>
                  <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    For any assistance or inquiries about CivicEye
                  </p>
                  <a href="mailto:support@civiceye.com" className="font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                    support@civiceye.com
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-8 rounded-xl shadow-lg text-center`}
                >
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-4">Make A Call</h4>
                  <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Need immediate assistance or want to report an urgent issue?
                  </p>
                  <a href="tel:+1234567890" className="font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                    +123 456 7890
                  </a>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className={`py-12 ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-gray-200"}`}>
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      <span className="text-white">Civic</span>
                      <span className="text-blue-500">EYE</span>
                    </h3>
                    <p className="mb-4 text-sm">Empowering citizens to create better communities through technology and collaboration.</p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-blue-400 hover:text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-blue-400 hover:text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-blue-400 hover:text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/complaintlist" className="hover:text-blue-400">My Complaints</Link></li>
                      <li><button onClick={scrollToAbout} className="hover:text-blue-400">About</button></li>
                      <li><button onClick={scrollToBottom} className="hover:text-blue-400">Contact</button></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/registercomplaint" className="hover:text-blue-400">Report Issue</Link></li>
                      <li><Link to="/complaintlist" className="hover:text-blue-400">Track Complaints</Link></li>
                      <li><a href="#" className="hover:text-blue-400">Community Map</a></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Contact Info</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        (123) 456-7890
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        support@civiceye.com
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
                  <p>© {new Date().getFullYear()} CivicEye. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

export default CivicEyeUserHome;