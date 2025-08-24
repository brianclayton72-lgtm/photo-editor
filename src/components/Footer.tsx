import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className={`py-12 transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-gray-300' : 'bg-gray-900 text-gray-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg mb-4">
          &copy; 2025 PhotoMix. All rights reserved.
        </p>
        <div className="flex justify-center space-x-8">
          <a 
            href="#" 
            className="hover:text-green-400 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="hover:text-green-400 transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            className="hover:text-green-400 transition-colors duration-200"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};