// portfolio-section v1: 作品集组件
// 从 MyArtistProfile.js 中提取的作品集区域

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PortfolioSection 组件 - 艺术家作品集展示
 * @param {Object} props - 组件属性
 * @param {Array} props.artworks - 作品数组
 * @param {Function} props.onArtworkClick - 作品点击处理
 * @returns {JSX.Element} 作品集组件
 */
const PortfolioSection = ({ artworks, onArtworkClick }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleEditClick = e => {
    e.stopPropagation();
    navigate('/settings/edit-profile');
  };
  if (!artworks || artworks.length === 0) {
    return (
      <div className='flex-1'>
        <div className='pb-8 border-b border-gray-200 bg-blue-50 rounded-lg p-6'>
          <h3 className='text-lg font-bold text-gray-900 mb-6'>Portfolio</h3>
          <p className='text-gray-600'>No artworks available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1'>
      <div
        className='pb-8 border-b border-gray-200 bg-blue-50 rounded-lg p-6 relative'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-bold text-gray-900'>Portfolio</h3>
          {isHovered && (
            <button
              onClick={handleEditClick}
              className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all duration-200'
              title='Edit Profile'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </button>
          )}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {artworks.map(artwork => (
            <div
              key={artwork.id}
              onClick={() => onArtworkClick(artwork)}
              className='group cursor-pointer'
            >
              <div className='relative overflow-hidden rounded-lg'>
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end'>
                  <div className='p-3 w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
                    <h4 className='text-white font-medium text-sm'>
                      {artwork.title}
                    </h4>
                    <p className='text-gray-200 text-xs'>{artwork.category}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSection;
