import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { auth, googleProvider } from './Firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { GraduationCap } from 'lucide-react';

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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    <div className={`min-h-screen flex items-center justify-center bg-cover bg-center ${theme === 'colorful' ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50' : 'bg-gray-900'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${theme === 'colorful' ? 'bg-white/90 backdrop-blur-md' : 'bg-gray-800/90 backdrop-blur-md'}`}>
        <div className="flex flex-col items-center mb-6">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-600'}`}>
            <GraduationCap className="text-white" size={24} />
          </div>
          <h2 className={`mt-3 text-3xl font-bold text-center ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent' : 'text-white'}`}>
            Texas Campus
          </h2>
          <p className={`text-sm ${theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'}`}>Login to Connect • Learn • Grow</p>
        </div>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm animate-pulse" role="alert">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${theme === 'colorful' ? 'text-gray-700' : 'text-gray-300'}`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`mt-1 w-full p-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-offset-2 ${theme === 'colorful' ? 'border-gray-300 focus:ring-orange-500 bg-white' : 'border-gray-600 focus:ring-gray-500 bg-gray-700 text-white'} ${errors.email ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${theme === 'colorful' ? 'text-gray-700' : 'text-gray-300'}`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`mt-1 w-full p-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-offset-2 ${theme === 'colorful' ? 'border-gray-300 focus:ring-orange-500 bg-white' : 'border-gray-600 focus:ring-gray-500 bg-gray-700 text-white'} ${errors.password ? 'border-red-500' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-red-500 text-xs mt-1" role="alert">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90' : 'bg-gray-600 hover:bg-gray-500'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="mt-6">
          <div className={`flex items-center ${theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'}`}>
            <hr className="flex-1 border-gray-300" />
            <span className="px-3">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>
          <button
            onClick={handleGoogleLogin}
            className={`mt-4 w-full flex items-center justify-center py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${theme === 'colorful' ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100' : 'bg-gray-700 border border-gray-600 text-white hover:bg-gray-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
            aria-label="Login with Google"
          >
            <FcGoogle size={24} className="mr-2" />
            Login with Google
          </button>
        </div>
        <p className={`mt-6 text-center text-sm ${theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'}`}>
          Don't have an account?{' '}
          <Link to="/signup" className={`${theme === 'colorful' ? 'text-orange-600 hover:underline' : 'text-gray-300 hover:text-white'} font-medium`}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;