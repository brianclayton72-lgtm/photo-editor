import React from 'react';
import { Upload, Edit3, Download, Sparkles, Image, Layers } from 'lucide-react';

interface HowItWorksProps {
  isDarkMode: boolean;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ isDarkMode }) => {
  const steps = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Your Images",
      description: "Drag and drop your photos or click to browse. Supports JPEG, PNG, and WebP formats.",
      details: "Single images for editing or up to 20 images for batch compression."
    },
    {
      icon: <Edit3 className="w-8 h-8" />,
      title: "Choose Your Tools",
      description: "Select from our comprehensive editing suite or batch compression tools.",
      details: "Basic filters, AI enhancements, premium tools, and quality adjustments."
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Download Results",
      description: "Get your enhanced images instantly. Single downloads or ZIP files for batches.",
      details: "High-quality outputs optimized for web, print, or social media."
    }
  ];

  const tools = [
    {
      category: "Basic Editing Tools (Free)",
      icon: <Edit3 className="w-6 h-6 text-green-600" />,
      tools: [
        { name: "Grayscale", description: "Convert images to black and white" },
        { name: "Brightness", description: "Adjust image brightness up or down" },
        { name: "Contrast", description: "Increase or decrease image contrast" },
        { name: "Rotate", description: "Rotate images 90 degrees clockwise" },
        { name: "Flip", description: "Flip images horizontally" },
        { name: "Resize", description: "Scale images from 20% to 90% of original size" },
        { name: "Reset", description: "Restore image to original state" }
      ]
    },
    {
      category: "AI-Powered Tools (Free)",
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      tools: [
        { name: "AI Auto-Enhance", description: "Automatically improve brightness, contrast, and saturation using AI algorithms" }
      ]
    },
    {
      category: "Premium Tools",
      icon: <Layers className="w-6 h-6 text-purple-600" />,
      tools: [
        { name: "AI Upscale", description: "Double image resolution with AI sharpening (up to 2000px)" },
        { name: "Brush Tool", description: "Draw and paint directly on your images" },
        { name: "Text Tool", description: "Add custom text overlays to your images" }
      ]
    },
    {
      category: "Batch Processing (Free)",
      icon: <Image className="w-6 h-6 text-orange-600" />,
      tools: [
        { name: "JPEG Compression", description: "Compress up to 20 JPEG images simultaneously" },
        { name: "Quality Control", description: "Adjust compression quality from 20% to 90%" },
        { name: "ZIP Download", description: "Download all compressed images in a single ZIP file" }
      ]
    }
  ];

  return (
    <section className={`py-20 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            How It Works
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            PhotoMix makes professional photo editing simple and accessible. Here's how to get started in just 3 easy steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <div className={`rounded-xl p-6 shadow-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                <h3 className={`text-xl font-bold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Step {index + 1}: {step.title}
                </h3>
                <p className={`mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {step.description}
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {step.details}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tools Explanation */}
        <div className="mb-16">
          <h3 className={`text-3xl font-bold mb-8 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Complete Tool Guide
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tools.map((category, index) => (
              <div key={index} className={`rounded-xl p-6 shadow-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h4 className={`text-xl font-bold ml-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.category}
                  </h4>
                </div>
                <div className="space-y-3">
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className={`border-l-4 pl-4 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <h5 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {tool.name}
                      </h5>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Pro Tips for Best Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Image Quality</h4>
              <p className="text-green-100">Use high-resolution images for best AI upscaling results</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">File Formats</h4>
              <p className="text-green-100">JPEG for photos, PNG for graphics with transparency</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Batch Processing</h4>
              <p className="text-green-100">Process similar images together for consistent results</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};