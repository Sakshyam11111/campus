// Navigation.jsx (Updated with profile tab)
import React from 'react';
import { Users, BookOpen, Calendar, User } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => (
  <nav className="bg-white shadow-sm border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex space-x-8">
        <button
          onClick={() => setActiveTab('social')}
          className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'social'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Users size={20} />
            <span>Social Hub</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('learning')}
          className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'learning'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BookOpen size={20} />
            <span>Learning Hub</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'events'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Calendar size={20} />
            <span>Events</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'profile'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <User size={20} />
            <span>Profile</span>
          </div>
        </button>
      </div>
    </div>
  </nav>
);

export default Navigation;