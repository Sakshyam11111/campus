import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Directly navigate to dashboard without validation
    localStorage.setItem('user', JSON.stringify({ email, password }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Texas Campus</h2>
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={handleLogin} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg">
            Login
          </button>
        </div>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-orange-600">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;