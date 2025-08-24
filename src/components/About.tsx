import React from 'react';
import { Camera, Zap, Shield, Users } from 'lucide-react';

interface AboutProps {
  isDarkMode: boolean;
}

export const About: React.FC<AboutProps> = ({ isDarkMode }) => {
  return (
    <section className={`py-20 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About PhotoMix
          </h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            PhotoMix is a cutting-edge AI-powered photo editing platform designed to make professional image editing accessible to everyone. Whether you're a photographer, blogger, business owner, or creative enthusiast, our tools help you enhance, optimize, and transform your images with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className={`text-3xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Our Mission
            </h3>
            <p className={`text-lg mb-6 leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We believe that powerful photo editing shouldn't require expensive software or years of training. PhotoMix combines advanced AI technology with an intuitive interface to deliver professional results in seconds.
            </p>
            <p className={`text-lg leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              From simple adjustments to complex AI-powered enhancements, we're here to help you bring your creative vision to life while saving time and effort.
            </p>
          </div>
          <div className={`rounded-xl p-8 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-green-900 to-blue-900' 
              : 'bg-gradient-to-br from-green-100 to-blue-100'
          }`}>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Camera size={24} />
                </div>
                <h4 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>AI-Powered</h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Advanced algorithms</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Zap size={24} />
                </div>
                <h4 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Lightning Fast</h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Instant processing</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Shield size={24} />
                </div>
                <h4 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>100% Secure</h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Privacy protected</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Users size={24} />
                </div>
                <h4 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>User-Friendly</h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>No learning curve</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <h3 className={`text-2xl font-bold mb-6 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            What Makes Us Different
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className={`text-lg font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No Software Installation
              </h4>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Everything runs in your browser. No downloads, no installations, no compatibility issues.
              </p>
            </div>
            <div className="text-center">
              <h4 className={`text-lg font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Privacy First
              </h4>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Your images are processed locally and never stored on our servers. Complete privacy guaranteed.
              </p>
            </div>
            <div className="text-center">
              <h4 className={`text-lg font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Professional Results
              </h4>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                AI-powered tools deliver professional-quality results that rival expensive desktop software.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};