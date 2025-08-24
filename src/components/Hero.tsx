import React from 'react';

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onLearnMore }) => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Effortlessly Edit & 
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"> Upscale</span> 
          <br />Your Images
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
          Enhance, resize, and optimize your photos with AI-powered tools in one powerful, easy-to-use platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onGetStarted}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            Start Editing Now
          </button>
          <button
            onClick={onLearnMore}
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};