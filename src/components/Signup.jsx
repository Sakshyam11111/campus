import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleSignup = (e) => {
    e.preventDefault();
    // Mock signup: store in localStorage
    const newUser = { username, password, email };
    localStorage.setItem('user', JSON.stringify(newUser));
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'colorful' ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50' : 'bg-gray-100'}`}>
      <div className={`${theme === 'colorful' ? 'bg-white' : 'bg-gray-800'} p-8 rounded-2xl shadow-lg w-96`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'colorful' ? 'text-gray-900' : 'text-white'}`}>Signup for Texas Campus</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className={`w-full p-3 mb-4 border ${theme === 'colorful' ? 'border-gray-200' : 'border-gray-600'} rounded-lg ${theme === 'colorful' ? 'bg-white' : 'bg-gray-700 text-white'}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 mb-4 border ${theme === 'colorful' ? 'border-gray-200' : 'border-gray-600'} rounded-lg ${theme === 'colorful' ? 'bg-white' : 'bg-gray-700 text-white'}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 mb-4 border ${theme === 'colorful' ? 'border-gray-200' : 'border-gray-600'} rounded-lg ${theme === 'colorful' ? 'bg-white' : 'bg-gray-700 text-white'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={`w-full ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-500'} text-white py-3 rounded-lg hover:${theme === 'colorful' ? 'opacity-90' : 'bg-gray-600'} transition-opacity`}>
            Signup
          </button>
        </form>
        <p className={`mt-4 text-center ${theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'}`}>
          Already have an account? <Link to="/" className={`${theme === 'colorful' ? 'text-orange-600 hover:underline' : 'text-gray-300 hover:text-white'}`}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;