import React, { useState } from 'react';
import { Bell, Clock, Book, Mail } from 'lucide-react';

const Settings: React.FC = () => {
  const [reviewsPerDay, setReviewsPerDay] = useState(10);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Review Settings
          </h2>
          
          <div className="mb-4">
            <label htmlFor="reviewsPerDay" className="block text-sm font-medium text-gray-700 mb-1">
              Daily review count
            </label>
            <div className="flex items-center">
              <input
                type="range"
                id="reviewsPerDay"
                min="5"
                max="50"
                step="5"
                value={reviewsPerDay}
                onChange={(e) => setReviewsPerDay(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">{reviewsPerDay} highlights</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              The number of highlights you'll review each day
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
              Review reminder time
            </label>
            <input
              type="time"
              id="reminderTime"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="block w-40 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              We'll send you a notification at this time
            </p>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Email Preferences
          </h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Daily review email</h3>
              <p className="text-sm text-gray-500">Receive your daily highlights by email</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="emailEnabled"
                checked={emailEnabled}
                onChange={() => setEmailEnabled(!emailEnabled)}
                className="sr-only"
              />
              <label
                htmlFor="emailEnabled"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  emailEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                    emailEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-600" />
            Notification Settings
          </h2>
          
          <div className="space-y-3">
            {['Review reminders', 'New book imports', 'Weekly insights'].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item}</span>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id={`notification-${index}`}
                    defaultChecked={index !== 2}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`notification-${index}`}
                    className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer`}
                  >
                    <span
                      className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform"
                    ></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Book className="h-5 w-5 mr-2 text-blue-600" />
            Display Settings
          </h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Dark mode</h3>
              <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only"
              />
              <label
                htmlFor="darkMode"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;