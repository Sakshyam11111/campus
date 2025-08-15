import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Users, BookOpen, Calendar } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <nav className={`shadow-sm border-b ${theme === 'colorful' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-600'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('social')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'social'
                ? theme === 'colorful'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-white text-white'
                : theme === 'colorful'
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
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
                ? theme === 'colorful'


                  ? 'border-blue-500 text-blue-600'
                  : 'border-white text-white'
                : theme === 'colorful'
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
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
                ? theme === 'colorful'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-white text-white'
                : theme === 'colorful'
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Events</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;