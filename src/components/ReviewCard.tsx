import React, { useState } from 'react';
import { BookOpen, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Highlight } from '../types';

interface ReviewCardProps {
  highlight: Highlight;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ highlight }) => {
  const [showSource, setShowSource] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
      <div className="mb-6">
        <p className="text-gray-800 font-serif text-xl md:text-2xl italic leading-relaxed">
          "{highlight.content}"
        </p>
      </div>
      
      <div 
        className="border-t pt-4 cursor-pointer" 
        onClick={() => setShowSource(!showSource)}
      >
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-medium">Show source</span>
          {showSource ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
        
        {showSource && (
          <div className="mt-3 text-gray-700 animate-fadeIn">
            <div className="flex items-center mb-2">
              <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
              <span className="font-medium">{highlight.book}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">by {highlight.author}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {highlight.tags.map((tag, index) => (
                <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;