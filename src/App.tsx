import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser, saveEditHistory } from './lib/supabase';
import   Header  from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { About } from './components/About';
import { HowItWorks } from './components/HowItWorks';
import { ImageEditor } from './components/ImageEditor';
import { BatchCompressor } from './components/BatchCompressor';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { Contact } from './components/Contact';
import { AuthModal } from './components/Auth/AuthModal';
import { UserDashboard } from './components/Dashboard/UserDashboard';

function App() {
  const [isPremium, setIsPremium] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'how-it-works' | 'contact'>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toolSectionRef = useRef<HTMLElement>(null);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);


  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const scrollToTools = () => {
    toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showAbout = () => {
    setCurrentView('about');
  };

  const showHowItWorks = () => {
    setCurrentView('how-it-works');
  };

  const showContact = () => {
    setCurrentView('contact');
  };

  const showHome = () => {
    setCurrentView('home');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const showLearnMore = () => {
    setCurrentView('about');
  };

  const handleSaveEdit = async (imageName: string, operations: string[]) => {
    if (user && operations.length > 0) {
      try {
        await saveEditHistory(user.id, imageName, operations);
      } catch (error) {
        console.error('Error saving edit history:', error);
      }
    }
  };

  const handleAuthSuccess = () => {
    checkUser();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <Header 
        onGetStarted={scrollToTools}
        onShowAbout={showAbout}
        onShowHowItWorks={showHowItWorks}
        onShowHome={showHome}
        onShowContact={showContact}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        user={user}
        onShowAuth={() => setShowAuthModal(true)}
        onShowDashboard={() => setShowDashboard(true)}
      />
      
      {currentView === 'home' && (
        <>
          <Hero onGetStarted={scrollToTools} onLearnMore={showLearnMore} />
          <Features isDarkMode={isDarkMode} />
          <section 
            ref={toolSectionRef}
            className={`py-20 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Professional Photo Editing Tools
                </h2>
                <p className={`text-xl mb-8 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Choose from our powerful editing suite or batch compression tools
                </p>
                
                <div className={`inline-flex items-center space-x-3 p-2 rounded-lg shadow-sm ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Premium User Mode
                    </span>
                  </label>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                    AI FEATURES
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <ImageEditor isPremium={isPremium} isDarkMode={isDarkMode} onSaveEdit={handleSaveEdit} />
                <div className="max-w-4xl mx-auto">
                  <BatchCompressor isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>
          </section>
          <CallToAction onGetStarted={scrollToTools} />
        </>
      )}

      {currentView === 'about' && (
        <>
          <About isDarkMode={isDarkMode} />
          <div className={`text-center py-8 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <button
              onClick={showHome}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </>
      )}

      {currentView === 'contact' && (
        <>
          <Contact isDarkMode={isDarkMode} />
          <div className={`text-center py-8 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <button
              onClick={showHome}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </>
      )}
      
      {currentView === 'how-it-works' && (
        <>
          <HowItWorks isDarkMode={isDarkMode} />
          <div className={`text-center py-8 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <button
              onClick={showHome}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </>
      )}
      
      <Footer isDarkMode={isDarkMode} />
      
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          isDarkMode={isDarkMode}
        />
      )}
      
      {showDashboard && user && (
        <UserDashboard
          isDarkMode={isDarkMode}
          onClose={() => setShowDashboard(false)}
        />
      )}
    </div>
  );
}

export default App;