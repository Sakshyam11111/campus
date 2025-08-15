import React, { useState, useContext } from 'react';
import { User, Mail, BookOpen, Edit3, Camera, MapPin, Calendar, Award, GraduationCap, Users, Clock } from 'lucide-react';

// Mock ThemeContext for demo
const ThemeContext = React.createContext({ theme: 'colorful' });

const Profile = ({ user = { username: 'Alex Johnson', email: 'alex.johnson@university.edu' } }) => {
  const { theme } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);
  
  const isDark = theme !== 'colorful';
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border overflow-hidden`}>
        
        {/* Header Section */}
        <div className={`${isDark ? 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700'} p-8 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-2xl">
                  <User size={60} className="text-white" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Camera size={20} className="text-gray-600" />
                </button>
              </div>
              
              {/* Basic Info */}
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
                <p className="text-white/90 text-xl mb-1">Computer Science Student</p>
                <p className="text-white/80 text-lg">Junior Year • Main Campus</p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <Award size={18} className="text-yellow-400" />
                    <span className="text-white/90">Dean's List</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap size={18} className="text-green-400" />
                    <span className="text-white/90">Expected Graduation: 2025</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
              >
                <Edit3 size={20} />
                <span>Edit Profile</span>
              </button>
              <button className="px-6 py-3 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300">
                View Transcript
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contact & Personal Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} hover:shadow-md transition-all duration-200`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-blue-100'}`}>
                        <Mail size={20} className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} hover:shadow-md transition-all duration-200`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-green-100'}`}>
                        <MapPin size={20} className={`${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>New York, NY</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} hover:shadow-md transition-all duration-200`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-purple-100'}`}>
                        <BookOpen size={20} className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Major</p>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Computer Science</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} hover:shadow-md transition-all duration-200`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-orange-100'}`}>
                        <Calendar size={20} className={`${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Year</p>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Junior (3rd Year)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-blue-50'} border-l-4 border-blue-500`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Enrolled in Advanced Algorithms</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Course Registration</p>
                      </div>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>2 days ago</span>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-green-50'} border-l-4 border-green-500`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Submitted Final Project</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Database Systems Course</p>
                      </div>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1 week ago</span>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-purple-50'} border-l-4 border-purple-500`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Made Dean's List</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Spring 2024 Semester</p>
                      </div>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>2 weeks ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Academic Stats */}
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Academic Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-6 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
                    <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>3.8</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Current GPA</div>
                  </div>
                  
                  <div className={`p-6 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gradient-to-br from-purple-50 to-indigo-100'}`}>
                    <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>98</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Credit Hours</div>
                  </div>
                  
                  <div className={`p-6 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gradient-to-br from-green-50 to-teal-100'}`}>
                    <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>5</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>This Semester</div>
                  </div>
                  
                  <div className={`p-6 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gradient-to-br from-orange-50 to-amber-100'}`}>
                    <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>42</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Remaining</div>
                  </div>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:shadow-md ${isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <div className="flex items-center space-x-3">
                      <Clock size={20} className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>View Schedule</span>
                    </div>
                  </button>
                  
                  <button className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:shadow-md ${isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <div className="flex items-center space-x-3">
                      <BookOpen size={20} className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Course Catalog</span>
                    </div>
                  </button>
                  
                  <button className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:shadow-md ${isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <div className="flex items-center space-x-3">
                      <Users size={20} className={`${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Study Groups</span>
                    </div>
                  </button>
                  
                  <button className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:shadow-md ${isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <div className="flex items-center space-x-3">
                      <Award size={20} className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Achievements</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper with theme context
export default function ProfileDemo() {
  return (
    <ThemeContext.Provider value={{ theme: 'colorful' }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <Profile />
      </div>
    </ThemeContext.Provider>
  );
}