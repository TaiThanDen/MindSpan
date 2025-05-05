import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { mockHighlights } from '../data/mockData';
import { calculateNextReviewDate } from '../utils/spacedRepetition';
import ReviewCard from '../components/ReviewCard';

const DailyReview: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedHighlights, setReviewedHighlights] = useState<Record<string, number>>({});
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  
  const todaysHighlights = mockHighlights.slice(0, 7);
  
  const handleRating = (highlightId: string, rating: number) => {
    setReviewedHighlights(prev => ({
      ...prev,
      [highlightId]: rating
    }));
    
    // Move to next card or complete the review
    if (currentIndex < todaysHighlights.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsReviewComplete(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < todaysHighlights.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsReviewComplete(true);
    }
  };
  
  const resetReview = () => {
    setCurrentIndex(0);
    setReviewedHighlights({});
    setIsReviewComplete(false);
  };
  
  if (isReviewComplete) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Review Complete!</h1>
          <p className="text-gray-600 mb-6">
            You've reviewed {Object.keys(reviewedHighlights).length} highlights today.
            Your next batch of reviews will be ready tomorrow.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="font-semibold text-blue-800 mb-2">Review Summary</h2>
            <p className="text-blue-700">
              {Object.values(reviewedHighlights).filter(rating => rating >= 3).length} highlights were familiar
            </p>
            <p className="text-blue-700">
              {Object.values(reviewedHighlights).filter(rating => rating < 3).length} highlights need more review
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={resetReview}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Start Another Review
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const currentHighlight = todaysHighlights[currentIndex];
  const progress = ((currentIndex) / todaysHighlights.length) * 100;
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Daily Review</h1>
      <p className="text-gray-600 mb-6">
        Review your highlights to strengthen your memory and retention.
      </p>
      
      <div className="mb-4 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="text-sm text-gray-500 flex justify-between mb-6">
        <span>Card {currentIndex + 1} of {todaysHighlights.length}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      
      <ReviewCard highlight={currentHighlight} />
      
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center px-4 py-2 rounded-md ${
            currentIndex === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } mb-4 sm:mb-0 w-full sm:w-auto justify-center`}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Previous
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={() => handleRating(currentHighlight.id, 1)}
            className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <ThumbsDown className="h-5 w-5 mr-1" />
            Forgot
          </button>
          <button
            onClick={() => handleRating(currentHighlight.id, 5)}
            className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <ThumbsUp className="h-5 w-5 mr-1" />
            Remembered
          </button>
        </div>
        
        <button
          onClick={handleNext}
          className="flex items-center px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 mt-4 sm:mt-0 w-full sm:w-auto justify-center"
        >
          Skip
          <ArrowRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default DailyReview;