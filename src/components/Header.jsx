import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, Calendar, Settings, LogOut, ChevronDown, Users, BookOpen, Briefcase, Heart } from 'lucide-react';

const Header = ({ user, onLogout, setActiveTab }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (action) => {
    setIsDropdownOpen(false);
    if (action === 'logout') {
      onLogout();
    } else if (action === 'profile') {
      navigate('/profile-setup'); // Redirect to ProfileSetup instead of Profile
    } else if (action === 'social') {
      setActiveTab('social');
    } else if (action === 'learning') {
      setActiveTab('learning');
    } else if (action === 'events') {
      setActiveTab('events');
    } else if (action === 'career') {
      setActiveTab('career');
    } else if (action === 'clubs') {
      setActiveTab('clubs');
    } else if (action === 'wellness') {
      setActiveTab('wellness');
    } else {
      console.log(`${action} clicked`);
    }
  };

  return (
    <header className="shadow-lg border-b bg-white border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center space-x-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg p-1 transition-all hover:opacity-90"
            aria-label="Go to dashboard"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Texas Campus
              </h1>
              <p className="text-xs text-gray-500">Connect • Learn • Grow</p>
            </div>
          </button>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 hover:bg-gray-100 focus:ring-orange-500"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600">
                    <User className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user.username}</span>
                  <ChevronDown 
                    className="text-gray-500 transition-transform duration-200"
                    size={16} 
                  />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 z-50 bg-white border-gray-200">
                    <button
                      onClick={() => handleMenuClick('profile')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors text-gray-700 hover:bg-gray-100"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('social')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors text-gray-700 hover:bg-gray-100"
                    >
                      <Users size={16} />
                      <span>Social Hub</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('learning')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors text-gray-700 hover:bg-gray-100"
                    >
                      <BookOpen size={16} />
                      <span>Learning Hub</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('events')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors text-gray-700 hover:bg-gray-100"
                    >
                      <Calendar size={16} />
                      <span>Events</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('career')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors text-gray-700 hover:bg-gray-100"
                    >
                      <Briefcase size={16} />
                      <span>Career Hub</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('clubs')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors text-gray-700 hover:bg-gray-100"
                    >
                      <Users size={16} />
                      <span>Clubs Hub</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('wellness')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors text-gray-700 hover:bg-gray-100"
                    >
                      <Heart size={16} />
                      <span>Wellness Hub</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('settings')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    
                    <div className="border-t my-1 border-gray-100"></div>
                    
                    <button
                      onClick={() => handleMenuClick('logout')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;