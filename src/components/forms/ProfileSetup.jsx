import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Phone, Github, Linkedin, Instagram, Globe, Award, BookOpen, Heart, ChevronRight, ChevronLeft, Check, GraduationCap } from 'lucide-react';
import Header from '../Header.jsx';
import Navigation from '../Navigation.jsx';
import { auth, db } from '../Firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const InputField = ({ name, value, onChange, placeholder, type = 'text', icon: Icon, disabled = false, textarea = false, rows = 3 }) => {
  console.log(`InputField rendered: name=${name}, value=${value}`);
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {Icon && <Icon className="h-5 w-5 text-gray-400 focus-within:text-indigo-500 transition-colors duration-200" />}
      </div>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white hover:border-gray-300'}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white hover:border-gray-300'}`}
        />
      )}
    </div>
  );
};

const SelectField = ({ name, value, onChange, options, placeholder, icon: Icon }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
      {Icon && <Icon className="h-5 w-5 text-gray-400 focus-within:text-indigo-500 transition-colors duration-200" />}
    </div>
    <select
      name={name}
      value={value}
      onChange={onChange}
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
);

const getPreviewItems = (rawText) => rawText.split(',').map(item => item.trim()).filter(item => item.length > 0);

const ProfileSetup = ({ userEmail }) => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: userEmail || auth.currentUser?.email || '',
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
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        console.log('Firestore fetch result:', { exists: docSnap.exists(), data: docSnap.data() });
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name && data.email && data.major && data.year) {
            navigate('/platform'); // Redirect to platform instead of profile
            return;
          }
          setFormData(prev => ({
            ...prev,
            ...data,
            email: userEmail || user.email || prev.email,
            skillsRaw: data.skills?.join(', ') || '',
            interestsRaw: data.interests?.join(', ') || '',
            achievements: data.achievements?.map(a => a.title).join(', ') || ''
          }));
        } else {
          setFormData(prev => ({ ...prev, email: userEmail || user.email || '' }));
        }
      }
    };
    fetchProfile();
  }, [navigate, userEmail]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name !== 'email') {
      setFormData(prev => ({ ...prev, [name]: value }));
      console.log(`Form updated: ${name}=${value}`);
    }
  }, []);

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.major || !formData.year)) {
      setError('Please fill in all required fields (Name, Email, Major, Year).');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (step < 3) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to save your profile.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!formData.name || !formData.email || !formData.major || !formData.year) {
      setError('Please fill in all required fields (Name, Email, Major, Year).');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const profileData = {
        name: formData.name,
        email: user.email, // Use auth email to ensure consistency
        major: formData.major,
        age: formData.age,
        year: formData.year,
        bio: formData.bio,
        achievements: getPreviewItems(formData.achievements).map(title => ({
          id: Date.now() + Math.random(),
          title,
          date: new Date().toLocaleDateString(),
          type: 'custom'
        })),
        phone: formData.phone,
        location: formData.location,
        portfolio: formData.portfolio,
        socialMedia: {
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          github: formData.github
        },
        skills: getPreviewItems(formData.skillsRaw),
        interests: getPreviewItems(formData.interestsRaw)
      };

      await setDoc(doc(db, 'users', user.uid), profileData);
      console.log('Profile saved:', profileData);
      setSuccessMessage('Profile saved successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/platform');
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(`Failed to save profile: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header user={{ username: formData.name || 'User' }} onLogout={() => auth.signOut()} setActiveTab={setActiveTab} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Setup</h1>
              <p className="text-gray-600">Step {step} of 3</p>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3].map(s => (
                <div key={s} className={`w-3 h-3 rounded-full ${step === s ? 'bg-indigo-500' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-600">Tell us about yourself to get started.</p>
              </div>
              <div className="space-y-6">
                <InputField name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" icon={User} />
                <InputField
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  icon={Mail}
                  disabled
                />
                <InputField name="major" value={formData.major} onChange={handleChange} placeholder="Major" icon={BookOpen} />
                <SelectField
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  options={['First', 'Second', 'Third', 'Fourth', 'Fifth']}
                  placeholder="Select Year"
                  icon={GraduationCap}
                />
                <InputField name="age" value={formData.age} onChange={handleChange} placeholder="Age" type="number" icon={Heart} />
              </div>
              <div className="pt-6 flex justify-end">
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact & Socials</h2>
                <p className="text-gray-600">Add your contact details and social media profiles.</p>
              </div>
              <div className="space-y-6">
                <InputField name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" icon={Phone} />
                <InputField name="location" value={formData.location} onChange={handleChange} placeholder="Location" icon={MapPin} />
                <InputField name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Portfolio URL" icon={Globe} />
                <InputField name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" icon={Linkedin} />
                <InputField name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Instagram Handle" icon={Instagram} />
                <InputField name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" icon={Github} />
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Achievements (Optional)</label>
                  <p className="text-xs text-gray-500 mb-3">List your notable achievements, separated by commas</p>
                  <InputField
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    placeholder="e.g., Dean's List, Hackathon Winner, Published Paper"
                    textarea={true}
                    rows={4}
                    icon={Award}
                  />
                  {formData.achievements && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getPreviewItems(formData.achievements).map((achievement, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {achievement}
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
      </main>
    </div>
  );
};

export default ProfileSetup;