import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TrendingUp } from 'lucide-react';
import { db } from './Firebase'; // Adjust the import path based on your Firebase config
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const LeftSidebar = () => {
  const [activeStudents, setActiveStudents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active students count from Firestore
  useEffect(() => {
    // Define the query for active students (e.g., users with active: true or recent activity)
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('active', '==', true)); // Adjust condition as needed

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeCount = snapshot.docs.length;
      setActiveStudents(activeCount);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching active students:', error);
      setActiveStudents(0); // Fallback value
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
    <div className="lg:w-64 space-y-6" role="region" aria-label="Sidebar with quick stats and trending topics">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Active Students</span>
            <span className="font-bold text-orange-600">
              {isLoading ? 'Loading...' : activeStudents}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Study Groups</span>
            <span className="font-bold text-blue-600">156</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Events Today</span>
            <span className="font-bold text-purple-600">8</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Trending Topics</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-green-500" aria-hidden="true" />
            <span className="text-sm text-gray-700">#MidtermPrep</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-blue-500" aria-hidden="true" />
            <span className="text-sm text-gray-700">#TechFair2025</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-purple-500" aria-hidden="true" />
            <span className="text-sm text-gray-700">#StudyAbroad</span>
          </div>
        </div>
      </div>
    </div>
  );
};

LeftSidebar.propTypes = {};

export default React.memo(LeftSidebar);