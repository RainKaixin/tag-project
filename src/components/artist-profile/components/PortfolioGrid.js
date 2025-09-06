// portfolio-grid v1: 作品集网格组件

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 作品集网格组件
 * @param {Array} artworks - 作品数据数组
 * @param {Function} onArtworkClick - 作品点击事件
 * @param {string} className - 额外的CSS类名
 * @param {boolean} isOwnProfile - 是否为个人档案
 */
const PortfolioGrid = ({
  artworks,
  onArtworkClick,
  className = '',
  isOwnProfile = false,
}) => {
  const navigate = useNavigate();
  const [hoveredArtworkId, setHoveredArtworkId] = useState(null);

  const handleEditClick = (e, artworkId) => {
    e.stopPropagation();
    navigate('/settings/edit-profile');
  };
  return (
    <div
      className={`pb-8 border-b border-gray-200 bg-blue-50 rounded-lg p-6 ${className}`}
    >
      <h3 className='text-lg font-bold text-gray-900 mb-6'>Portfolio</h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {artworks.map(artwork => (
          <div
            key={artwork.id}
            onClick={() => onArtworkClick(artwork)}
            className='group cursor-pointer relative'
            onMouseEnter={() => setHoveredArtworkId(artwork.id)}
            onMouseLeave={() => setHoveredArtworkId(null)}
          >
            <div className='relative overflow-hidden rounded-lg'>
              <img
                src={artwork.image}
                alt={artwork.title}
                className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
              />
              {/* 编辑按钮 - 只在个人档案且悬停时显示 */}
              {isOwnProfile && hoveredArtworkId === artwork.id && (
                <button
                  onClick={e => handleEditClick(e, artwork.id)}
                  className='absolute top-2 right-2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 hover:text-blue-600 rounded-full transition-all duration-200 shadow-md z-10'
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
              <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end'>
                <div className='p-3 w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
                  <h4 className='text-white font-medium text-sm'>
                    {artwork.title}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGrid;
