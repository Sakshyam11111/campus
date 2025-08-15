import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, User, Calendar, Settings, LogOut, ChevronDown } from 'lucide-react';

const Header = ({ isOnline, user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
    }
    // Add other menu actions here as needed
    console.log(`${action} clicked`);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Texas Campus
              </h1>
              <p className="text-xs text-gray-500">Connect • Learn • Grow</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} transition-colors`}></div>
              <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user.username}</span>
                  <ChevronDown 
                    className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    size={16} 
                  />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => handleMenuClick('profile')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('events')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Calendar size={16} />
                      <span>Events</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('settings')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={() => handleMenuClick('logout')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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

// Demo component to show the header in action
const HeaderDemo = () => {
  const [user, setUser] = useState({ username: 'John Doe' });
  const [isOnline, setIsOnline] = useState(true);

  const handleLogout = () => {
    console.log('Logging out...');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isOnline={isOnline}
        user={user}
        onLogout={handleLogout}
      />
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-4">Header Demo</h2>
        <div className="space-y-2">
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle Online Status
          </button>
          <button 
            onClick={() => setUser(user ? null : { username: 'John Doe' })}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
          >
            Toggle User
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderDemo;