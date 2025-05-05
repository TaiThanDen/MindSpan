import React from 'react';
import { BarChart3, BookOpen, BrainCircuit, Clock } from 'lucide-react';
import HighlightCard from '../components/HighlightCard';
import StatsCard from '../components/StatsCard';
import { mockHighlights } from '../data/mockData';

const Dashboard: React.FC = () => {
  const todayHighlights = mockHighlights.slice(0, 3);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Books" 
          value="24" 
          icon={<BookOpen className="h-6 w-6 text-blue-600" />} 
          change="+2 this month"
          positive={true}
        />
        <StatsCard 
          title="Highlights" 
          value="387" 
          icon={<BrainCircuit className="h-6 w-6 text-green-600" />} 
          change="+42 this month"
          positive={true}
        />
        <StatsCard 
          title="Review Streak" 
          value="7 days" 
          icon={<Clock className="h-6 w-6 text-orange-600" />} 
          change="Personal best: 14 days"
          positive={true}
        />
        <StatsCard 
          title="Retention Score" 
          value="82%" 
          icon={<BarChart3 className="h-6 w-6 text-purple-600" />} 
          change="+4% from last month"
          positive={true}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Review</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {todayHighlights.map((highlight) => (
                <HighlightCard key={highlight.id} highlight={highlight} />
              ))}
              <div className="text-center pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                  Start Daily Review
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Added Books</h2>
            <div className="space-y-4">
              {['Atomic Habits', 'Deep Work', 'Thinking, Fast and Slow'].map((book, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md card-hover">
                  <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{book}</p>
                    <p className="text-xs text-gray-500">Added 2 days ago</p>
                  </div>
                </div>
              ))}
              <button className="w-full text-center text-blue-600 text-sm font-medium hover:text-blue-800 mt-2">
                View Library
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Reviews</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tomorrow</span>
                <span className="text-sm font-medium text-gray-900">12 highlights</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In 2 days</span>
                <span className="text-sm font-medium text-gray-900">8 highlights</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In 3 days</span>
                <span className="text-sm font-medium text-gray-900">15 highlights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;