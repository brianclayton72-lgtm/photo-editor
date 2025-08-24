import React, { useState, useEffect } from 'react';
import { User, CreditCard, History, Settings, LogOut, Crown } from 'lucide-react';
import { getCurrentUser, getUserProfile, getEditHistory, signOut } from '../../lib/supabase';
import { createCheckoutSession, createPortalSession } from '../../lib/stripe';
import { User as UserType, EditHistory } from '../../types';

interface UserDashboardProps {
  isDarkMode: boolean;
  onClose: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ isDarkMode, onClose }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [editHistory, setEditHistory] = useState<EditHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'history'>('profile');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const { data: profile } = await getUserProfile(currentUser.id);
        const { data: history } = await getEditHistory(currentUser.id);
        
        setUser(profile);
        setEditHistory(history || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;
    
    try {
      await createCheckoutSession('price_premium_monthly', user.id);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error starting upgrade process. Please try again.');
    }
  };

  const handleManageBilling = async () => {
    if (!user?.stripe_customer_id) return;
    
    try {
      await createPortalSession(user.stripe_customer_id);
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Error opening billing portal. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`rounded-xl p-8 max-w-4xl w-full mx-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className={`ml-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Loading dashboard...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            User Dashboard
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'subscription', label: 'Subscription', icon: Crown },
            { id: 'history', label: 'Edit History', icon: History }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-green-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className={`rounded-lg p-6 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <p className={`${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {user?.email}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Member Since
                  </label>
                  <p className={`${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <div className={`rounded-lg p-6 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Current Plan
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.subscription_status === 'premium'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user?.subscription_status === 'premium' ? 'Premium' : 'Free'}
                </div>
              </div>

              {user?.subscription_status === 'premium' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Status
                      </label>
                      <p className="text-green-600 font-medium">Active Premium</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Next Billing Date
                      </label>
                      <p className={`${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {user?.subscription_end_date 
                          ? new Date(user.subscription_end_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h4 className={`font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Premium Features Included:
                    </h4>
                    <ul className={`space-y-1 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li>• AI Upscale (2x resolution)</li>
                      <li>• Advanced Brush Tool</li>
                      <li>• Text Overlay Tool</li>
                      <li>• Priority Support</li>
                      <li>• No Watermarks</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleManageBilling}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <CreditCard size={16} />
                    <span>Manage Billing</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className={`${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Upgrade to Premium to unlock advanced AI features and tools.
                  </p>
                  
                  <div className={`rounded-lg p-4 border ${
                    isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}>
                    <h4 className={`font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Premium Features:
                    </h4>
                    <ul className={`space-y-1 text-sm mb-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li>• AI Upscale (2x resolution with sharpening)</li>
                      <li>• Advanced Brush Tool with multiple colors</li>
                      <li>• Text Overlay with custom fonts</li>
                      <li>• Background Removal (Coming Soon)</li>
                      <li>• Priority Support</li>
                    </ul>
                    <p className={`text-lg font-bold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      $9.99/month
                    </p>
                  </div>

                  <button
                    onClick={handleUpgrade}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                  >
                    <Crown size={16} />
                    <span>Upgrade to Premium</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Edit History
            </h3>
            
            {editHistory.length === 0 ? (
              <div className={`text-center py-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <History size={48} className="mx-auto mb-4 opacity-50" />
                <p>No edit history yet. Start editing some images!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {editHistory.map((edit) => (
                  <div
                    key={edit.id}
                    className={`rounded-lg p-4 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {edit.image_name}
                        </h4>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Operations: {edit.operations.join(', ')}
                        </p>
                      </div>
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(edit.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};