// Header.jsx (Updated to receive user prop and logout)
import React from 'react';
import { GraduationCap, Search, Bell, LogOut } from 'lucide-react';

const Header = ({ notifications, isOnline, user, onLogout }) => (
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search campus..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
            <Bell size={24} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {notifications}
              </span>
            )}
          </button>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} transition-colors`}></div>
            <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">{user.username}</span>
              <button onClick={onLogout} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
);

export default Header;