import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      localStorage.setItem('user', JSON.stringify({ email, password }));
      navigate('/dashboard');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'colorful' ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50' : 'bg-gray-100'}`}>
      <div className={`${theme === 'colorful' ? 'bg-white' : 'bg-gray-800'} p-8 rounded-2xl shadow-lg w-96`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'colorful' ? 'text-gray-900' : 'text-white'}`}>Login to Texas Campus</h2>
        <div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 border ${errors.email ? 'border-red-500' : theme === 'colorful' ? 'border-gray-200' : 'border-gray-600'} rounded-lg ${theme === 'colorful' ? 'bg-white' : 'bg-gray-700 text-white'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-3 border ${errors.password ? 'border-red-500' : theme === 'colorful' ? 'border-gray-200' : 'border-gray-600'} rounded-lg ${theme === 'colorful' ? 'bg-white' : 'bg-gray-700 text-white'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className={`w-full ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-500'} text-white py-3 rounded-lg hover:${theme === 'colorful' ? 'opacity-90' : 'bg-gray-600'} transition-opacity`}
          >
            Login
          </button>
        </div>
        <p className={`mt-4 text-center ${theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'}`}>
          Don't have an account? <Link to="/signup" className={`${theme === 'colorful' ? 'text-orange-600 hover:underline' : 'text-gray-300 hover:text-white'}`}>Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;