import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getCollaborations } from '../../../services/collaborationService';
import imageStorage from '../../../utils/indexedDB.js';

import CollaborationImage from './CollaborationImage';

const CollaborationGrid = ({ onCollaborationClick, onBookmarkToggle }) => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取协作数据
  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        setLoading(true);
        const result = await getCollaborations();

        if (result.success) {
          setCollaborations(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();

    // 监听新协作发布事件
    const handleNewCollaboration = () => {
      fetchCollaborations();
    };

    window.addEventListener('collaboration:created', handleNewCollaboration);

    return () => {
      window.removeEventListener(
        'collaboration:created',
        handleNewCollaboration
      );
    };
  }, []);

  if (loading) {
    return (
      <div className='flex-1 flex items-center justify-center py-12'>
        <div className='text-gray-500'>Loading collaborations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 flex items-center justify-center py-12'>
        <div className='text-red-500'>
          Error loading collaborations: {error}
        </div>
      </div>
    );
  }

  if (collaborations.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center py-12'>
        <div className='text-gray-500'>No collaborations found.</div>
      </div>
    );
  }

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
              <div
                onClick={() =>
                  onCollaborationClick && onCollaborationClick(collaboration)
                }
                className='block cursor-pointer'
              >
                <CollaborationImage
                  imageKey={collaboration.posterPreview}
                  alt={collaboration.title}
                />
              </div>
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
              <div
                onClick={() =>
                  onCollaborationClick && onCollaborationClick(collaboration)
                }
                className='block cursor-pointer'
              >
                <h3 className='font-bold text-gray-900 mb-1 text-sm hover:text-purple-600 transition-colors duration-200'>
                  {collaboration.title}
                </h3>
                <p className='text-xs text-gray-600 mb-2 line-clamp-2'>
                  {collaboration.description}
                </p>
              </div>

              {/* Author and Stats */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  {collaboration.author.avatar ? (
                    <img
                      src={collaboration.author.avatar}
                      alt={collaboration.author.name}
                      className='w-6 h-6 rounded-full mr-2 object-cover'
                      onError={e => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className='w-6 h-6 rounded-full mr-2 bg-gray-300 flex items-center justify-center'>
                      <span className='text-xs text-gray-600 font-medium'>
                        {collaboration.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
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
