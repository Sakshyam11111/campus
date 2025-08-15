// LandingPage.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme = 'colorful' } = useContext(ThemeContext) || {}; // Fallback to 'colorful' if context is missing
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await navigate('/login'); // Simulate async navigation
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      await navigate('/signup'); // Simulate async navigation
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        theme === 'colorful'
          ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50'
          : 'bg-gray-900'
      }`}
    >
      {/* Animated background elements with reduced motion support */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-orange-400 rounded-full animate-pulse motion-reduce:animate-none"
        ></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-red-400 rounded-full animate-bounce motion-reduce:animate-none"
        ></div>
        <div
          className="absolute bottom-32 left-40 w-20 h-20 bg-pink-400 rounded-full animate-pulse motion-reduce:animate-none"
        ></div>
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-400 rounded-full animate-bounce motion-reduce:animate-none"
        ></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo/Brand */}
        <div
          className="mb-8 transform hover:scale-105 transition-transform duration-300"
          role="img"
          aria-label="Texas Campus Logo"
        >
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl ${
              theme === 'colorful'
                ? 'bg-gradient-to-br from-orange-500 to-red-600'
                : 'bg-gray-700'
            }`}
          >
            <span className="text-3xl font-bold text-white">TC</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1
          className={`text-5xl md:text-7xl font-black text-transparent bg-clip-text ${
            theme === 'colorful'
              ? 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600'
              : 'bg-gradient-to-r from-gray-300 to-gray-500'
          } mb-6 text-center leading-tight`}
        >
          Texas Campus
        </h1>

        {/* Subtitle with animation */}
        <div
          className={`text-xl md:text-2xl font-medium ${
            theme === 'colorful' ? 'text-gray-700' : 'text-gray-300'
          } mb-4 flex items-center justify-center gap-2`}
        >
          <span
            role="img"
            aria-label="Handshake"
            className="inline-block animate-bounce motion-reduce:animate-none"
          >
            🤝
          </span>
          <span>Connect</span>
          <span className={theme === 'colorful' ? 'text-orange-500' : 'text-gray-400'}>•</span>
          <span>
            <span
              role="img"
              aria-label="Book"
              className="inline-block animate-pulse motion-reduce:animate-none"
            >
              📚
            </span>
            Learn
          </span>
          <span className={theme === 'colorful' ? 'text-orange-500' : 'text-gray-400'}>•</span>
          <span>
            <span
              role="img"
              aria-label="Seedling"
              className="inline-block animate-bounce motion-reduce:animate-none"
            >
              🌱
            </span>
            Grow
          </span>
        </div>

        {/* Description */}
        <p
          className={`text-lg ${
            theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'
          } mb-12 text-center max-w-2xl leading-relaxed`}
        >
          Join the vibrant Texas campus community where students connect, collaborate,
          and create lasting memories while pursuing academic excellence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            aria-label="Navigate to login page"
            className={`group relative px-8 py-4 min-w-[150px] ${
              theme === 'colorful'
                ? 'bg-gradient-to-r from-orange-500 to-red-600'
                : 'bg-gray-700'
            } text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 text-center ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="relative z-10">{isLoading ? 'Loading...' : 'Get Started'}</span>
            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={handleSignup}
            disabled={isLoading}
            aria-label="Navigate to signup page"
            className={`group px-8 py-4 min-w-[150px] ${
              theme === 'colorful'
                ? 'bg-white text-gray-800 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                : 'bg-gray-800 text-gray-300 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-700'
            } font-semibold rounded-xl transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 text-center ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="relative z-10">{isLoading ? 'Loading...' : 'Create Account'}</span>
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
          <div
            className={`text-center p-6 ${
              theme === 'colorful' ? 'bg-white/80' : 'bg-gray-800/80'
            } backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border ${
              theme === 'colorful' ? 'border-white/50' : 'border-gray-700'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                theme === 'colorful'
                  ? 'bg-gradient-to-br from-orange-400 to-red-500'
                  : 'bg-gray-700'
              }`}
            >
              <span role="img" aria-label="Graduation Cap" className="text-2xl">
                🎓
              </span>
            </div>
            <h3
              className={`font-bold ${
                theme === 'colorful' ? 'text-gray-800' : 'text-gray-200'
              } mb-2`}
            >
              Academic Excellence
            </h3>
            <p
              className={`text-sm ${
                theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              Access top-tier education with world-class faculty and resources
            </p>
          </div>

          <div
            className={`text-center p-6 ${
              theme === 'colorful' ? 'bg-white/80' : 'bg-gray-800/80'
            } backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border ${
              theme === 'colorful' ? 'border-white/50' : 'border-gray-700'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                theme === 'colorful'
                  ? 'bg-gradient-to-br from-red-400 to-pink-500'
                  : 'bg-gray-700'
              }`}
            >
              <span role="img" aria-label="Handshake" className="text-2xl">
                🤝
              </span>
            </div>
            <h3
              className={`font-bold ${
                theme === 'colorful' ? 'text-gray-800' : 'text-gray-200'
              } mb-2`}
            >
              Community
            </h3>
            <p
              className={`text-sm ${
                theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              Build lifelong friendships and professional networks
            </p>
          </div>

          <div
            className={`text-center p-6 ${
              theme === 'colorful' ? 'bg-white/80' : 'bg-gray-800/80'
            } backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border ${
              theme === 'colorful' ? 'border-white/50' : 'border-gray-700'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                theme === 'colorful'
                  ? 'bg-gradient-to-br from-pink-400 to-orange-500'
                  : 'bg-gray-700'
              }`}
            >
              <span role="img" aria-label="Rocket" className="text-2xl">
                🚀
              </span>
            </div>
            <h3
              className={`font-bold ${
                theme === 'colorful' ? 'text-gray-800' : 'text-gray-200'
              } mb-2`}
            >
              Innovation
            </h3>
            <p
              className={`text-sm ${
                theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              Cutting-edge technology and forward-thinking programs
            </p>
          </div>
        </div>

        {/* Success Rate Section */}
        <div className="mt-12 text-center">

          <p
            className={`text-lg ${
              theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'
            }`}
          >
            Over 90% of active students achieve their academic goals.
          </p>
        </div>

        {/* Footer */}
        <div
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm mb-4 ${
            theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          © {new Date().getFullYear()} Texas Campus. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;