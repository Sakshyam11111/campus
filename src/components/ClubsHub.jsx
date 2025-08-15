import React from 'react';
import { Users, MapPin, Calendar } from 'lucide-react';

const ClubsHub = ({ clubs, events }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Clubs & Organizations Hub</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-4">Active Clubs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clubs.map((club) => (
              <div key={club.id} className="border border-gray-200 rounded-xl p-6 hover:border-yellow-300 transition-colors hover:shadow-lg">
                <h4 className="font-semibold text-gray-900">{club.name}</h4>
                <div className="space-y-2 text-gray-600">
                  <p>{club.description}</p>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>Next Meeting: {club.nextMeeting}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{club.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>{club.members} members</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 mt-4">
                  Join Club
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-4">Club Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-xl p-6 hover:border-yellow-300 transition-colors hover:shadow-lg">
                <h4 className="font-semibold text-gray-900">{event.name}</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 mt-4">
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

export default ClubsHub;