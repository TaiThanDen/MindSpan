import React, { useState } from 'react';
import { Search, Filter, Book as BookIcon } from 'lucide-react';
import { mockBooks } from '../data/mockData';

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = ['All', 'Productivity', 'Psychology', 'Business', 'Philosophy', 'Science'];
  
  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || selectedCategory === 'All' || 
                          book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Library</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search books by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
            value={selectedCategory || 'All'}
            onChange={(e) => setSelectedCategory(e.target.value === 'All' ? null : e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow overflow-hidden card-hover">
            <div className="h-40 bg-blue-50 flex items-center justify-center">
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <BookIcon className="h-16 w-16 text-blue-300" />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">{book.highlights} highlights</span>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {book.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No books found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default Library;