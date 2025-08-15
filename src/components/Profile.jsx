import React, { useState, useContext } from 'react';
import { User, Mail, BookOpen, Edit3, Camera, MapPin, Calendar, Badge } from 'lucide-react';

// Mock ThemeContext for demo
const ThemeContext = React.createContext({ theme: 'colorful' });

const Profile = ({ user = { username: 'Alex Johnson', email: 'alex.johnson@university.edu' } }) => {
  const { theme } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);
  
  const isDark = theme !== 'colorful';
  
  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-2xl border overflow-hidden max-w-md mx-auto`}>
      {/* Header with gradient background */}
      <div className={`${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600'} p-6 relative`}>
        {/* Profile Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-lg">
              <User size={40} className="text-white" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Camera size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Name and Title */}
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
          <p className="text-white/80 text-sm">Computer Science Student</p>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-blue-100'}`}>
              <Mail size={20} className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Email</p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-purple-100'}`}>
              <BookOpen size={20} className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Major</p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Computer Science</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-green-100'}`}>
              <Calendar size={20} className={`${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Year</p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Junior (3rd Year)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-orange-100'}`}>
              <MapPin size={20} className={`${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Campus</p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Main Campus</p>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>3.8</div>
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>GPA</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gradient-to-br from-purple-50 to-indigo-100'}`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>12</div>
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Courses</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              isDark 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Edit3 size={20} />
              <span>Edit Profile</span>
            </div>
          </button>
          
          <button className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200'
          }`}>
            View Academic Records
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper with theme context
export default function ProfileDemo() {
  return (
    <ThemeContext.Provider value={{ theme: 'colorful' }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <Profile />
      </div>
    </ThemeContext.Provider>
  );
}