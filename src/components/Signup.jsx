import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { auth, db, googleProvider } from './Firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.log('Attempting email signup with:', { email, username });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user);

      await updateProfile(user, { displayName: username });
      console.log('Profile updated with username:', username);

      // Optional: Store user data in Firestore (comment out if Firestore errors persist)
      try {
        await setDoc(doc(db, 'users', user.uid), {
          username,
          email,
          createdAt: new Date().toISOString(),
        });
        console.log('User data stored in Firestore');
      } catch (firestoreErr) {
        console.error('Firestore error:', firestoreErr);
        // Continue despite Firestore error to allow signup
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in or use a different email.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      console.log('Attempting Google signup');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google user signed in:', user);

      // Optional: Store user data in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          username: user.displayName || user.email.split('@')[0],
          email: user.email,
          createdAt: new Date().toISOString(),
        });
        console.log('Google user data stored in Firestore');
      } catch (firestoreErr) {
        console.error('Firestore error:', firestoreErr);
        // Continue despite Firestore error
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Google signup error:', err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('This email is already registered with a different method. Please log in instead.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'colorful' ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50' : 'bg-gray-100'}`}>
      <div className={`${theme === 'colorful' ? 'bg-white' : 'bg-gray-800'} p-8 rounded-2xl shadow-lg w-96`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'colorful' ? 'text-gray-900' : 'text-white'}`}>Signup for Texas Campus</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleEmailSignup}>
          <input
            type="text"
            placeholder="Username"
            className={`w-full p-3 mb-4 border ${theme === 'colorful' ? 'border-gray-200' : 'border-gray-600'} rounded-lg ${theme === 'colorful' ? 'bg-white' : 'bg-gray-700 text-white'}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 mb-4 border ${theme === 'colorful' ? 'border-gray-200' : 'border-gray-600'} rounded-lg ${theme === 'colorful' ? 'bg-white' : 'bg-gray-700 text-white'}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 mb-4 border ${theme === 'colorful' ? 'border-gray-200' : 'border-gray-600'} rounded-lg ${theme === 'colorful' ? 'bg-white' : 'bg-gray-700 text-white'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className={`w-full ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-500'} text-white py-3 rounded-lg hover:${theme === 'colorful' ? 'opacity-90' : 'bg-gray-600'} transition-opacity`}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleSignup}
            className={`w-full flex items-center justify-center ${theme === 'colorful' ? 'bg-white border border-gray-300' : 'bg-gray-700 border border-gray-600'} text-gray-700 py-3 rounded-lg hover:${theme === 'colorful' ? 'bg-gray-100' : 'bg-gray-600'} transition-opacity`}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.24 10.4V14h3.2c-.2 1-.8 1.9-1.6 2.6l2.6 2c1.5-1.4 2.4-3.4 2.4-5.6 0-.6-.1-1.2-.2-1.8h-6.4z"
              />
              <path
                fill="#EA4335"
                d="M12 22c-2.7 0-5-1.8-5.9-4.3l-2.6 2C5.1 21.6 8.3 24 12 24c2.7 0 5.1-1 6.9-2.6l-2.6-2c-.8.7-1.8 1.1-2.9 1.1z"
              />
              <path
                fill="#34A853"
                d="M5.9 13.7C5.7 13.1 5.6 12.6 5.6 12s.1-1.1.3-1.7l-2.6-2C2.5 9.7 2 10.8 2 12s.5 2.3 1.3 3.1l2.6-2.4z"
              />
              <path
                fill="#4285F4"
                d="M12 6c1.6 0 3 .6 4.1 1.6l3-3C17.1 2.7 14.7 2 12 2 8.3 2 5.1 4.4 3.5 6.3l2.6 2c.9-2.5 3.2-4.3 5.9-4.3z"
              />
            </svg>
            Sign up with Google
          </button>
        </div>
        <p className={`mt-4 text-center ${theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'}`}>
          Already have an account? <Link to="/" className={`${theme === 'colorful' ? 'text-orange-600 hover:underline' : 'text-gray-300 hover:text-white'}`}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;