import React from 'react';
import PropTypes from 'prop-types';
import { Award } from 'lucide-react';

const RightSidebar = () => (
  <div className="lg:w-64 space-y-6" role="region" aria-label="Sidebar with active users and achievements">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4 text-lg">Active Now</h3>
      <div className="space-y-3">
        {['Sakshyam Shrestha', 'Sarthak Adhakari', 'Suhil Joshi', 'Samir Joshi'].map((name, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{name}</div>
              <div className="text-xs text-gray-500">Online now</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full" aria-label={`${name} is online`}></div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
      <Award size={32} className="mb-3" aria-hidden="true" />
      <h3 className="font-bold text-lg mb-2">Achievement Unlocked!</h3>
      <p className="text-sm opacity-90">Study Streak: 7 days</p>
      <p className="text-xs mt-2 opacity-75">Keep it up, Texas Longhorn! 🤘</p>
    </div>
  </div>
);

RightSidebar.propTypes = {};

export default React.memo(RightSidebar);