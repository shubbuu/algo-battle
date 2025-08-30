'use client';

import { useState, useEffect } from 'react';
import { Code, Trophy, Zap, Target } from 'lucide-react';
import { HEADER } from '@/constants';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > HEADER.SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 lg:py-6">
                     {/* Logo and Brand */}
           <div className="flex items-center space-x-3">
             <div className={`relative flex-shrink-0 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform duration-300`}>
               <div className="w-12 h-12 bg-white/20 dark:bg-gray-800/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30 dark:border-gray-700/30">
                 <Code className={`w-7 h-7 ${isScrolled ? 'text-blue-600 dark:text-blue-400' : 'text-white'}`} />
               </div>
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
             </div>
             
             <div className="flex flex-col justify-center">
               <h1 className={`text-xl lg:text-2xl font-bold leading-tight transition-colors duration-300 ${
                 isScrolled 
                   ? 'text-gray-900 dark:text-white' 
                   : 'text-white'
               }`}>
                 {HEADER.BRAND_NAME}
               </h1>
               <span className={`text-xs lg:text-sm leading-tight transition-colors duration-300 ${
                 isScrolled 
                   ? 'text-gray-500 dark:text-gray-400' 
                   : 'text-blue-100 dark:text-blue-200'
               }`}>
                 {HEADER.TAGLINE}
               </span>
             </div>
           </div>

          {/* Navigation and Stats */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className={`w-4 h-4 ${isScrolled ? 'text-yellow-500' : 'text-yellow-300'}`} />
                                 <span className={`text-sm font-medium transition-colors duration-300 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300' 
                     : 'text-white'
                 }`}>
                   {HEADER.STATS.SOLVED}
                 </span>
                <span className={`text-xs transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-500 dark:text-gray-400' 
                    : 'text-blue-100 dark:text-blue-200'
                }`}>
                  Solved
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Zap className={`w-4 h-4 ${isScrolled ? 'text-orange-500' : 'text-orange-300'}`} />
                                 <span className={`text-sm font-medium transition-colors duration-300 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300' 
                     : 'text-white'
                 }`}>
                   {HEADER.STATS.STREAK}
                 </span>
                <span className={`text-xs transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-500 dark:text-gray-400' 
                    : 'text-blue-100 dark:text-blue-200'
                }`}>
                  Streak
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Target className={`w-4 h-4 ${isScrolled ? 'text-green-500' : 'text-green-300'}`} />
                                 <span className={`text-sm font-medium transition-colors duration-300 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300' 
                     : 'text-white'
                 }`}>
                   {HEADER.STATS.ACCURACY}
                 </span>
                <span className={`text-xs transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-500 dark:text-gray-400' 
                    : 'text-blue-100 dark:text-blue-200'
                }`}>
                  Accuracy
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
                             <a 
                 href="#" 
                 className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                     : 'text-white hover:text-blue-100'
                 }`}
               >
                 {HEADER.NAVIGATION.PROBLEMS}
               </a>
               <a 
                 href="#" 
                 className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                     : 'text-white hover:text-blue-100'
                 }`}
               >
                 {HEADER.NAVIGATION.LEADERBOARD}
               </a>
               <a 
                 href="#" 
                 className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                     : 'text-white hover:text-blue-100'
                 }`}
               >
                 {HEADER.NAVIGATION.PROFILE}
               </a>
            </nav>

            {/* CTA Button */}
                         <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
               isScrolled 
                 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                 : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
             }`}>
               {HEADER.CTA}
             </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className={`p-2 rounded-lg transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                : 'text-white hover:bg-white/20'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {!isScrolled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -top-5 -right-5 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 left-1/4 w-12 h-12 bg-blue-400/20 rounded-full blur-xl"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
