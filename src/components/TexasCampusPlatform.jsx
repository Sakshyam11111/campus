import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from './Header.jsx';
import Navigation from './Navigation.jsx';
import SocialFeed from './SocialFeed.jsx';
import LearningHub from './LearningHub.jsx';
import Events from './Events.jsx';
import CareerHub from './CareerHub.jsx';
import ClubsHub from './ClubsHub.jsx';
import WellnessHub from './WellnessHub.jsx';
import LeftSidebar from './LeftSidebar.jsx';
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
  const [clubs, setClubs] = useState([]);
  const [careerResources, setCareerResources] = useState([]);
  const [wellnessResources, setWellnessResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/');
      } else {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        setUser({ ...currentUser, username });
      }
    });

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
        setClubs(data.clubs || []);
        setCareerResources(data.careerResources || []);
        setWellnessResources(data.wellnessResources || []);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSocialPosts([]);
        setCourses([]);
        setStudyGroups([]);
        setEventsData([]);
        setClubs([]);
        setCareerResources([]);
        setWellnessResources([]);
      });

    const interval = setInterval(() => {
      setIsOnline(prev => !prev);
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
  };

  const addPost = (postOrPosts) => {
    if (Array.isArray(postOrPosts)) {
      setSocialPosts(postOrPosts);
    } else {
      setSocialPosts(prev => [postOrPosts, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
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
            {activeTab === 'career' && <CareerHub careerResources={careerResources} events={eventsData.filter(event => event.type === 'career')} />}
            {activeTab === 'clubs' && <ClubsHub clubs={clubs} events={eventsData.filter(event => event.type === 'club')} />}
            {activeTab === 'wellness' && <WellnessHub wellnessResources={wellnessResources} events={eventsData.filter(event => event.type === 'wellness')} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TexasCampusPlatform;