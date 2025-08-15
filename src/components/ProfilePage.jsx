import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { auth } from './Firebase'; // Import auth
import { onAuthStateChanged } from 'firebase/auth'; // Import for auth state listener
import Header from './Header.jsx';
import Profile from './Profile.jsx';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/'); // Redirect if not logged in
      } else {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        setUser({ ...currentUser, username });
      }
    });

    return () => unsubscribe(); // Clean up
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut(); // Firebase sign out
  };

  return (
    <div className={`min-h-screen ${theme === 'colorful' ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50' : 'bg-gray-100'}`}>
      <Header user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && <Profile user={user} />}
      </main>
    </div>
  );
};

export default ProfilePage;