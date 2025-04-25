import React, { useState } from "react";
import axios from "axios";

function RegisterForm() {
  // Removed phone as it is no longer required
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9000/register-florist", formData);
      setStatus(response.data.msg || "Registration successful!");
      setFormData({
        name: "",
        email: "",
        location: "",
      }); // reset form after success
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        setStatus("Error: " + error.response.data.msg);
      } else {
        setStatus("Error: " + error.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e0f7e0]">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Florist Store Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
          >
            Sign Up
          </button>

          {/* Status Message */}
          {status && (
            <p className={`mt-4 text-center ${status.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
