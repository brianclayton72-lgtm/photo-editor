import React from 'react';

interface CallToActionProps {
  onGetStarted: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onGetStarted }) => {
  return (
    <section className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Images?
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
          Join thousands of users who trust our AI-powered tools for their image optimization needs. 
          Start now and see the difference.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
};