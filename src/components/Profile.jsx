import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, BookOpen, Edit3, Camera, MapPin, Award, GraduationCap, 
  Users, Clock, Upload, X, Check, Save, Calendar, Trophy, Target, 
  Star, Zap, Phone, Globe, Instagram, Twitter, Linkedin
} from 'lucide-react';

const Profile = ({ user }) => {
  const [isDark, setIsDark] = useState(true); // Toggle for dark/light theme
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    username: user?.username || 'Alex Rodriguez',
    email: user?.email || 'alex.rodriguez@university.edu',
    major: 'Computer Science & Data Analytics',
    year: 'Junior Year',
    campus: 'Main Campus',
    location: 'Kathmandu, NP',
    phone: '+ (977) 123-456-789',
    website: 'alexrodriguez.dev',
    gpa: '3.85',
    creditHours: '98',
    currentCourses: '5',
    remainingHours: '42',
    expectedGraduation: 'Spring 2025',
    bio: 'Passionate computer science student with expertise in machine learning and web development. Currently working on AI-powered educational tools.',
    socialMedia: {
      linkedin: 'sakshyam-css',
      twitter: '@sakshyamcss',
      instagram: '@s.a.k.s.h.y.a.m'
    },
    achievements: [
      { id: 1, title: 'Joined Advanced Machine Learning Course', date: '2 days ago', type: 'course' },
      { id: 2, title: 'Made Dean\'s List for Fall 2024', date: '1 week ago', type: 'academic' },
      { id: 3, title: 'Won Hackathon - Best AI Solution', date: '2 weeks ago', type: 'competition' },
      { id: 4, title: 'Published Research Paper', date: '3 weeks ago', type: 'research' },
    ],
    skills: ['Python', 'React', 'Machine Learning', 'Node.js', 'SQL', 'TensorFlow'],
    interests: ['AI Research', 'Web Development', 'Data Science', 'Photography']
  });
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setIsImageUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setIsImageUploading(false);
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getAchievementIcon = (type) => {
    switch(type) {
      case 'course': return <BookOpen size={16} className="text-blue-400" />;
      case 'academic': return <Award size={16} className="text-yellow-400" />;
      case 'competition': return <Trophy size={16} className="text-purple-400" />;
      case 'research': return <Star size={16} className="text-green-400" />;
      default: return <Zap size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Success/Error Messages */}
        {(error || successMessage) && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${
            error 
              ? isDark ? 'bg-red-900/20 border-red-500/30' : 'bg-red-100/50 border-red-300/50'
              : isDark ? 'bg-green-900/20 border-green-500/30' : 'bg-green-100/50 border-green-300/50'
          }`}>
            {error ? (
              <X size={20} className={isDark ? 'text-red-400' : 'text-red-600'} />
            ) : (
              <Check size={20} className={isDark ? 'text-green-400' : 'text-green-600'} />
            )}
            <span className={error ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-green-400' : 'text-green-600')}>
              {error || successMessage}
            </span>
          </div>
        )}

        {/* Main Profile Card */}
        <div className={`bg-${isDark ? 'slate-800/80' : 'white/90'} backdrop-blur-xl rounded-3xl shadow-2xl border ${isDark ? 'border-slate-700/30' : 'border-gray-200/50'} overflow-hidden`}>
          
          {/* Header Section */}
          <div className={`relative bg-gradient-to-r ${isDark ? 'from-blue-900 to-purple-900' : 'from-blue-200 to-purple-200'} p-8`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
                    <div className={`w-full h-full bg-gradient-to-br ${isDark ? 'from-white/10 to-white/5' : 'from-gray-100 to-gray-200'} rounded-full flex items-center justify-center backdrop-blur-sm border-4 ${isDark ? 'border-white/20' : 'border-gray-300/50'} shadow-2xl overflow-hidden`}>
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={48} className={isDark ? 'text-white' : 'text-gray-600'} />
                      )}
                    </div>
                    
                    {/* Image Upload Button */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImageUploading}
                      className={`absolute -bottom-2 -right-2 w-12 h-12 ${isDark ? 'bg-white' : 'bg-gray-100'} rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50`}
                    >
                      {isImageUploading ? (
                        <div className={`w-5 h-5 border-2 ${isDark ? 'border-gray-400 border-t-transparent' : 'border-gray-600 border-t-transparent'} rounded-full animate-spin`}></div>
                      ) : (
                        <Camera size={20} className={isDark ? 'text-gray-700' : 'text-gray-800'} />
                      )}
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="text-center lg:text-left flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className={`text-3xl lg:text-4xl font-bold mb-3 ${isDark ? 'bg-transparent border-b-2 border-white/50 focus:border-white text-white placeholder-white/50' : 'bg-transparent border-b-2 border-gray-400 focus:border-gray-600 text-gray-800 placeholder-gray-500'}`}
                      placeholder="Your Name"
                    />
                  ) : (
                    <h1 className={`text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r ${isDark ? 'from-white to-gray-300' : 'from-gray-800 to-gray-600'} bg-clip-text text-transparent`}>
                      {profileData.username}
                    </h1>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="text"
                      name="major"
                      value={profileData.major}
                      onChange={handleInputChange}
                      className={`text-lg lg:text-xl mb-2 ${isDark ? 'bg-transparent border-b border-white/50 focus:border-white text-white/90 placeholder-white/50' : 'bg-transparent border-b border-gray-400 focus:border-gray-600 text-gray-800 placeholder-gray-500'}`}
                      placeholder="Your Major"
                    />
                  ) : (
                    <p className={isDark ? 'text-white/90' : 'text-gray-800'}>{profileData.major}</p>
                  )}
                  
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        name="year"
                        value={profileData.year}
                        onChange={handleInputChange}
                        className={`bg-transparent border-b ${isDark ? 'border-white/50 focus:border-white text-white/80 placeholder-white/50' : 'border-gray-400 focus:border-gray-600 text-gray-700 placeholder-gray-500'}`}
                        placeholder="Academic Year"
                      />
                    ) : (
                      <span className={isDark ? 'text-white/80' : 'text-gray-700'}>{profileData.year}</span>
                    )}
                    <span className={isDark ? 'text-white/60' : 'text-gray-500'}>•</span>
                    <span className={isDark ? 'text-white/80' : 'text-gray-700'}>{profileData.campus}</span>
                  </div>
                  
                  {/* Bio */}
                  <div className="mb-6">
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40' : 'bg-gray-100/50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-gray-500'} border rounded-xl p-3 focus:outline-none resize-none`}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className={`max-w-2xl ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{profileData.bio}</p>
                    )}
                  </div>
                  
                  {/* Achievement Badges */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                    <div className={`flex items-center space-x-2 ${isDark ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-yellow-100/50 border-yellow-300/50'} px-3 py-1.5 rounded-full`}>
                      <Award size={16} className="text-yellow-400" />
                      <span className={isDark ? 'text-yellow-200' : 'text-yellow-700'}>Dean's List</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${isDark ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-100/50 border-purple-300/50'} px-3 py-1.5 rounded-full`}>
                      <Trophy size={16} className="text-purple-400" />
                      <span className={isDark ? 'text-purple-200' : 'text-purple-700'}>Hackathon Winner</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${isDark ? 'bg-green-900/20 border-green-500/30' : 'bg-green-100/50 border-green-300/50'} px-3 py-1.5 rounded-full`}>
                      <GraduationCap size={16} className="text-green-400" />
                      <span className={isDark ? 'text-green-200' : 'text-green-700'}>Expected: {profileData.expectedGraduation}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className={`px-6 py-3 ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl`}
                      >
                        <Save size={18} />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className={`px-6 py-3 ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white rounded-xl font-medium transition-all duration-300 flex items-center space-x-2`}
                      >
                        <X size={18} />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className={`px-6 py-3 ${isDark ? 'bg-white/20 hover:bg-white/30 border-white/20 hover:border-white/40' : 'bg-gray-200/50 hover:bg-gray-300/50 border-gray-300 hover:border-gray-400'} backdrop-blur-sm rounded-xl ${isDark ? 'text-white' : 'text-gray-800'} font-medium transition-all duration-300 flex items-center space-x-2`}
                      >
                        <Edit3 size={18} />
                        <span>Edit Profile</span>
                      </button>
                      <button className={`px-6 py-3 ${isDark ? 'bg-white hover:bg-gray-100 text-gray-800' : 'bg-gray-800 hover:bg-gray-700 text-white'} rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl`}>
                        View Transcript
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column - Contact & Activity */}
              <div className="xl:col-span-2 space-y-8">
                
                {/* Contact Information */}
                <div className={`bg-${isDark ? 'slate-800/30' : 'white/50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/30' : 'border-gray-200/50'}`}>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                    <Mail className="mr-3 text-blue-400" size={24} />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className={`bg-${isDark ? 'slate-700/30' : 'gray-100/50'} p-4 rounded-xl border ${isDark ? 'border-slate-600/50' : 'border-gray-200/50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <Mail size={18} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Email</p>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              className={`w-full bg-transparent border-b ${isDark ? 'border-gray-500 focus:border-blue-400 text-white' : 'border-gray-400 focus:border-blue-500 text-gray-800'}`}
                            />
                          ) : (
                            <p className={isDark ? 'text-white' : 'text-gray-800'}>{profileData.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Phone */}
                    <div className={`bg-${isDark ? 'slate-700/30' : 'gray-100/50'} p-4 rounded-xl border ${isDark ? 'border-slate-600/50' : 'border-gray-200/50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-green-500/20">
                          <Phone size={18} className="text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Phone</p>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleInputChange}
                              className={`w-full bg-transparent border-b ${isDark ? 'border-gray-500 focus:border-green-400 text-white' : 'border-gray-400 focus:border-green-500 text-gray-800'}`}
                            />
                          ) : (
                            <p className={isDark ? 'text-white' : 'text-gray-800'}>{profileData.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div className={`bg-${isDark ? 'slate-700/30' : 'gray-100/50'} p-4 rounded-xl border ${isDark ? 'border-slate-600/50' : 'border-gray-200/50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <MapPin size={18} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Location</p>
                          {isEditing ? (
                            <input
                              type="text"
                              name="location"
                              value={profileData.location}
                              onChange={handleInputChange}
                              className={`w-full bg-transparent border-b ${isDark ? 'border-gray-500 focus:border-purple-400 text-white' : 'border-gray-400 focus:border-purple-500 text-gray-800'}`}
                            />
                          ) : (
                            <p className={isDark ? 'text-white' : 'text-gray-800'}>{profileData.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Website */}
                    <div className={`bg-${isDark ? 'slate-700/30' : 'gray-100/50'} p-4 rounded-xl border ${isDark ? 'border-slate-600/50' : 'border-gray-200/50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-orange-500/20">
                          <Globe size={18} className="text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Website</p>
                          {isEditing ? (
                            <input
                              type="url"
                              name="website"
                              value={profileData.website}
                              onChange={handleInputChange}
                              className={`w-full bg-transparent border-b ${isDark ? 'border-gray-500 focus:border-orange-400 text-white' : 'border-gray-400 focus:border-orange-500 text-gray-800'}`}
                            />
                          ) : (
                            <p className={isDark ? 'text-white' : 'text-gray-800'}>{profileData.website}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Skills & Interests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`bg-${isDark ? 'slate-800/30' : 'white/50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/30' : 'border-gray-200/50'}`}>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className={`px-3 py-1.5 ${isDark ? 'bg-blue-900/20 text-blue-300 border-blue-500/30' : 'bg-blue-100/50 text-blue-700 border-blue-300/50'} rounded-lg text-sm border`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`bg-${isDark ? 'slate-800/30' : 'white/50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/30' : 'border-gray-200/50'}`}>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((interest, index) => (
                        <span key={index} className={`px-3 py-1.5 ${isDark ? 'bg-purple-900/20 text-purple-300 border-purple-500/30' : 'bg-purple-100/50 text-purple-700 border-purple-300/50'} rounded-lg text-sm border`}>
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className={`bg-${isDark ? 'slate-800/30' : 'white/50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/30' : 'border-gray-200/50'}`}>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                    <Clock className="mr-3 text-purple-400" size={24} />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {profileData.achievements.map(activity => (
                      <div
                        key={activity.id}
                        className={`flex items-start space-x-4 p-4 ${isDark ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50' : 'bg-gray-100/50 border-gray-200/50 hover:border-gray-300/50'} rounded-xl border transition-colors`}
                      >
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-600/50' : 'bg-gray-200/50'}`}>
                          {getAchievementIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className={isDark ? 'text-white' : 'text-gray-800'}>{activity.title}</p>
                          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Stats & Quick Actions */}
              <div className="space-y-8">
                
                {/* Academic Stats */}
                <div className={`bg-${isDark ? 'slate-800/30' : 'white/50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/30' : 'border-gray-200/50'}`}>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                    <Target className="mr-3 text-green-400" size={24} />
                    Academic Overview
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`bg-gradient-to-br ${isDark ? 'from-blue-900/20 to-blue-800/20 border-blue-500/30' : 'from-blue-100/50 to-blue-200/50 border-blue-300/50'} p-4 rounded-xl text-center border`}>
                      <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-1`}>
                        {isEditing ? (
                          <input
                            type="text"
                            name="gpa"
                            value={profileData.gpa}
                            onChange={handleInputChange}
                            className={`w-full text-center bg-transparent border-b ${isDark ? 'border-blue-400 text-blue-400' : 'border-blue-500 text-blue-600'} focus:outline-none`}
                          />
                        ) : (
                          profileData.gpa
                        )}
                      </div>
                      <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Current GPA</div>
                    </div>
                    
                    <div className={`bg-gradient-to-br ${isDark ? 'from-purple-900/20 to-purple-800/20 border-purple-500/30' : 'from-purple-100/50 to-purple-200/50 border-purple-300/50'} p-4 rounded-xl text-center border`}>
                      <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'} mb-1`}>
                        {isEditing ? (
                          <input
                            type="text"
                            name="creditHours"
                            value={profileData.creditHours}
                            onChange={handleInputChange}
                            className={`w-full text-center bg-transparent border-b ${isDark ? 'border-purple-400 text-purple-400' : 'border-purple-500 text-purple-600'} focus:outline-none`}
                          />
                        ) : (
                          profileData.creditHours
                        )}
                      </div>
                      <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Credit Hours</div>
                    </div>
                    
                    <div className={`bg-gradient-to-br ${isDark ? 'from-green-900/20 to-green-800/20 border-green-500/30' : 'from-green-100/50 to-green-200/50 border-green-300/50'} p-4 rounded-xl text-center border`}>
                      <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'} mb-1`}>
                        {isEditing ? (
                          <input
                            type="text"
                            name="currentCourses"
                            value={profileData.currentCourses}
                            onChange={handleInputChange}
                            className={`w-full text-center bg-transparent border-b ${isDark ? 'border-green-400 text-green-400' : 'border-green-500 text-green-600'} focus:outline-none`}
                          />
                        ) : (
                          profileData.currentCourses
                        )}
                      </div>
                      <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>This Semester</div>
                    </div>
                    
                    <div className={`bg-gradient-to-br ${isDark ? 'from-orange-900/20 to-orange-800/20 border-orange-500/30' : 'from-orange-100/50 to-orange-200/50 border-orange-300/50'} p-4 rounded-xl text-center border`}>
                      <div className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'} mb-1`}>
                        {isEditing ? (
                          <input
                            type="text"
                            name="remainingHours"
                            value={profileData.remainingHours}
                            onChange={handleInputChange}
                            className={`w-full text-center bg-transparent border-b ${isDark ? 'border-orange-400 text-orange-400' : 'border-orange-500 text-orange-600'} focus:outline-none`}
                          />
                        ) : (
                          profileData.remainingHours
                        )}
                      </div>
                      <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Remaining</div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className={`bg-${isDark ? 'slate-800/30' : 'white/50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/30' : 'border-gray-200/50'}`}>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-6`}>Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Clock, label: 'View Schedule', color: 'blue' },
                      { icon: BookOpen, label: 'Course Catalog', color: 'purple' },
                      { icon: Users, label: 'Study Groups', color: 'green' },
                      { icon: Award, label: 'Achievements', color: 'yellow' },
                      { icon: Calendar, label: 'Academic Calendar', color: 'indigo' }
                    ].map((action, index) => (
                      <button
                        key={index}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/50 border-slate-600/50' : 'bg-gray-100/50 hover:bg-gray-200/50 border-gray-200/50'} hover:border-${action.color}-500/50 border group`}
                      >
                        <div className="flex items-center space-x-3">
                          <action.icon size={20} className={`text-${action.color}-400 group-hover:scale-110 transition-transform`} />
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{action.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className={`bg-${isDark ? 'slate-800/30' : 'white/50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/30' : 'border-gray-200/50'}`}>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-6`}>Connect</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Linkedin size={20} className="text-blue-400" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="socialMedia.linkedin"
                          value={profileData.socialMedia.linkedin}
                          onChange={handleInputChange}
                          className={`flex-1 bg-transparent border-b ${isDark ? 'border-gray-500 focus:border-blue-400 text-white' : 'border-gray-400 focus:border-blue-500 text-gray-800'} placeholder-${isDark ? 'white/50' : 'gray-500'}`}
                          placeholder="LinkedIn username"
                        />
                      ) : (
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>linkedin.com/in/{profileData.socialMedia.linkedin}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Twitter size={20} className="text-blue-400" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="socialMedia.twitter"
                          value={profileData.socialMedia.twitter}
                          onChange={handleInputChange}
                          className={`flex-1 bg-transparent border-b ${isDark ? 'border-gray-500 focus:border-blue-400 text-white' : 'border-gray-400 focus:border-blue-500 text-gray-800'} placeholder-${isDark ? 'white/50' : 'gray-500'}`}
                          placeholder="Twitter handle"
                        />
                      ) : (
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{profileData.socialMedia.twitter}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Instagram size={20} className="text-pink-400" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="socialMedia.instagram"
                          value={profileData.socialMedia.instagram}
                          onChange={handleInputChange}
                          className={`flex-1 bg-transparent border-b ${isDark ? 'border-gray-500 focus:border-pink-400 text-white' : 'border-gray-400 focus:border-pink-500 text-gray-800'} placeholder-${isDark ? 'white/50' : 'gray-500'}`}
                          placeholder="Instagram handle"
                        />
                      ) : (
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{profileData.socialMedia.instagram}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;