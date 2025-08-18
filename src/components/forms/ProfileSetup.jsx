import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Phone, Github, Linkedin, Instagram, Globe, Award, BookOpen, Heart, ChevronRight, ChevronLeft, Check } from 'lucide-react';

// Memoize InputField with explicit prop comparison
const InputField = React.memo(
  ({ name, value, onChange, placeholder, type = 'text', icon: Icon, disabled = false, textarea = false, rows = 3 }) => {
    console.log(`InputField rendered: name=${name}, value=${value}`); // Debug rendering
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {Icon && <Icon className="h-5 w-5 text-gray-400 focus-within:text-indigo-500 transition-colors duration-200" />}
        </div>
        {textarea ? (
          <textarea
            key={name}
            name={name}
            value={value}
            onChange={(e) => {
              console.log(`InputField onChange: name=${name}, value=${e.target.value}`); // Debug onChange
              onChange(e);
            }}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white hover:border-gray-300'}`}
          />
        ) : (
          <input
            key={name}
            type={type}
            name={name}
            value={value}
            onChange={(e) => {
              console.log(`InputField onChange: name=${name}, value=${e.target.value}`); // Debug onChange
              onChange(e);
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white hover:border-gray-300'}`}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.name === nextProps.name &&
      prevProps.value === nextProps.value &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.placeholder === nextProps.placeholder &&
      prevProps.type === nextProps.type &&
      prevProps.textarea === nextProps.textarea &&
      prevProps.rows === nextProps.rows &&
      prevProps.icon === nextProps.icon
    );
  }
);

// Memoize SelectField with explicit prop comparison
const SelectField = React.memo(
  ({ name, value, onChange, options, placeholder, icon: Icon }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        {Icon && <Icon className="h-5 w-5 text-gray-400 focus-within:text-indigo-500 transition-colors duration-200" />}
      </div>
      <select
        key={name}
        name={name}
        value={value}
        onChange={(e) => {
          console.log(`SelectField onChange: name=${name}, value=${e.target.value}`); // Debug onChange
          onChange(e);
        }}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300 appearance-none`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
      </div>
    </div>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.name === nextProps.name &&
      prevProps.value === nextProps.value &&
      prevProps.placeholder === nextProps.placeholder &&
      prevProps.options === nextProps.options &&
      prevProps.icon === nextProps.icon
    );
  }
);

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: 'user@example.com',
    major: '',
    age: '',
    year: '',
    bio: '',
    achievements: '',
    phone: '',
    location: '',
    portfolio: '',
    linkedin: '',
    instagram: '',
    github: '',
    skillsRaw: '',
    interestsRaw: ''
  });
  const navigate = useNavigate();

  // Mock user for Header component
  const mockUser = {
    username: formData.name || 'User',
    email: formData.email || 'user@example.com'
  };

  // Memoize handleChange to prevent re-creation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log(`handleChange: name=${name}, value=${value}`); // Debug log
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Process skills and interests for preview
  const getPreviewItems = (rawInput) => {
    return rawInput ? rawInput.split(',').map(item => item.trim()).filter(Boolean) : [];
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    const skills = getPreviewItems(formData.skillsRaw);
    const interests = getPreviewItems(formData.interestsRaw);
    const achievementsArray = formData.achievements
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map(title => ({
        id: Date.now() + Math.random(),
        title,
        date: new Date().toLocaleDateString(),
        type: 'custom'
      }));

    const updatedData = {
      ...formData,
      skills,
      interests,
      achievements: achievementsArray,
      socialMedia: {
        linkedin: formData.linkedin,
        github: formData.github,
        instagram: formData.instagram
      }
    };
    console.log('Profile data:', updatedData);
    navigate('/profile', { state: { profileData: updatedData } });
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    navigate('/');
  };

  const steps = [
    { id: 1, name: 'Basic Info', icon: User },
    { id: 2, name: 'Contact & Links', icon: Mail },
    { id: 3, name: 'Skills & Interests', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Profile Setup</h1>
                <p className="text-sm text-gray-500">{mockUser.username}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => {
              const StepIcon = stepItem.icon;
              const isActive = step === stepItem.id;
              const isCompleted = step > stepItem.id;
              
              return (
                <div key={stepItem.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 
                    isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                    <span className="font-medium text-sm">{stepItem.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 w-16 mx-4 transition-colors duration-300 ${
                      step > stepItem.id ? 'bg-green-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's get to know you</h2>
                  <p className="text-gray-600">Tell us about your basic information and background</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <InputField
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      icon={User}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Major</label>
                    <InputField
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      placeholder="Your field of study"
                      icon={BookOpen}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                    <InputField
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Your age"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                    <SelectField
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      options={['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']}
                      placeholder="Select your year"
                      icon={BookOpen}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <InputField
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    icon={User}
                    textarea={true}
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Achievements</label>
                  <InputField
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    placeholder="List your achievements (comma separated)"
                    icon={Award}
                    textarea={true}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact & Social Links</h2>
                  <p className="text-gray-600">How can people reach you and view your work? Enter full URLs for social links.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <InputField
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@domain.com"
                      icon={Mail}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <InputField
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      icon={Phone}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <InputField
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State/Country"
                      icon={MapPin}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio Website</label>
                    <InputField
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      icon={Globe}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn Profile</label>
                    <InputField
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      icon={Linkedin}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub Profile</label>
                    <InputField
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                      icon={Github}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram Profile (Optional)</label>
                    <InputField
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/username"
                      icon={Instagram}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <button
                    onClick={prevStep}
                    className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-all duration-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills & Interests</h2>
                  <p className="text-gray-600">What are you passionate about and what can you do?</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Technical Skills</label>
                    <p className="text-xs text-gray-500 mb-3">Separate each skill with a comma (e.g., Python, JavaScript, React)</p>
                    <InputField
                      name="skillsRaw"
                      value={formData.skillsRaw}
                      onChange={handleChange}
                      placeholder="Python, JavaScript, React, Node.js, Machine Learning, SQL, Git, Docker..."
                      textarea={true}
                      rows={4}
                    />
                    {formData.skillsRaw && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {getPreviewItems(formData.skillsRaw).map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Interests & Hobbies</label>
                    <p className="text-xs text-gray-500 mb-3">What do you enjoy doing in your free time?</p>
                    <InputField
                      name="interestsRaw"
                      value={formData.interestsRaw}
                      onChange={handleChange}
                      placeholder="Coding, Reading, Photography, Travel, Music, Sports, Volunteering, Art..."
                      textarea={true}
                      rows={4}
                    />
                    {formData.interestsRaw && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {getPreviewItems(formData.interestsRaw).map((interest, index) => (
                          <span key={index} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between pt-6">
                  <button
                    onClick={prevStep}
                    className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-all duration-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Check className="h-5 w-5" />
                    <span>Complete Setup</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;