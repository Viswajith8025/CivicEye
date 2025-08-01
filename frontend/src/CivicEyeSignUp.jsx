import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/celogofull.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Sun, Moon, Eye, EyeOff, Loader2 } from "lucide-react";

export const CivicEyeSignUp = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: "",
    mobile: "",
    age: "",
    email: "",
    password: ""
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const handleChange = (event) => {
    setSignupData({ ...signupData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      console.table(signupData);
      const response = await axios.post(
        "https://civiceye-backend-7le4.onrender.com/user/register",
        signupData
      );
      console.log(response.data);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <Toaster position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden`}
      >
        {/* Left Section - Branding */}
        <div className={`w-full md:w-1/2 p-8 flex flex-col justify-center items-center ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} transition-colors duration-300`}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src={logo} alt="CivicEye Logo" className="h-12 mb-6" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-2xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          >
            Join Civic<span className="text-blue-500">EYE</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-center mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Create your account to start reporting and tracking public issues
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 w-full max-w-xs"
          >
            <div className={`h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-blue-200'} overflow-hidden`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-blue-500"
              />
            </div>
          </motion.div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold"
            >
              SIGN <span className="text-blue-500">UP</span>
            </motion.h2>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun size={18} className="text-yellow-300" />
              ) : (
                <Moon size={18} className="text-gray-700" />
              )}
            </motion.button>
          </div>

          <form className="mt-2" onSubmit={handleSubmit}>
            {[
              { name: "name", type: "text", placeholder: "Full Name", required: true },
              { name: "mobile", type: "text", placeholder: "Mobile Number", required: true },
              { 
                name: "age", 
                type: "text", 
                placeholder: "Date of Birth",
                onFocus: (e) => (e.target.type = "date"),
                onBlur: (e) => e.target.value === "" && (e.target.type = "text"),
                required: true 
              },
              { name: "email", type: "email", placeholder: "Email Address", required: true },
              { 
                name: "password", 
                type: showPassword ? "text" : "password", 
                placeholder: "Password",
                extra: (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                ),
                required: true 
              }
            ].map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="mb-4"
              >
                <label htmlFor={field.name} className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field.placeholder}
                </label>
                <div className="relative">
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 
                      'bg-white border-gray-300 text-black placeholder-gray-500'
                    }`}
                    onFocus={field.onFocus}
                    onBlur={field.onBlur}
                    required={field.required}
                  />
                  {field.extra}
                </div>
              </motion.div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Registering...
                </div>
              ) : (
                "SIGN UP"
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`text-center text-sm mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
            >
              Sign in
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};