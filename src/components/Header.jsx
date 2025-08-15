import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, Calendar, Settings, LogOut, ChevronDown, Palette, Users, BookOpen } from 'lucide-react';
import { ThemeContext } from './ThemeContext';

const Header = ({ user, onLogout, setActiveTab }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

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
      navigate('/profile');
    } else if (action === 'theme') {
      toggleTheme();
    } else if (action === 'social') {
      setActiveTab('social');
    } else if (action === 'learning') {
      setActiveTab('learning');
    } else if (action === 'events') {
      setActiveTab('events');
    } else {
      console.log(`${action} clicked`);
    }
  };

  return (
    <header className={`shadow-lg border-b ${theme === 'colorful' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-600'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-500'}`}>
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent' : 'text-white'}`}>
                Texas Campus
              </h1>
              <p className={`text-xs ${theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'}`}>Connect • Learn • Grow</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-2 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 ${theme === 'colorful' ? 'hover:bg-gray-100 focus:ring-orange-500' : 'hover:bg-gray-700 focus:ring-gray-500'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-500'}`}>
                    <User className="text-white" size={16} />
                  </div>
                  <span className={`text-sm font-medium ${theme === 'colorful' ? 'text-gray-900' : 'text-white'}`}>{user.username}</span>
                  <ChevronDown 
                    className={`transition-transform duration-200 ${theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'} ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    size={16} 
                  />
                </button>
                
                {isDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 z-50 ${theme === 'colorful' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-600'}`}>
                    <button
                      onClick={() => handleMenuClick('profile')}
                      className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${theme === 'colorful' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('social')}
                      className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${theme === 'colorful' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
                    >
                      <Users size={16} />
                      <span>Social Hub</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('learning')}
                      className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${theme === 'colorful' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
                    >
                      <BookOpen size={16} />
                      <span>Learning Hub</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('events')}
                      className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${theme === 'colorful' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
                    >
                      <Calendar size={16} />
                      <span>Events</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('settings')}
                      className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${theme === 'colorful' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('theme')}
                      className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${theme === 'colorful' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
                    >
                      <Palette size={16} />
                      <span>Toggle Theme</span>
                    </button>
                    
                    <div className={`border-t my-1 ${theme === 'colorful' ? 'border-gray-100' : 'border-gray-600'}`}></div>
                    
                    <button
                      onClick={() => handleMenuClick('logout')}
                      className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${theme === 'colorful' ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-gray-700'}`}
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