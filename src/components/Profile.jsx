// Profile.jsx (New component for added feature)
import React from 'react';
import { User, Mail, BookOpen } from 'lucide-react';

const Profile = ({ user }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <User size={24} className="text-orange-500" />
        <span className="text-lg font-medium">{user.username}</span>
      </div>
      <div className="flex items-center space-x-4">
        <Mail size={24} className="text-blue-500" />
        <span>{user.email}</span>
      </div>
      <div className="flex items-center space-x-4">
        <BookOpen size={24} className="text-purple-500" />
        <span>Major: Computer Science (Edit to add more details)</span>
      </div>
      {/* Added feature: Edit profile button */}
      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
        Edit Profile
      </button>
    </div>
  </div>
);

export default Profile;