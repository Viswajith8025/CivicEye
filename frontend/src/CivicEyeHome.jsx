import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Search, ArrowRight, Eye, Shield, Users, Clock, FileText, Check, Smartphone, Award, HelpCircle, Bell } from "lucide-react";
import logo from "./assets/celogofull.png";

export const CivicEyeHome = () => {
  const scrollToBottom = () => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header - Enhanced with better styling and animations */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between py-4 px-6 gap-x-10 max-w-7xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img src={logo} alt="CivicEye Logo" className="h-8" />
          </motion.div>
          
          <nav className="hidden md:flex gap-8 text-gray-700">
            <motion.div whileHover={{ y: -2 }}>
              <Link to="/complaints" className="hover:text-blue-500 transition duration-300">
                My Complaints
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Link to="/about" className="hover:text-blue-500 transition duration-300">
                About
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <button onClick={scrollToBottom} className="hover:text-blue-500 transition duration-300">
                Contact
              </button>
            </motion.div>
          </nav>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-600 transition duration-300">
                Login
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                  Sign Up
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced with gradient and wave effect */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-28 md:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://source.unsplash.com/1600x800/?city,community')] bg-cover bg-center"></div>
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
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2" size={18} />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToBottom}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-800 transition duration-300"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>

        {/* SVG Wave Effect */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#f3f4f6">
            <path d="M0,32L60,48C120,64,240,96,360,96C480,96,600,64,720,58.7C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section - Enhanced with icons and animations */}
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-center text-2xl md:text-3xl font-semibold mb-8">
          Complaint Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: "📝", title: "Complaints Registered", value: "1,002" },
            { icon: "📊", title: "Reports Filed", value: "992" },
            { icon: "🏆", title: "Rewards Distributed", value: "886" },
            { icon: "💪", title: "Problems Solved", value: "752" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white shadow-lg p-6 rounded-lg text-center"
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <p className="text-lg font-semibold mb-2">{stat.title}</p>
              <p className="text-3xl font-bold text-blue-500">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What We Do Section - Enhanced with icons and better layout */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-2xl md:text-3xl font-semibold mb-8">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                icon: <Smartphone className="text-blue-500 mx-auto" size={40} />, 
                title: "Register the Complaint", 
                description: "Submit issues with photos and location details." 
              },
              { 
                icon: <Check className="text-blue-500 mx-auto" size={40} />, 
                title: "Verification Process", 
                description: "Our team verifies and forwards to authorities." 
              },
              { 
                icon: <Bell className="text-blue-500 mx-auto" size={40} />, 
                title: "Authority Review", 
                description: "Responsible authorities review the complaint." 
              },
              { 
                icon: <Award className="text-blue-500 mx-auto" size={40} />, 
                title: "Issue Resolved", 
                description: "Your problem gets solved and complaint processed." 
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white shadow-lg p-6 rounded-lg text-center"
              >
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced with better cards and rating */}
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-center text-2xl md:text-3xl font-semibold mb-8">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "This is an awesome website. Simplifies the complaint registration process.",
              author: "Jason Miller",
              rating: 5,
            },
            {
              quote: "Got my neighborhood potholes fixed within a week. Very efficient system!",
              author: "Sarah Johnson",
              rating: 5,
            },
            {
              quote: "The reward system is great motivation to report community issues.",
              author: "Mike Thomas",
              rating: 4,
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white shadow-lg p-6 rounded-lg"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{testimonial.author}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section - Enhanced with better layout */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white shadow-lg p-6 rounded-lg text-center"
          >
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-4">Support Mail</h4>
            <p className="mb-4">
              For any assistance or inquiries about reporting issues using Civic Eye
            </p>
            <a href="mailto:support@civiceye.com" className="font-semibold text-blue-500 hover:text-blue-600 transition duration-300">
              support@civiceye.com
            </a>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white shadow-lg p-6 rounded-lg text-center"
          >
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-4">Make A Call</h4>
            <p className="mb-4">
              Need immediate assistance or want to report an urgent issue?
            </p>
            <a href="tel:+1234567890" className="font-semibold text-blue-500 hover:text-blue-600 transition duration-300">
              +123 456 7890
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer - Enhanced with better layout and links */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="CivicEye Logo" className="h-8 mb-4" />
            <p className="text-sm mb-4">
              Making communities better through citizen engagement and problem reporting.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-400 hover:text-blue-300 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link></li>
              <li><Link to="/complaints" className="text-gray-400 hover:text-white transition duration-300">My Complaints</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition duration-300">About</Link></li>
              <li><button onClick={scrollToBottom} className="text-gray-400 hover:text-white transition duration-300">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Company</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Our Team</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Contact Info</h5>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={16} className="mr-2" />
                <span>123 Civic Way, Community City</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+123 456 7890</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>info@civiceye.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          © {new Date().getFullYear()} CivicEye. All rights reserved. | Empowering Citizens, Improving Communities
        </div>
      </footer>
    </div>
  );
};