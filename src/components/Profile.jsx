import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, BookOpen, Edit3, Camera, MapPin, Award, GraduationCap, 
  Users, Clock, Upload, X, Check, Save, Calendar, Trophy, Target, 
  Star, Zap, Phone, Globe, Instagram, Twitter, Linkedin
} from 'lucide-react';

const Profile = ({ user }) => {
  const [isDark, setIsDark] = useState(true);
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
    <div className="min-h-screen bg-gradient-to-r from-gray-600 to-gray-600">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Success/Error Messages */}
        {(error || successMessage) && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${
            error ? 'bg-red-gray/20 border border-gray-500/30' : 'bg-green-500/20 border border-green-500/30'
          }`}>
            {error ? (
              <X size={20} className="text-red-400" />
            ) : (
              <Check size={20} className="text-green-400" />
            )}
            <span className={error ? 'text-red-400' : 'text-green-400'}>
              {error || successMessage}
            </span>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
          
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-gray-600 to-gray-600 p-8">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-red-600/20"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-2xl overflow-hidden">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={48} className="text-white" />
                      )}
                    </div>
                    
                    {/* Image Upload Button */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImageUploading}
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    >
                      {isImageUploading ? (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera size={20} className="text-gray-700" />
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
                <div className="text-white text-center lg:text-left flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className="text-3xl lg:text-4xl font-bold mb-3 bg-transparent border-b-2 border-white/50 focus:outline-none focus:border-white text-white w-full placeholder-white/70"
                      placeholder="Your Name"
                    />
                  ) : (
                    <h1 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text">
                      {profileData.username}
                    </h1>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="text"
                      name="major"
                      value={profileData.major}
                      onChange={handleInputChange}
                      className="text-lg lg:text-xl mb-2 bg-transparent border-b border-white/50 focus:outline-none text-white/90 w-full placeholder-white/60"
                      placeholder="Your Major"
                    />
                  ) : (
                    <p className="text-white/90 text-lg lg:text-xl mb-2">{profileData.major}</p>
                  )}
                  
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        name="year"
                        value={profileData.year}
                        onChange={handleInputChange}
                        className="text-white/80 bg-transparent border-b border-white/50 focus:outline-none placeholder-white/50"
                        placeholder="Academic Year"
                      />
                    ) : (
                      <span className="text-white/80">{profileData.year}</span>
                    )}
                    <span className="text-white/60">•</span>
                    <span className="text-white/80">{profileData.campus}</span>
                  </div>
                  
                  {/* Bio */}
                  <div className="mb-6">
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/60 focus:outline-none focus:border-white/40 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-white/80 max-w-2xl">{profileData.bio}</p>
                    )}
                  </div>
                  
                  {/* Achievement Badges */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                    <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1.5 rounded-full border border-yellow-500/30">
                      <Award size={16} className="text-yellow-400" />
                      <span className="text-yellow-200 text-sm font-medium">Dean's List</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-500/30">
                      <Trophy size={16} className="text-purple-400" />
                      <span className="text-purple-200 text-sm font-medium">Hackathon Winner</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
                      <GraduationCap size={16} className="text-green-400" />
                      <span className="text-green-200 text-sm font-medium">Expected: {profileData.expectedGraduation}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                      >
                        <Save size={18} />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
                      >
                        <X size={18} />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white font-medium transition-all duration-300 flex items-center space-x-2 border border-white/20 hover:border-white/40"
                      >
                        <Edit3 size={18} />
                        <span>Edit Profile</span>
                      </button>
                      <button className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
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
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Mail className="mr-3 text-blue-400" size={24} />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <Mail size={18} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm font-medium">Email</p>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              className="w-full bg-transparent border-b border-gray-500 focus:border-blue-400 focus:outline-none text-white"
                            />
                          ) : (
                            <p className="text-white font-medium">{profileData.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Phone */}
                    <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-green-500/20">
                          <Phone size={18} className="text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm font-medium">Phone</p>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleInputChange}
                              className="w-full bg-transparent border-b border-gray-500 focus:border-green-400 focus:outline-none text-white"
                            />
                          ) : (
                            <p className="text-white font-medium">{profileData.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <MapPin size={18} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm font-medium">Location</p>
                          {isEditing ? (
                            <input
                              type="text"
                              name="location"
                              value={profileData.location}
                              onChange={handleInputChange}
                              className="w-full bg-transparent border-b border-gray-500 focus:border-purple-400 focus:outline-none text-white"
                            />
                          ) : (
                            <p className="text-white font-medium">{profileData.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Website */}
                    <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-orange-500/20">
                          <Globe size={18} className="text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm font-medium">Website</p>
                          {isEditing ? (
                            <input
                              type="url"
                              name="website"
                              value={profileData.website}
                              onChange={handleInputChange}
                              className="w-full bg-transparent border-b border-gray-500 focus:border-orange-400 focus:outline-none text-white"
                            />
                          ) : (
                            <p className="text-white font-medium">{profileData.website}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Skills & Interests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm border border-purple-500/30">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Clock className="mr-3 text-purple-400" size={24} />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {profileData.achievements.map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-slate-600/50">
                          {getAchievementIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{activity.title}</p>
                          <p className="text-gray-400 text-sm">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Stats & Quick Actions */}
              <div className="space-y-8">
                
                {/* Academic Stats */}
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Target className="mr-3 text-green-400" size={24} />
                    Academic Overview
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-xl text-center border border-blue-500/30">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {isEditing ? (
                          <input
                            type="text"
                            name="gpa"
                            value={profileData.gpa}
                            onChange={handleInputChange}
                            className="w-full text-center bg-transparent border-b border-blue-400 focus:outline-none text-blue-400"
                          />
                        ) : (
                          profileData.gpa
                        )}
                      </div>
                      <div className="text-gray-300 text-sm font-medium">Current GPA</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 rounded-xl text-center border border-purple-500/30">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {isEditing ? (
                          <input
                            type="text"
                            name="creditHours"
                            value={profileData.creditHours}
                            onChange={handleInputChange}
                            className="w-full text-center bg-transparent border-b border-purple-400 focus:outline-none text-purple-400"
                          />
                        ) : (
                          profileData.creditHours
                        )}
                      </div>
                      <div className="text-gray-300 text-sm font-medium">Credit Hours</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-xl text-center border border-green-500/30">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {isEditing ? (
                          <input
                            type="text"
                            name="currentCourses"
                            value={profileData.currentCourses}
                            onChange={handleInputChange}
                            className="w-full text-center bg-transparent border-b border-green-400 focus:outline-none text-green-400"
                          />
                        ) : (
                          profileData.currentCourses
                        )}
                      </div>
                      <div className="text-gray-300 text-sm font-medium">This Semester</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-4 rounded-xl text-center border border-orange-500/30">
                      <div className="text-2xl font-bold text-orange-400 mb-1">
                        {isEditing ? (
                          <input
                            type="text"
                            name="remainingHours"
                            value={profileData.remainingHours}
                            onChange={handleInputChange}
                            className="w-full text-center bg-transparent border-b border-orange-400 focus:outline-none text-orange-400"
                          />
                        ) : (
                          profileData.remainingHours
                        )}
                      </div>
                      <div className="text-gray-300 text-sm font-medium">Remaining</div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
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
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-${action.color}-500/50 group`}
                      >
                        <div className="flex items-center space-x-3">
                          <action.icon size={20} className={`text-${action.color}-400 group-hover:scale-110 transition-transform`} />
                          <span className="font-medium text-white">{action.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6">Connect</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Linkedin size={20} className="text-blue-400" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="socialMedia.linkedin"
                          value={profileData.socialMedia.linkedin}
                          onChange={handleInputChange}
                          className="flex-1 bg-transparent border-b border-gray-500 focus:border-blue-400 focus:outline-none text-white"
                          placeholder="LinkedIn username"
                        />
                      ) : (
                        <span className="text-gray-300">linkedin.com/in/{profileData.socialMedia.linkedin}</span>
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
                          className="flex-1 bg-transparent border-b border-gray-500 focus:border-blue-400 focus:outline-none text-white"
                          placeholder="Twitter handle"
                        />
                      ) : (
                        <span className="text-gray-300">{profileData.socialMedia.twitter}</span>
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
                          className="flex-1 bg-transparent border-b border-gray-500 focus:border-pink-400 focus:outline-none text-white"
                          placeholder="Instagram handle"
                        />
                      ) : (
                        <span className="text-gray-300">{profileData.socialMedia.instagram}</span>
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