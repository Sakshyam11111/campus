// App.jsx (Modified to pass user email to ProfileSetup)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import TexasCampusPlatform from './components/TexasCampusPlatform';
import Login from './components/Login';
import Signup from './components/Signup';
import ProfilePage from './components/ProfilePage';
import LandingPage from './components/LandingPage';
import ProfileSetup from './components/forms/ProfileSetup';
import { auth } from './components/Firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || '');
        console.log('Authenticated user email:', user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<TexasCampusPlatform />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile-setup" element={<ProfileSetup userEmail={userEmail} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;