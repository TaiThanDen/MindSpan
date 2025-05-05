import React from 'react';
import { BookOpen, Tag } from 'lucide-react';
import { Highlight } from '../types';

interface HighlightCardProps {
  highlight: Highlight;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ highlight }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors card-hover">
      <p className="text-gray-800 mb-3 font-serif text-lg italic">
        "{highlight.content}"
      </p>
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center text-gray-600">
          <BookOpen className="h-4 w-4 mr-1" />
          <span>{highlight.book}</span>
        </div>
        <div className="flex items-center">
          {highlight.tags.map((tag, index) => (
            <span key={index} className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightCard;