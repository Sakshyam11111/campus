import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Video, Plus, FileText, Users, Clock, MapPin, BookOpen, Calendar, Award, TrendingUp, Search, Filter, Star, Bell, ChevronDown, ChevronUp, Play, Download, Share2 } from 'lucide-react';

const initialCourses = [
  { 
    id: 1, 
    name: "Advanced Web Development", 
    instructor: "Dr. Smith", 
    progress: 75, 
    nextClass: "Mon 10AM", 
    assignment: "React Project Due",
    category: "Computer Science",
    difficulty: "Advanced",
    rating: 4.8,
    totalStudents: 45,
    upcomingDeadlines: 2,
    materials: 12,
    isBookmarked: false,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    id: 2, 
    name: "Database Systems", 
    instructor: "Prof. Johnson", 
    progress: 60, 
    nextClass: "Tue 2PM", 
    assignment: "SQL Quiz Tomorrow",
    category: "Computer Science",
    difficulty: "Intermediate",
    rating: 4.6,
    totalStudents: 38,
    upcomingDeadlines: 1,
    materials: 8,
    isBookmarked: true,
    color: "from-green-500 to-emerald-500"
  },
  { 
    id: 3, 
    name: "Machine Learning", 
    instructor: "Dr. Williams", 
    progress: 40, 
    nextClass: "Wed 11AM", 
    assignment: "Model Training Lab",
    category: "AI/Data Science",
    difficulty: "Advanced",
    rating: 4.9,
    totalStudents: 52,
    upcomingDeadlines: 3,
    materials: 15,
    isBookmarked: false,
    color: "from-purple-500 to-violet-500"
  },
  { 
    id: 4, 
    name: "Linear Algebra", 
    instructor: "Prof. Davis", 
    progress: 85, 
    nextClass: "Thu 9AM", 
    assignment: "Vector Spaces Problem Set",
    category: "Mathematics",
    difficulty: "Intermediate",
    rating: 4.4,
    totalStudents: 67,
    upcomingDeadlines: 1,
    materials: 10,
    isBookmarked: true,
    color: "from-orange-500 to-red-500"
  }
];

const initialStudyGroups = [
  { 
    id: 1, 
    name: "Calculus III Study Group", 
    members: 8, 
    maxMembers: 12,
    subject: "Mathematics", 
    nextSession: "Today 6PM", 
    location: "Library Room 204",
    isOnline: false,
    description: "Weekly problem-solving sessions covering multivariable calculus",
    difficulty: "Intermediate",
    rating: 4.7,
    isJoined: false,
    tags: ["Problem Solving", "Exam Prep"],
    recurring: "Weekly"
  },
  { 
    id: 2, 
    name: "Organic Chemistry Lab", 
    members: 12, 
    maxMembers: 15,
    subject: "Chemistry", 
    nextSession: "Tomorrow 2PM", 
    location: "Science Building",
    isOnline: false,
    description: "Hands-on lab practice and discussion of synthesis mechanisms",
    difficulty: "Advanced",
    rating: 4.5,
    isJoined: true,
    tags: ["Lab Work", "Synthesis"],
    recurring: "Bi-weekly"
  },
  { 
    id: 3, 
    name: "Data Science Project Team", 
    members: 6, 
    maxMembers: 8,
    subject: "Computer Science", 
    nextSession: "Friday 4PM", 
    location: "Online",
    isOnline: true,
    description: "Collaborative projects using Python and machine learning frameworks",
    difficulty: "Advanced",
    rating: 4.9,
    isJoined: false,
    tags: ["Python", "ML", "Projects"],
    recurring: "Weekly"
  },
  { 
    id: 4, 
    name: "Business Statistics Help", 
    members: 15, 
    maxMembers: 20,
    subject: "Business", 
    nextSession: "Mon 7PM", 
    location: "Business Building",
    isOnline: false,
    description: "Peer tutoring for statistical analysis and business applications",
    difficulty: "Beginner",
    rating: 4.3,
    isJoined: false,
    tags: ["Statistics", "Tutoring"],
    recurring: "Weekly"
  }
];

