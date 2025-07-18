import React from 'react'
import logo from "./assets/celogofull.png"

export const CivicEyeAboutPage = () => {
  return (
    <div>
        <div><header className="bg-white shadow-md sticky top-0 z-50">
              <div className="flex items-center justify-between py-4 px-6 gap-x-10">
                <img src={logo} alt="CivicEye Logo" className='h-6'/>
              {/* <h1 className="text-2xl font-bold text-blue-600">Civic<span className="text-black">EYE</span></h1> */}
                  <nav className="flex gap-6 text-gray-700">
                    <a href="#" className="hover:text-blue-500">Home</a>
                    <a href="#" className="hover:text-blue-500">My Complaints</a>
                    {/* <a href="#" className="hover:text-blue-500">About</a> */}
                    </nav>
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">Sign up</button>
                </div>
              </header></div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About Our Platform</h1> 
        <p className="text-gray-600 mb-4">
          Our Citizen Complaints and Reporting Web Application empowers civilians to actively participate in improving public infrastructure and services. 
          By allowing users to upload complaints with photographic or video evidence, we bridge the gap between citizens and authorities.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Key Features</h2>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
          <li>Upload complaints with photo/video evidence</li>
          <li>Track complaint status through user accounts</li>
          <li>Transparency and accountability in complaint resolution</li>
          <li>Incentives: Earn 20% of fines collected after resolution</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Our Mission</h2>
        <p className="text-gray-600 mt-2">
          We aim to create a transparent and accountable system where citizens and authorities work together to improve public services and infrastructure.
        </p>
      </div>
    </div>
    </div>
  )
}
