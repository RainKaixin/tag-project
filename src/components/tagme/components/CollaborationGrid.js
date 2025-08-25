import React from 'react';
import { Link } from 'react-router-dom';

import { collaborations } from '../data/mockData';

const CollaborationGrid = ({ onCollaborationClick, onBookmarkToggle }) => {
  return (
    <div className='flex-1'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {collaborations.map(collaboration => (
          <div
            key={collaboration.id}
            className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md hover:scale-105 transition-all duration-300'
          >
            {/* Project Image */}
            <div className='relative'>
              <Link
                to={`/tagme/collaboration/${collaboration.id}`}
                className='block'
              >
                <img
                  src={collaboration.image}
                  alt={collaboration.title}
                  className='w-full h-56 object-cover'
                />
              </Link>
              {/* Bookmark Button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  onBookmarkToggle && onBookmarkToggle(collaboration.id);
                }}
                className='absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200'
              >
                <svg
                  className={`w-5 h-5 ${
                    collaboration.isBookmarked
                      ? 'text-purple-500 fill-current'
                      : 'text-gray-400'
                  }`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                  />
                </svg>
              </button>
            </div>

            {/* Collaboration Content */}
            <div className='p-3'>
              <Link
                to={`/tagme/collaboration/${collaboration.id}`}
                className='block'
              >
                <h3 className='font-bold text-gray-900 mb-1 text-sm hover:text-purple-600 transition-colors duration-200'>
                  {collaboration.title}
                </h3>
                <p className='text-xs text-gray-600 mb-2 line-clamp-2'>
                  {collaboration.description}
                </p>
              </Link>

              {/* Author and Stats */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <img
                    src={collaboration.author.avatar}
                    alt={collaboration.author.name}
                    className='w-6 h-6 rounded-full mr-2'
                  />
                  <span className='text-xs font-medium text-gray-900'>
                    {collaboration.author.name}
                  </span>
                </div>
                <span className='text-xs text-gray-500'>Dec 15, 2024</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationGrid;
