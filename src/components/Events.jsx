import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

const events = [
  { id: 1, name: "Texas Tech Fair 2025", date: "Aug 20", time: "10AM-4PM", location: "Main Quad", attendees: 234 },
  { id: 2, name: "Study Abroad Info Session", date: "Aug 22", time: "6PM", location: "Student Center", attendees: 45 },
  { id: 3, name: "Career Networking Night", date: "Aug 25", time: "7PM", location: "Business Building", attendees: 156 }
];

const Events = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors hover:shadow-lg">
            <h3 className="font-semibold text-gray-900 text-lg mb-2">{event.name}</h3>
            <div className="space-y-2 text-gray-600 mb-4">
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
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105">
              Join Event
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Events;