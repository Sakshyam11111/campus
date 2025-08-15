// src/components/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Texas Campus</h1>
      <p className="text-lg text-gray-600 mb-8">Connect • Learn • Grow</p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:opacity-90"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:opacity-90"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
