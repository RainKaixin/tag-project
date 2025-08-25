// artist-header v1: 艺术家头部组件
// 从 MyArtistProfile.js 中提取的头部区域

import React from 'react';

/**
 * ArtistHeader 组件 - 艺术家档案页面头部
 * @param {Object} props - 组件属性
 * @param {Object} props.artist - 艺术家数据
 * @param {Function} props.onBackClick - 返回按钮点击处理
 * @param {Function} props.onEditProfileClick - 编辑资料按钮点击处理
 * @returns {JSX.Element} 头部组件
 */
const ArtistHeader = ({ artist, onBackClick, onEditProfileClick }) => {
  if (!artist) {
    return null;
  }

  return (
    <>
      {/* Back Button */}
      <div className='border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <button
            onClick={onBackClick}
            className='flex items-center py-4 text-gray-600 hover:text-gray-900 transition-colors duration-200'
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back to Gallery
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
        {/* Header Section */}
        <div className='pb-8 border-b border-gray-200'>
          <div className='flex flex-col lg:flex-row lg:items-start'>
            {/* Left - Artist Info */}
            <div className='flex items-center mb-6 lg:mb-0'>
              <img
                src={artist.avatar}
                alt={artist.name}
                className='w-20 h-20 rounded-full mr-6'
              />
              <div>
                <h1 className='text-2xl font-bold text-gray-900 mb-1'>
                  {artist.name}
                </h1>
                <div className='flex items-center gap-3'>
                  <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {artist.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle - Statistics */}
            <div className='flex items-center gap-8 mb-6 lg:mb-0 lg:ml-16'>
              <div className='text-left'>
                <div className='text-xl font-bold text-gray-900'>
                  {artist.stats.following}
                </div>
                <div className='text-sm text-gray-600'>Following</div>
              </div>
              <div className='text-left'>
                <div className='text-xl font-bold text-gray-900'>
                  {artist.stats.followers}
                </div>
                <div className='text-sm text-gray-600'>Followers</div>
              </div>
            </div>

            {/* Right - Buttons */}
            <div className='flex items-center gap-3 lg:ml-auto'>
              <button
                onClick={onEditProfileClick}
                className='px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-purple-500 text-white hover:bg-purple-600 flex items-center gap-2'
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
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtistHeader;
