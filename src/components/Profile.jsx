import React, { useState, useRef } from 'react';
import {
  User, Mail, BookOpen, Edit3, Camera, MapPin, Award, GraduationCap,
  Users, Clock, Upload, X, Check, Save, Calendar, Trophy, Target,
  Star, Zap, Phone, Globe, Instagram, Twitter, Linkedin,
  Briefcase,
  ClubIcon,
  Heart
} from 'lucide-react';

const Profile = ({ user }) => {
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
    portfolio: 'https://portfollionet.netlify.app/',
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
    const icons = {
      course: <BookOpen size={16} className="text-blue-400" />,
      academic: <Award size={16} className="text-yellow-400" />,
      competition: <Trophy size={16} className="text-purple-400" />,
      research: <Star size={16} className="text-green-400" />,
    };
    return icons[type] || <Zap size={16} className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Success/Error Messages */}
        {(error || successMessage) && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 bg-${error ? 'red-100/50 border-red-300/50' : 'green-100/50 border-green-300/50'}`}>
            {error ? (
              <X size={20} className="text-red-600" />
            ) : (
              <Check size={20} className="text-green-600" />
            )}
            <span className={error ? 'text-red-600' : 'text-green-600'}>
              {error || successMessage}
            </span>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">

          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-200 to-purple-200 p-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">

                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-gray-300/50 shadow-2xl overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={48} className="text-gray-600" />
                      )}
                    </div>

                    {/* Image Upload Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImageUploading}
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    >
                      {isImageUploading ? (
                        <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera size={20} className="text-gray-800" />
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
                      className="text-3xl lg:text-4xl font-bold mb-3 bg-transparent border-b-2 border-gray-400 focus:border-gray-600 text-gray-800 placeholder-gray-500"
                      placeholder="Your Name"
                    />
                  ) : (
                    <h1 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {profileData.username}
                    </h1>
                  )}

                  {isEditing ? (
                    <input
                      type="text"
                      name="major"
                      value={profileData.major}
                      onChange={handleInputChange}
                      className="text-lg lg:text-xl mb-2 bg-transparent border-b border-gray-400 focus:border-gray-600 text-gray-800 placeholder-gray-500"
                      placeholder="Your Major"
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.major}</p>
                  )}

                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        name="year"
                        value={profileData.year}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-gray-400 focus:border-gray-600 text-gray-700 placeholder-gray-500"
                        placeholder="Academic Year"
                      />
                    ) : (
                      <span className="text-gray-700">{profileData.year}</span>
                    )}
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-700">{profileData.campus}</span>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-gray-100/50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-gray-500 border rounded-xl p-3 focus:outline-none resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="max-w-2xl text-gray-700">{profileData.bio}</p>
                    )}
                  </div>

                  {/* Achievement Badges */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                    {[
                      { icon: Award, label: "Dean's List", color: 'yellow-100/50 border-yellow-300/50', text: 'yellow-700' },
                      { icon: Trophy, label: 'Hackathon Winner', color: 'purple-100/50 border-purple-300/50', text: 'purple-700' },
                      { icon: GraduationCap, label: `Expected: ${profileData.expectedGraduation}`, color: 'green-100/50 border-green-300/50', text: 'green-700' },
                    ].map((badge, index) => (
                      <div key={index} className={`flex items-center space-x-2 bg-${badge.color} px-3 py-1.5 rounded-full`}>
                        <badge.icon size={16} className={`text-${badge.text.split('-')[0]}-400`} />
                        <span className={`text-${badge.text}`}>{badge.label}</span>
                      </div>
                    ))}
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
                        className="px-6 py-3 bg-gray-200/50 hover:bg-gray-300/50 border-gray-300 hover:border-gray-400 backdrop-blur-sm rounded-xl text-gray-800 font-medium transition-all duration-300 flex items-center space-x-2"
                      >
                        <Edit3 size={18} />
                        <span>Edit Profile</span>
                      </button>
                      <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
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
                <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Mail className="mr-3 text-blue-400" size={24} />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: Mail, label: 'Email', name: 'email', value: profileData.email, color: 'blue', type: 'email' },
                      { icon: Phone, label: 'Phone', name: 'phone', value: profileData.phone, color: 'green', type: 'tel' },
                      { icon: MapPin, label: 'Location', name: 'location', value: profileData.location, color: 'purple', type: 'text' },
                      { icon: Globe, label: 'Portfolio', name: 'portfolio', value: profileData.portfolio, color: 'orange', type: 'url' },
                    ].map((contact, index) => (
                      <div key={index} className="bg-gray-100/50 p-4 rounded-xl border border-gray-200/50">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-${contact.color}-500/20`}>
                            <contact.icon size={18} className={`text-${contact.color}-400`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-600">{contact.label}</p>
                            {isEditing ? (
                              <input
                                type={contact.type}
                                name={contact.name}
                                value={contact.value}
                                onChange={handleInputChange}
                                className={`w-full bg-transparent border-b border-gray-400 focus:border-${contact.color}-500 text-gray-800`}
                              />
                            ) : (
                              <p className="text-gray-800">{contact.value}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills & Interests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 bg-blue-100/50 text-blue-700 border-blue-300/50 rounded-lg text-sm border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1.5 bg-purple-100/50 text-purple-700 border-purple-300/50 rounded-lg text-sm border">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Clock className="mr-3 text-purple-400" size={24} />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {profileData.achievements.map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 bg-gray-100/50 border-gray-200/50 hover:border-gray-300/50 rounded-xl border transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-gray-200/50">
                          {getAchievementIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{activity.title}</p>
                          <p className="text-gray-600">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Quick Actions */}
              <div className="space-y-8">

                {/* Academic Stats */}
                <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Target className="mr-3 text-green-400" size={24} />
                    Academic Overview
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'gpa', value: profileData.gpa, label: 'Current GPA', color: 'blue' },
                      { name: 'creditHours', value: profileData.creditHours, label: 'Credit Hours', color: 'purple' },
                      { name: 'currentCourses', value: profileData.currentCourses, label: 'This Semester', color: 'green' },
                      { name: 'remainingHours', value: profileData.remainingHours, label: 'Remaining', color: 'orange' },
                    ].map((stat, index) => (
                      <div key={index} className={`bg-gradient-to-br from-${stat.color}-100/50 to-${stat.color}-200/50 border-${stat.color}-300/50 p-4 rounded-xl text-center border`}>
                        <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
                          {isEditing ? (
                            <input
                              type="text"
                              name={stat.name}
                              value={stat.value}
                              onChange={handleInputChange}
                              className={`w-full text-center bg-transparent border-b border-${stat.color}-500 text-${stat.color}-600 focus:outline-none`}
                            />
                          ) : (
                            stat.value
                          )}
                        </div>
                        <div className="text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'social', label: 'Social Hub', icon: Users, activeColor: 'orange-500', activeText: 'orange-600' },
                      { id: 'learning', label: 'Learning Hub', icon: BookOpen, activeColor: 'blue-500', activeText: 'blue-600' },
                      { id: 'events', label: 'Events', icon: Calendar, activeColor: 'purple-500', activeText: 'purple-600' },
                      { id: 'career', label: 'Career Hub', icon: Briefcase, activeColor: 'green-500', activeText: 'green-600' },
                      { id: 'clubs', label: 'Clubs Hub', icon: ClubIcon, activeColor: 'yellow-500', activeText: 'yellow-600' },
                      { id: 'wellness', label: 'Wellness Hub', icon: Heart, activeColor: 'pink-500', activeText: 'pink-600' },
                    ].map((action, index) => (
                      <button
                        key={index}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] bg-gray-100/50 hover:bg-gray-200/50 border-gray-200/50 hover:border-${action.color}-500/50 border group`}
                      >
                        <div className="flex items-center space-x-3">
                          <action.icon size={20} className={`text-${action.color}-400 group-hover:scale-110 transition-transform`} />
                          <span className="font-medium text-gray-800">{action.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Connect</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Linkedin, name: 'socialMedia.linkedin', value: profileData.socialMedia.linkedin, label: `linkedin.com/in/${profileData.socialMedia.linkedin}`, color: 'blue' },
                      { icon: Twitter, name: 'socialMedia.twitter', value: profileData.socialMedia.twitter, label: profileData.socialMedia.twitter, color: 'blue' },
                      { icon: Instagram, name: 'socialMedia.instagram', value: profileData.socialMedia.instagram, label: profileData.socialMedia.instagram, color: 'pink' },
                    ].map((social, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <social.icon size={20} className={`text-${social.color}-400`} />
                        {isEditing ? (
                          <input
                            type="text"
                            name={social.name}
                            value={social.value}
                            onChange={handleInputChange}
                            className={`flex-1 bg-transparent border-b border-gray-400 focus:border-${social.color}-500 text-gray-800 placeholder-gray-500`}
                            placeholder={`${social.icon.name} handle`}
                          />
                        ) : (
                          <span className="text-gray-600">{social.label}</span>
                        )}
                      </div>
                    ))}
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