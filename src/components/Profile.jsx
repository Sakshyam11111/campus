import React, { useState, useRef } from 'react';
import {
  User, Mail, BookOpen, Edit3, Camera, MapPin, Award, GraduationCap,
  Users, Clock, Upload, X, Check, Save, Calendar, Trophy, Target,
  Star, Zap, Phone, Globe, Instagram, Linkedin, Briefcase, 
  Heart, ExternalLink, TrendingUp, Activity, MessageCircle, Eye, Plus,
  Github,
  ChevronRight
} from 'lucide-react';

const Profile = ({ user, profileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [newAchievement, setNewAchievement] = useState({ title: '', type: 'custom' });
  const [prevSocialMedia, setPrevSocialMedia] = useState(null);
  const [prevPortfolio, setPrevPortfolio] = useState(null);
  const [prevFormData, setPrevFormData] = useState(null);
  const [isEditingLinkedIn, setIsEditingLinkedIn] = useState(false);
  const [isEditingGithub, setIsEditingGithub] = useState(false);
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [isEditingInstagram, setIsEditingInstagram] = useState(false);
  const [tempLinkedInUrl, setTempLinkedInUrl] = useState('');
  const [tempGithubUrl, setTempGithubUrl] = useState('');
  const [tempPortfolioUrl, setTempPortfolioUrl] = useState('');
  const [tempInstagramUrl, setTempInstagramUrl] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: profileData?.name || user?.username || 'Alex Johnson',
    email: profileData?.email || user?.email || 'alex.johnson@university.edu',
    major: profileData?.major || 'Computer Science',
    year: profileData?.year || 'Junior',
    campus: profileData?.campus || 'Main Campus',
    location: profileData?.location || 'San Francisco, CA',
    phone: profileData?.phone || '+1 (555) 123-4567',
    portfolio: profileData?.portfolio || 'https://alexjohnson.dev',
    gpa: profileData?.gpa || '3.85',
    creditHours: profileData?.creditHours || '98',
    currentCourses: profileData?.currentCourses || '5',
    remainingHours: profileData?.remainingHours || '42',
    expectedGraduation: profileData?.expectedGraduation || 'Spring 2025',
    bio: profileData?.bio || 'Passionate computer science student with a focus on web development and machine learning. Love building innovative solutions and contributing to open-source projects.',
    socialMedia: {
      linkedin: profileData?.socialMedia?.linkedin || profileData?.linkedin || 'alex-johnson-dev',
      instagram: profileData?.socialMedia?.instagram || profileData?.instagram || '@alex.codes',
      github: profileData?.socialMedia?.github || profileData?.github || 'alexjohnson-dev'
    },
    achievements: profileData?.achievements || [
      { id: 1, title: 'Dean\'s List - Fall 2024', date: '2 weeks ago', type: 'academic' },
      { id: 2, title: 'Completed CS50 Course', date: '1 month ago', type: 'course' },
      { id: 3, title: 'Won Hackathon First Place', date: '2 months ago', type: 'competition' },
      { id: 4, title: 'Published Research Paper', date: '3 months ago', type: 'research' }
    ],
    skills: profileData?.skills || ['JavaScript', 'React', 'Python', 'Node.js', 'Machine Learning', 'SQL', 'Git', 'Docker'],
    interests: profileData?.interests || ['Web Development', 'AI/ML', 'Open Source', 'Photography', 'Hiking', 'Music Production']
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        setTimeout(() => setError(''), 3000);
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
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAchievementChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAchievement = () => {
    if (!newAchievement.title.trim()) {
      setError('Achievement title is required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const newAchievementEntry = {
      id: Date.now() + Math.random(),
      title: newAchievement.title.trim(),
      date: new Date().toLocaleDateString(),
      type: newAchievement.type
    };

    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievementEntry]
    }));
    setNewAchievement({ title: '', type: 'custom' });
    setShowAchievementForm(false);
    setSuccessMessage('Achievement added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const isValidUrl = (url) => {
    if (!url) return false;
    const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
    return pattern.test(url) || pattern.test(`https://${url}`);
  };

  const handleSaveProfile = async () => {
    // Validate URLs
    const socialMedia = { ...formData.socialMedia };
    const portfolio = formData.portfolio;
    let hasError = false;

    // Check LinkedIn
    if (!socialMedia.linkedin.trim() || !isValidUrl(socialMedia.linkedin)) {
      socialMedia.linkedin = prevSocialMedia?.linkedin || socialMedia.linkedin;
      if (!socialMedia.linkedin) hasError = true;
    }
    // Check GitHub
    if (!socialMedia.github.trim() || !isValidUrl(socialMedia.github)) {
      socialMedia.github = prevSocialMedia?.github || socialMedia.github;
      if (!socialMedia.github) hasError = true;
    }
    // Check Instagram (optional, allow empty)
    if (socialMedia.instagram && !isValidUrl(socialMedia.instagram)) {
      socialMedia.instagram = prevSocialMedia?.instagram || socialMedia.instagram;
      if (!socialMedia.instagram) hasError = true;
    }
    // Check Portfolio
    if (!portfolio.trim() || !isValidUrl(portfolio)) {
      setFormData(prev => ({ ...prev, portfolio: prevPortfolio || portfolio }));
      if (!prevPortfolio) hasError = true;
    }

    // Handle individually edited URLs
    if (isEditingLinkedIn && tempLinkedInUrl && isValidUrl(tempLinkedInUrl)) {
      socialMedia.linkedin = tempLinkedInUrl;
    } else if (isEditingLinkedIn) {
      socialMedia.linkedin = prevSocialMedia?.linkedin || socialMedia.linkedin;
      if (!socialMedia.linkedin) hasError = true;
    }

    if (isEditingGithub && tempGithubUrl && isValidUrl(tempGithubUrl)) {
      socialMedia.github = tempGithubUrl;
    } else if (isEditingGithub) {
      socialMedia.github = prevSocialMedia?.github || socialMedia.github;
      if (!socialMedia.github) hasError = true;
    }

    if (isEditingPortfolio && tempPortfolioUrl && isValidUrl(tempPortfolioUrl)) {
      setFormData(prev => ({ ...prev, portfolio: tempPortfolioUrl }));
    } else if (isEditingPortfolio) {
      setFormData(prev => ({ ...prev, portfolio: prevPortfolio || portfolio }));
      if (!prevPortfolio) hasError = true;
    }

    if (isEditingInstagram && tempInstagramUrl && isValidUrl(tempInstagramUrl)) {
      socialMedia.instagram = tempInstagramUrl;
    } else if (isEditingInstagram && tempInstagramUrl && !isValidUrl(tempInstagramUrl)) {
      socialMedia.instagram = prevSocialMedia?.instagram || '';
      hasError = true;
    }

    if (hasError) {
      setError('Please provide valid URLs for required fields');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setFormData(prev => ({ ...prev, socialMedia }));
    setIsEditing(false);
    setIsEditingLinkedIn(false);
    setIsEditingGithub(false);
    setIsEditingPortfolio(false);
    setIsEditingInstagram(false);
    setPrevFormData(null);
    setShowAchievementForm(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    console.log('Saved formData:', formData); // Debug log
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setPrevFormData({ ...formData });
      setPrevSocialMedia({ ...formData.socialMedia });
      setPrevPortfolio(formData.portfolio);
    }
    setIsEditing(!isEditing);
    setIsEditingLinkedIn(false);
    setIsEditingGithub(false);
    setIsEditingPortfolio(false);
    setIsEditingInstagram(false);
    setTempLinkedInUrl('');
    setTempGithubUrl('');
    setTempPortfolioUrl('');
    setTempInstagramUrl('');
  };

  const handleCancelProfile = () => {
    if (prevFormData) {
      setFormData(prevFormData);
    }
    setIsEditing(false);
    setIsEditingLinkedIn(false);
    setIsEditingGithub(false);
    setIsEditingPortfolio(false);
    setIsEditingInstagram(false);
    setTempLinkedInUrl('');
    setTempGithubUrl('');
    setTempPortfolioUrl('');
    setTempInstagramUrl('');
    setPrevSocialMedia(null);
    setPrevPortfolio(null);
    setPrevFormData(null);
  };

  const startEditing = (platform) => {
    switch (platform) {
      case 'linkedin':
        setIsEditingLinkedIn(true);
        setTempLinkedInUrl(formData.socialMedia.linkedin);
        break;
      case 'github':
        setIsEditingGithub(true);
        setTempGithubUrl(formData.socialMedia.github);
        break;
      case 'portfolio':
        setIsEditingPortfolio(true);
        setTempPortfolioUrl(formData.portfolio);
        break;
      case 'instagram':
        setIsEditingInstagram(true);
        setTempInstagramUrl(formData.socialMedia.instagram);
        break;
      default:
        break;
    }
  };

  const cancelEditing = (platform) => {
    switch (platform) {
      case 'linkedin':
        setIsEditingLinkedIn(false);
        setTempLinkedInUrl('');
        break;
      case 'github':
        setIsEditingGithub(false);
        setTempGithubUrl('');
        break;
      case 'portfolio':
        setIsEditingPortfolio(false);
        setTempPortfolioUrl('');
        break;
      case 'instagram':
        setIsEditingInstagram(false);
        setTempInstagramUrl('');
        break;
      default:
        break;
    }
  };

  const saveEditing = (platform) => {
    let hasError = false;
    switch (platform) {
      case 'linkedin':
        if (!tempLinkedInUrl.trim() || !isValidUrl(tempLinkedInUrl)) {
          setError('Please provide a valid LinkedIn URL');
          setTimeout(() => setError(''), 3000);
          hasError = true;
        } else {
          setFormData(prev => ({
            ...prev,
            socialMedia: { ...prev.socialMedia, linkedin: tempLinkedInUrl }
          }));
          setIsEditingLinkedIn(false);
          setTempLinkedInUrl('');
          setSuccessMessage('LinkedIn URL updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
        break;
      case 'github':
        if (!tempGithubUrl.trim() || !isValidUrl(tempGithubUrl)) {
          setError('Please provide a valid GitHub URL');
          setTimeout(() => setError(''), 3000);
          hasError = true;
        } else {
          setFormData(prev => ({
            ...prev,
            socialMedia: { ...prev.socialMedia, github: tempGithubUrl }
          }));
          setIsEditingGithub(false);
          setTempGithubUrl('');
          setSuccessMessage('GitHub URL updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
        break;
      case 'portfolio':
        if (!tempPortfolioUrl.trim() || !isValidUrl(tempPortfolioUrl)) {
          setError('Please provide a valid Portfolio URL');
          setTimeout(() => setError(''), 3000);
          hasError = true;
        } else {
          setFormData(prev => ({ ...prev, portfolio: tempPortfolioUrl }));
          setIsEditingPortfolio(false);
          setTempPortfolioUrl('');
          setSuccessMessage('Portfolio URL updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
        break;
      case 'instagram':
        if (tempInstagramUrl && !isValidUrl(tempInstagramUrl)) {
          setError('Please provide a valid Instagram URL');
          setTimeout(() => setError(''), 3000);
          hasError = true;
        } else {
          setFormData(prev => ({
            ...prev,
            socialMedia: { ...prev.socialMedia, instagram: tempInstagramUrl }
          }));
          setIsEditingInstagram(false);
          setTempInstagramUrl('');
          setSuccessMessage('Instagram URL updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
        break;
      default:
        break;
    }
    return !hasError;
  };

  const getAchievementIcon = (type) => {
    const icons = {
      course: <BookOpen size={18} className="text-blue-500" />,
      academic: <Award size={18} className="text-yellow-500" />,
      competition: <Trophy size={18} className="text-purple-500" />,
      research: <Star size={18} className="text-green-500" />,
      custom: <Zap size={18} className="text-indigo-500" />
    };
    return icons[type] || <Zap size={18} className="text-indigo-500" />;
  };

  // Normalize URL to ensure it starts with http:// or https://
  const normalizeUrl = (url) => {
    if (!url) return '#';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };

  // Extract display value (remove https:// for display)
  const getDisplayValue = (url) => {
    if (!url) return 'Not provided';
    return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:px-8">
        {/* Success/Error Messages */}
        {(error || successMessage) && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 border ${
            error 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {error ? (
              <X size={20} className="text-red-600" />
            ) : (
              <Check size={20} className="text-green-600" />
            )}
            <span className="font-medium">{error || successMessage}</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
            </div>
            
            {/* Profile Content */}
            <div className="relative px-8 pb-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-end space-y-6 lg:space-y-0 lg:space-x-8 -mt-16">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 relative">
                    <div className="w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={48} className="text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImageUploading}
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-500 hover:bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 text-white"
                    >
                      {isImageUploading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera size={20} />
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
                <div className="flex-1 text-center lg:text-left space-y-4 mt-6">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 outline-none"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900">{formData.username}</h1>
                    )}
                    
                    <div className="flex items-center justify-center lg:justify-start space-x-2 mt-2">
                      <Mail size={16} className="text-gray-500" />
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="text-gray-600 bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none"
                        />
                      ) : (
                        <span className="text-gray-600">{formData.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-indigo-100 rounded-full">
                      <BookOpen size={16} className="text-indigo-600" />
                      <span className="text-indigo-700 font-medium">{formData.major}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 rounded-full">
                      <GraduationCap size={16} className="text-purple-600" />
                      <span className="text-purple-700 font-medium">{formData.year}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-pink-100 rounded-full">
                      <MapPin size={16} className="text-pink-600" />
                      <span className="text-pink-700 font-medium">{formData.location}</span>
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-transparent border border-gray-300 focus:border-indigo-500 rounded-lg p-3 outline-none text-gray-700 resize-none"
                    />
                  ) : (
                    <p className="text-gray-700 max-w-2xl leading-relaxed">{formData.bio}</p>
                  )}
                </div>

                {/* Edit/Save/Cancel Buttons */}
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={isEditing ? handleSaveProfile : handleEditToggle}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg ${
                        isEditing 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                      }`}
                    >
                      {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                      <span className="font-medium">{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
                    </button>
                    {isEditing && (
                      <button
                        onClick={handleCancelProfile}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                      >
                        <X size={18} />
                        <span className="font-medium">Cancel</span>
                      </button>
                    )}
                  </div>
                  <button className="flex items-center space-x-2 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    <Eye size={16} />
                    <span className="text-sm">View as others</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Academic Stats */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="mr-3 text-indigo-500" size={28} />
                  Academic Performance
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* GPA Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-5 text-center transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
                  <Target size={24} className="text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-green-700 mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="gpa"
                        value={formData.gpa}
                        onChange={handleInputChange}
                        className="w-full text-center bg-transparent border-b-2 border-green-400 focus:border-green-600 outline-none text-green-700"
                      />
                    ) : (
                      formData.gpa
                    )}
                  </div>
                  <div className="text-sm font-medium text-green-600">GPA</div>
                </div>

                {/* Credit Hours Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 text-center transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
                  <BookOpen size={24} className="text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="creditHours"
                        value={formData.creditHours}
                        onChange={handleInputChange}
                        className="w-full text-center bg-transparent border-b-2 border-blue-400 focus:border-blue-600 outline-none text-blue-700"
                      />
                    ) : (
                      formData.creditHours
                    )}
                  </div>
                  <div className="text-sm font-medium text-blue-600">Credit Hours</div>
                </div>

                {/* Current Courses Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-5 text-center transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
                  <Clock size={24} className="text-purple-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="currentCourses"
                        value={formData.currentCourses}
                        onChange={handleInputChange}
                        className="w-full text-center bg-transparent border-b-2 border-purple-400 focus:border-purple-600 outline-none text-purple-700"
                      />
                    ) : (
                      formData.currentCourses
                    )}
                  </div>
                  <div className="text-sm font-medium text-purple-600">Current Courses</div>
                </div>

                {/* Hours Left Card */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-5 text-center transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
                  <Calendar size={24} className="text-orange-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-orange-700 mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="remainingHours"
                        value={formData.remainingHours}
                        onChange={handleInputChange}
                        className="w-full text-center bg-transparent border-b-2 border-orange-400 focus:border-orange-600 outline-none text-orange-700"
                      />
                    ) : (
                      formData.remainingHours
                    )}
                  </div>
                  <div className="text-sm font-medium text-orange-600">Hours Left</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Activity className="mr-3 text-purple-500" size={28} />
                  Recent Achievements
                </h3>
                <button 
                  onClick={() => setShowAchievementForm(!showAchievementForm)} 
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Plus size={16} />
                  <span className="text-sm font-medium">{showAchievementForm ? 'Cancel' : 'Add Achievement'}</span>
                </button>
              </div>
              {showAchievementForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Achievement Title</label>
                      <input
                        type="text"
                        name="title"
                        value={newAchievement.title}
                        onChange={handleAchievementChange}
                        placeholder="Enter achievement title"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Achievement Type</label>
                      <select
                        name="type"
                        value={newAchievement.type}
                        onChange={handleAchievementChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="custom">Custom</option>
                        <option value="academic">Academic</option>
                        <option value="course">Course</option>
                        <option value="competition">Competition</option>
                        <option value="research">Research</option>
                      </select>
                    </div>
                    <button
                      onClick={handleAddAchievement}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                    >
                      Add Achievement
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {formData.achievements.map(activity => {
                  const bgClass = {
                    course: 'bg-blue-50 border-blue-200',
                    academic: 'bg-yellow-50 border-yellow-200',
                    competition: 'bg-purple-50 border-purple-200',
                    research: 'bg-green-50 border-green-200',
                    custom: 'bg-indigo-50 border-indigo-200'
                  }[activity.type] || 'bg-indigo-50 border-indigo-200';

                  return (
                    <div
                      key={activity.id}
                      className={`flex items-start space-x-4 p-5 rounded-xl border-2 transition-all duration-300 hover:scale-102 hover:shadow-md ${bgClass}`}
                    >
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        {getAchievementIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills & Interests</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Zap className="mr-2 text-blue-500" size={20} />
                    Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl text-sm font-medium hover:scale-105 transition-transform cursor-pointer">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Heart className="mr-2 text-pink-500" size={20} />
                    Interests
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {formData.interests.map((interest, index) => (
                      <span key={index} className="px-4 py-2 bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 rounded-xl text-sm font-medium hover:scale-105 transition-transform cursor-pointer">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Mail size={18} className="text-gray-600" />
                  <span className="text-gray-800">{formData.email}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Phone size={18} className="text-gray-600" />
                  <span className="text-gray-800">{formData.phone}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin size={18} className="text-gray-600" />
                  <span className="text-gray-800">{formData.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-4 rounded-xl text-left transition-all duration-300 hover:scale-102 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 hover:border-blue-300 group hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-200 rounded-lg group-hover:scale-110 transition-transform">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Social Hub</div>
                        <div className="text-sm text-blue-600">Connect with peers</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button className="w-full p-4 rounded-xl text-left transition-all duration-300 hover:scale-102 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 hover:border-green-300 group hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-200 rounded-lg group-hover:scale-110 transition-transform">
                        <BookOpen size={20} className="text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Learning Hub</div>
                        <div className="text-sm text-green-600">Courses & resources</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-green-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button className="w-full p-4 rounded-xl text-left transition-all duration-300 hover:scale-102 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 hover:border-purple-300 group hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-200 rounded-lg group-hover:scale-110 transition-transform">
                        <Calendar size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Events</div>
                        <div className="text-sm text-purple-600">Campus events</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-purple-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button className="w-full p-4 rounded-xl text-left transition-all duration-300 hover:scale-102 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border border-indigo-200 hover:border-indigo-300 group hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-200 rounded-lg group-hover:scale-110 transition-transform">
                        <Briefcase size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Career Hub</div>
                        <div className="text-sm text-indigo-600">Jobs & internships</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button className="w-full p-4 rounded-xl text-left transition-all duration-300 hover:scale-102 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 hover:border-orange-300 group hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-200 rounded-lg group-hover:scale-110 transition-transform">
                        <MessageCircle size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Study Groups</div>
                        <div className="text-sm text-orange-600">Join study sessions</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Connect With Me */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Me</h3>
              <div className="space-y-3">
                {/* LinkedIn */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group hover:scale-102 hover:shadow-md">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <Linkedin size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">LinkedIn</div>
                      {(isEditing || isEditingLinkedIn) ? (
                        <div className="relative flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Linkedin size={16} className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-600" />
                            <input
                              type="text"
                              value={isEditingLinkedIn ? tempLinkedInUrl : formData.socialMedia.linkedin}
                              onChange={(e) => isEditingLinkedIn ? setTempLinkedInUrl(e.target.value) : handleInputChange({ target: { name: 'socialMedia.linkedin', value: e.target.value } })}
                              placeholder="https://linkedin.com/in/username"
                              className="w-full pl-8 pr-4 py-2 text-sm text-blue-600 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none"
                            />
                          </div>
                          {isEditingLinkedIn && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveEditing('linkedin')}
                                className="p-1 bg-green-500 hover:bg-green-600 rounded-full text-white"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => cancelEditing('linkedin')}
                                className="p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={normalizeUrl(formData.socialMedia.linkedin)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {getDisplayValue(formData.socialMedia.linkedin)}
                        </a>
                      )}
                    </div>
                  </div>
                  {!isEditing && !isEditingLinkedIn && formData.socialMedia.linkedin && (
                    <div className="flex space-x-2">
                      <a
                        href={normalizeUrl(formData.socialMedia.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-blue-500 hover:bg-blue-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={() => startEditing('linkedin')}
                        className="p-1 bg-blue-500 hover:bg-blue-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* GitHub */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group hover:scale-102 hover:shadow-md">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <Github size={20} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">GitHub</div>
                      {(isEditing || isEditingGithub) ? (
                        <div className="relative flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Github size={16} className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-600" />
                            <input
                              type="text"
                              value={isEditingGithub ? tempGithubUrl : formData.socialMedia.github}
                              onChange={(e) => isEditingGithub ? setTempGithubUrl(e.target.value) : handleInputChange({ target: { name: 'socialMedia.github', value: e.target.value } })}
                              placeholder="https://github.com/username"
                              className="w-full pl-8 pr-4 py-2 text-sm text-gray-600 bg-transparent border-b-2 border-gray-300 focus:border-gray-500 outline-none"
                            />
                          </div>
                          {isEditingGithub && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveEditing('github')}
                                className="p-1 bg-green-500 hover:bg-green-600 rounded-full text-white"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => cancelEditing('github')}
                                className="p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={normalizeUrl(formData.socialMedia.github)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:underline"
                        >
                          {getDisplayValue(formData.socialMedia.github)}
                        </a>
                      )}
                    </div>
                  </div>
                  {!isEditing && !isEditingGithub && formData.socialMedia.github && (
                    <div className="flex space-x-2">
                      <a
                        href={normalizeUrl(formData.socialMedia.github)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-gray-500 hover:bg-gray-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={() => startEditing('github')}
                        className="p-1 bg-gray-500 hover:bg-gray-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Portfolio */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 group hover:scale-102 hover:shadow-md">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="p-2 bg-indigo-200 rounded-lg">
                      <Globe size={20} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">Portfolio</div>
                      {(isEditing || isEditingPortfolio) ? (
                        <div className="relative flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Globe size={16} className="absolute left-0 top-1/2 transform -translate-y-1/2 text-indigo-600" />
                            <input
                              type="text"
                              value={isEditingPortfolio ? tempPortfolioUrl : formData.portfolio}
                              onChange={(e) => isEditingPortfolio ? setTempPortfolioUrl(e.target.value) : handleInputChange({ target: { name: 'portfolio', value: e.target.value } })}
                              placeholder="https://yourportfolio.com"
                              className="w-full pl-8 pr-4 py-2 text-sm text-indigo-600 bg-transparent border-b-2 border-indigo-300 focus:border-indigo-500 outline-none"
                            />
                          </div>
                          {isEditingPortfolio && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveEditing('portfolio')}
                                className="p-1 bg-green-5
System: 00 hover:bg-green-600 rounded-full text-white"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => cancelEditing('portfolio')}
                                className="p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={normalizeUrl(formData.portfolio)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          {getDisplayValue(formData.portfolio)}
                        </a>
                      )}
                    </div>
                  </div>
                  {!isEditing && !isEditingPortfolio && formData.portfolio && (
                    <div className="flex space-x-2">
                      <a
                        href={normalizeUrl(formData.portfolio)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-indigo-500 hover:bg-indigo-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={() => startEditing('portfolio')}
                        className="p-1 bg-indigo-500 hover:bg-indigo-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Instagram */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl hover:from-pink-100 hover:to-pink-200 transition-all duration-300 group hover:scale-102 hover:shadow-md">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="p-2 bg-pink-200 rounded-lg">
                      <Instagram size={20} className="text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">Instagram</div>
                      {(isEditing || isEditingInstagram) ? (
                        <div className="relative flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Instagram size={16} className="absolute left-0 top-1/2 transform -translate-y-1/2 text-pink-600" />
                            <input
                              type="text"
                              value={isEditingInstagram ? tempInstagramUrl : formData.socialMedia.instagram}
                              onChange={(e) => isEditingInstagram ? setTempInstagramUrl(e.target.value) : handleInputChange({ target: { name: 'socialMedia.instagram', value: e.target.value } })}
                              placeholder="https://instagram.com/username"
                              className="w-full pl-8 pr-4 py-2 text-sm text-pink-600 bg-transparent border-b-2 border-pink-300 focus:border-pink-500 outline-none"
                            />
                          </div>
                          {isEditingInstagram && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveEditing('instagram')}
                                className="p-1 bg-green-500 hover:bg-green-600 rounded-full text-white"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => cancelEditing('instagram')}
                                className="p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={normalizeUrl(formData.socialMedia.instagram)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-pink-600 hover:underline"
                        >
                          {getDisplayValue(formData.socialMedia.instagram)}
                        </a>
                      )}
                    </div>
                  </div>
                  {!isEditing && !isEditingInstagram && formData.socialMedia.instagram && (
                    <div className="flex space-x-2">
                      <a
                        href={normalizeUrl(formData.socialMedia.instagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-pink-500 hover:bg-pink-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={() => startEditing('instagram')}
                        className="p-1 bg-pink-500 hover:bg-pink-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
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