const LearningHub = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [studyGroups, setStudyGroups] = useState(initialStudyGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const [sortBy, setSortBy] = useState('progress');
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subject: '',
  });

  // Handle modal dismissal on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') setShowCreateGroup(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Filter and search functionality
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes

(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(course => course.category === selectedFilter);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.progress - a.progress;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [courses, searchTerm, selectedFilter, sortBy]);

  const filteredStudyGroups = useMemo(() => {
    return studyGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [studyGroups, searchTerm]);

  const handleBookmarkCourse = useCallback((courseId) => {
    setCourses(prev => prev.map(course =>
      course.id === courseId ? { ...course, isBookmarked: !course.isBookmarked } : course
    ));
  }, []);

  const handleJoinGroup = useCallback((groupId) => {
    setStudyGroups(prev => prev.map(group =>
      group.id === groupId 
        ? { 
            ...group, 
            isJoined: !group.isJoined,
            members: group.isJoined ? group.members - 1 : group.members + 1
          } 
        : group
    ));
  }, []);

  const toggleCourseExpansion = useCallback((courseId) => {
    setExpandedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  }, []);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors.Beginner;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-green-400 to-green-600';
    if (progress >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.description || !newGroup.subject) {
      alert('Please fill in all fields');
      return;
    }
    setStudyGroups(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: newGroup.name,
        description: newGroup.description,
        subject: newGroup.subject,
        members: 1,
        maxMembers: 10,
        nextSession: 'TBD',
        location: 'TBD',
        isOnline: false,
        difficulty: 'Beginner',
        rating: 0,
        isJoined: true,
        tags: [],
        recurring: 'Weekly'
      }
    ]);
    setShowCreateGroup(false);
    setNewGroup({ name: '', description: '', subject: '' });
    alert('Study group created successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main" aria-label="Learning Hub">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6">
            <div className="mb-4 xl:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Smart Learning Hub</h2>
              <p className="text-blue-100 text-base md:text-lg">Your personalized academic command center</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{courses.length}</div>
                <div className="text-xs md:text-sm text-blue-100 whitespace-nowrap">Active Courses</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{studyGroups.filter(g => g.isJoined).length}</div>
                <div className="text-xs md:text-sm text-blue-100 whitespace-nowrap">Study Groups</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <button 
              className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-opacity-20 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-opacity-30 transition-all transform hover:scale-105 group text-center"
              aria-label="Join study room"
            >
              <Video size={20} className="mb-2 mx-auto group-hover:scale-110 transition-transform md:w-6 md:h-6" aria-hidden="true" />
              <div className="text-xs md:text-sm font-medium">Join Study Room</div>
              <div className="text-xs text-blue-100 mt-1 hidden md:block">Start video session</div>
            </button>
            <button 
              onClick={() => setShowCreateGroup(true)}
              className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-opacity-20 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-opacity-30 transition-all transform hover:scale-105 group text-center"
              aria-label="Create new study group"
            >
              <Plus size={20} className="mb-2 mx-auto group-hover:rotate-90 transition-transform md:w-6 md:h-6" aria-hidden="true" />
              <div className="text-xs md:text-sm font-medium">Create Group</div>
              <div className="text-xs text-blue-100 mt-1 hidden md:block">Start new study group</div>
            </button>
            <button 
              className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-opacity-20 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-opacity-30 transition-all transform hover:scale-105 group text-center"
              aria-label="Share notes"
            >
              <FileText size={20} className="mb-2 mx-auto group-hover:scale-110 transition-transform md:w-6 md:h-6" aria-hidden="true" />
              <div className="text-xs md:text-sm font-medium">Share Notes</div>
              <div className="text-xs text-blue-100 mt-1 hidden md:block">Upload & collaborate</div>
            </button>
            <button 
              className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-opacity-20 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-opacity-30 transition-all transform hover:scale-105 group text-center"
              aria-label="View schedule"
            >
              <Calendar size={20} className="mb-2 mx-auto group-hover:scale-110 transition-transform md:w-6 md:h-6" aria-hidden="true" />
              <div className="text-xs md:text-sm font-medium">Schedule</div>
              <div className="text-xs text-blue-100 mt-1 hidden md:block">View calendar</div>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search courses, instructors, or topics..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search courses, instructors, or topics"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'courses'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
                aria-pressed={activeTab === 'courses'}
                aria-label="View courses"
              >
                <BookOpen size={16} className="inline mr-2" aria-hidden="true" />
                Courses
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'groups'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
                aria-pressed={activeTab === 'groups'}
                aria-label="View study groups"
              >
                <Users size={16} className="inline mr-2" aria-hidden="true" />
                Study Groups
              </button>
            </div>
            
            {activeTab === 'courses' && (
              <>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="AI/Data Science">AI/Data Science</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Sort courses"
                >
                  <option value="progress">Sort by Progress</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="name">Sort by Name</option>
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Courses</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp size={16} aria-hidden="true" />
              <span>Average Progress: {Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)}%</span>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const isExpanded = expandedCourses.has(course.id);
              return (
                <div key={course.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">{course.name}</h4>
                        <button
                          onClick={() => handleBookmarkCourse(course.id)}
                          className={`transition-colors ${course.isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                          aria-label={course.isBookmarked ? `Unbookmark ${course.name}` : `Bookmark ${course.name}`}
                        >
                          <Star size={20} fill={course.isBookmarked ? 'currentColor' : 'none'} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="font-medium">{course.instructor}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500 fill-current" aria-hidden="true" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCourseExpansion(course.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={isExpanded ? `Collapse ${course.name} details` : `Expand ${course.name} details`}
                    >
                      {isExpanded ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="font-bold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                        role="progressbar"
                        aria-valuenow={course.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock size={16} aria-hidden="true" />
                      <span>Next: {course.nextClass}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-orange-600 font-medium">
                      <Bell size={16} aria-hidden="true" />
                      <span>{course.assignment}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-blue-600">{course.totalStudents}</div>
                          <div className="text-xs text-blue-600">Students</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-orange-600">{course.upcomingDeadlines}</div>
                          <div className="text-xs text-orange-600">Deadlines</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-green-600">{course.materials}</div>
                          <div className="text-xs text-green-600">Materials</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                          aria-label={`Join ${course.name} class`}
                        >
                          <Play size={16} aria-hidden="true" />
                          <span>Join Class</span>
                        </button>
                        <button 
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                          aria-label={`Download materials for ${course.name}`}
                        >
                          <Download size={16} aria-hidden="true" />
                          <span>Materials</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Study Groups Section */}
      {activeTab === 'groups' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Study Groups</h3>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2"
              aria-label="Create new study group"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Create New Group</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudyGroups.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">{group.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {group.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Star size={14} className="text-yellow-500 fill-current" aria-hidden="true" />
                    <span className="font-medium">{group.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users size={16} aria-hidden="true" />
                    <span>{group.members}/{group.maxMembers} members</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={16} aria-hidden="true" />
                    <span>{group.nextSession}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin size={16} aria-hidden="true" />
                    <span className={group.isOnline ? 'text-green-600' : ''}>{group.location}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(group.difficulty)}`}>
                    {group.difficulty}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                      group.isJoined
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg'
                    }`}
                    aria-label={group.isJoined ? `Leave ${group.name}` : `Join ${group.name}`}
                  >
                    {group.isJoined ? 'Joined' : 'Join Group'}
                  </button>
                  <button 
                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-all"
                    aria-label={`Share ${group.name}`}
                  >
                    <Share2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateGroup(false)}
          role="dialog"
          aria-labelledby="create-group-title"
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="create-group-title" className="text-xl font-bold mb-4">Create Study Group</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Group name"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                aria-label="Study group name"
              />
              <textarea
                placeholder="Description"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                aria-label="Study group description"
              />
              <select
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={newGroup.subject}
                onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
                aria-label="Select subject"
              >
                <option value="">Select subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  aria-label="Cancel creating study group"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                  aria-label="Create study group"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

LearningHub.propTypes = {};

export default LearningHub;