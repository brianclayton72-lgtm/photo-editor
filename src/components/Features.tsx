import React from 'react';
import { Zap, Shield, Images, CheckCircle } from 'lucide-react';

interface FeaturesProps {
  isDarkMode: boolean;
}

export const Features: React.FC<FeaturesProps> = ({ isDarkMode }) => {
  const features = [
    {
      icon: <Zap className="w-12 h-12 text-green-600" />,
      title: 'Fast & Easy',
      description: 'Upload and process your images in seconds. No technical knowledge required, just drag, drop, and edit.'
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-green-600" />,
      title: 'Quality Preservation',
      description: 'Advanced algorithms maintain visual quality while reducing file size. Adjust compression levels to fit your needs.'
    },
    {
      icon: <Images className="w-12 h-12 text-green-600" />,
      title: 'Batch Processing',
      description: 'Compress up to 20 images at once. Perfect for photographers, bloggers, and businesses with multiple image needs.'
    },
    {
      icon: <Shield className="w-12 h-12 text-green-600" />,
      title: 'Secure & Private',
      description: 'Your images are processed locally and securely. We never store your photos on our servers for complete privacy.'
    }
  ];

  return (
    <section className={`py-20 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Why Choose PhotoMix?
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Our powerful technology delivers the perfect balance of creative control and file size reduction.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-750' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};