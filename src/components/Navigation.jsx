import React, { useContext, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { Users, BookOpen, Calendar, Briefcase, Users as ClubIcon, Heart, Menu, X } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const { theme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'social', label: 'Social Hub', icon: Users, activeColor: 'orange-500', activeText: 'orange-600' },
    { id: 'learning', label: 'Learning Hub', icon: BookOpen, activeColor: 'blue-500', activeText: 'blue-600' },
    { id: 'events', label: 'Events', icon: Calendar, activeColor: 'purple-500', activeText: 'purple-600' },
    { id: 'career', label: 'Career Hub', icon: Briefcase, activeColor: 'green-500', activeText: 'green-600' },
    { id: 'clubs', label: 'Clubs Hub', icon: ClubIcon, activeColor: 'yellow-500', activeText: 'yellow-600' },
    { id: 'wellness', label: 'Wellness Hub', icon: Heart, activeColor: 'pink-500', activeText: 'pink-600' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={`shadow-sm border-b ${
        theme === 'colorful' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false); 
                }}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === item.id
                    ? theme === 'colorful'
                      ? `border-${item.activeColor} text-${item.activeText}`
                      : 'border-white text-white'
                    : theme === 'colorful'
                      ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 ${
                theme === 'colorful'
                  ? 'text-gray-500 hover:text-gray-700 focus:ring-orange-500'
                  : 'text-gray-400 hover:text-white focus:ring-gray-500'
              }`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-2 pt-2 pb-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false); // Close menu after selection
                  }}
                  className={`py-2 px-3 text-left font-medium text-sm rounded-md transition-colors ${
                    activeTab === item.id
                      ? theme === 'colorful'
                        ? `bg-${item.activeColor}/10 text-${item.activeText}`
                        : 'bg-gray-700 text-white'
                      : theme === 'colorful'
                        ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;