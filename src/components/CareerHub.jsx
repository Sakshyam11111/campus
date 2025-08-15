import React from 'react';
import { Briefcase, MapPin, Users } from 'lucide-react';

const CareerHub = ({ careerResources, events }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Hub</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-4">Job & Internship Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerResources.map((resource) => (
              <div key={resource.id} className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors hover:shadow-lg">
                <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Briefcase size={16} />
                    <span>{resource.company} - {resource.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{resource.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>Major: {resource.major}</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 mt-4">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-4">Career Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors hover:shadow-lg">
                <h4 className="font-semibold text-gray-900">{event.name}</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 mt-4">
                  Join Event
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CareerHub;