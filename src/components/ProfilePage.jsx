import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Profile from './Profile.jsx';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileData = location.state?.profileData || null;

  // Mock user for Header component
  const mockUser = {
    username: profileData?.name || 'User',
    email: profileData?.email || 'user@example.com'
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (!profileData) {
    // Redirect to profile setup if no data is provided
    navigate('/profile-setup');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header user={mockUser} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Profile user={mockUser} profileData={profileData} />
      </main>
    </div>
  );
};

export default ProfilePage;