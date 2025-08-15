import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { auth } from './Firebase'; // Import auth
import { onAuthStateChanged } from 'firebase/auth'; // Import for auth state listener
import Header from './Header.jsx';
import Navigation from './Navigation.jsx';
import SocialFeed from './SocialFeed.jsx';
import LearningHub from './LearningHub.jsx';
import Events from './Events.jsx';
import LeftSidebar from './LeftSidebar.jsx';
import RightSidebar from './RightSidebar.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const TexasCampusPlatform = () => {
  const [activeTab, setActiveTab] = useState('social');
  const [notifications, setNotifications] = useState(3);
  const [isOnline, setIsOnline] = useState(true);
  const [user, setUser] = useState(null);
  const [socialPosts, setSocialPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/'); // Redirect to login if not logged in
      } else {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        setUser({ ...currentUser, username });
      }
    });

    // Fetch data from JSON file (unchanged)
    fetch('/data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        return response.json();
      })
      .then(data => {
        setSocialPosts(data.socialPosts || []);
        setCourses(data.courses || []);
        setStudyGroups(data.studyGroups || []);
        setEventsData(data.events || []);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSocialPosts([]);
        setCourses([]);
        setStudyGroups([]);
        setEventsData([]);
      });

    const interval = setInterval(() => {
      setIsOnline(prev => !prev);
    }, 3000);

    return () => {
      unsubscribe(); // Clean up listener
      clearInterval(interval);
    };
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut(); // Firebase sign out (will trigger onAuthStateChanged redirect)
  };

  const addPost = (postOrPosts) => {
    if (Array.isArray(postOrPosts)) {
      setSocialPosts(postOrPosts); // Update entire posts array (for comments)
    } else {
      setSocialPosts(prev => [postOrPosts, ...prev]); // Add new post
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'colorful' ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50' : 'bg-gray-100'}`}>
      <Header 
        notifications={notifications} 
        isOnline={isOnline} 
        user={user} 
        onLogout={handleLogout}
        setActiveTab={setActiveTab}
      />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <LeftSidebar />
          <div className="flex-1">
            {activeTab === 'social' && (
              <ErrorBoundary>
                <SocialFeed posts={socialPosts} addPost={addPost} user={user} />
              </ErrorBoundary>
            )}
            {activeTab === 'learning' && <LearningHub courses={courses} studyGroups={studyGroups} />}
            {activeTab === 'events' && <Events events={eventsData} />}
          </div>
          <RightSidebar />
        </div>
      </main>
    </div>
  );
};

export default TexasCampusPlatform;