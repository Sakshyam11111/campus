import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Profile from './Profile.jsx';
import { auth, db } from './Firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState(location.state?.profileData || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('Fetched profile data from Firestore:', data); 
            setProfileData(data);
          } else {
            navigate('/profile-setup');
          }
        } catch (error) {
          console.error('Error fetching profile from Firestore:', error);
          navigate('/profile-setup');
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    if (!profileData) {
      fetchProfile();
    } else {
      console.log('Profile data from state:', profileData); // Debug log
      setLoading(false);
    }
  }, [navigate, profileData]);

  const mockUser = {
    username: profileData?.name || 'User',
    email: profileData?.email || 'user@example.com'
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profileData) {
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