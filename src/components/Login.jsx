import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { auth, googleProvider } from './Firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', general: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        console.log('Attempting email login with:', { email });
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in:', userCredential.user);
        navigate('/dashboard');
      } catch (err) {
        console.error('Login error:', err);
        let errorMessage = err.message;
        if (err.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed attempts. Please try again later.';
        }
        setErrors(prev => ({ ...prev, general: errorMessage }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setErrors({ email: '', password: '', general: '' });
    setLoading(true);
    try {
      console.log('Attempting Google login');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google user logged in:', result.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setErrors(prev => ({
          ...prev,
          general: 'This email is registered with a different method. Try another login option.',
        }));
      } else {
        setErrors(prev => ({ ...prev, general: err.message }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'colorful' ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50' : 'bg-gray-100'}`}>
      <div className={`${theme === 'colorful' ? 'bg-white' : 'bg-gray-800'} p-8 rounded-2xl shadow-lg w-96`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'colorful' ? 'text-gray-900' : 'text-white'}`}>Login to Texas Campus</h2>
        {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
        <div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 border ${errors.email ? 'border-red-500' : theme === 'colorful' ? 'border-gray-200' : 'border-gray-600'} rounded-lg ${theme === 'colorful' ? 'bg-white' : 'bg-gray-700 text-white'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
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
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="button"
            onClick={handleEmailLogin}
            className={`w-full ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-500'} text-white py-3 rounded-lg hover:${theme === 'colorful' ? 'opacity-90' : 'bg-gray-600'} transition-opacity`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center ${theme === 'colorful' ? 'bg-white border border-gray-300' : 'bg-gray-700 border border-gray-600'} text-${theme === 'colorful' ? 'gray-700' : 'white'} py-3 rounded-lg hover:${theme === 'colorful' ? 'bg-gray-100' : 'bg-gray-600'} transition-opacity`}
            disabled={loading}
          >
            <FcGoogle size={24} className="mr-2" />
            Login with Google
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