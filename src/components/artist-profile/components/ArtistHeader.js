// artist-header v1: 艺术家档案头部组件

import React from 'react';

import { getFollowButtonStyle } from '../utils/artistHelpers';

/**
 * 艺术家档案头部组件
 * @param {Object} artist - 艺术家数据
 * @param {boolean} isFollowing - 是否已关注
 * @param {number} followersCount - 关注者数量
 * @param {number} followingCount - 正在关注的数量
 * @param {boolean} isOwnProfile - 是否为当前用户查看自己的档案
 * @param {Function} onBackClick - 返回按钮点击事件
 * @param {Function} onEditProfileClick - 编辑个人资料点击事件
 * @param {Function} onPreviewAsVisitorClick - 预览访客视角点击事件
 * @param {Function} onBackToOwnerViewClick - 返回所有者视角点击事件
 * @param {Function} toggleFollow - 关注切换事件
 * @param {Function} onFollowersClick - 关注者数量点击事件
 * @param {Function} onFollowingClick - 正在关注数量点击事件
 * @param {string} className - 额外的CSS类名
 */
const ArtistHeader = ({
  artist,
  artworks = [],
  isFollowing,
  followersCount,
  followingCount,
  isOwnProfile,
  onBackClick,
  onEditProfileClick,
  onPreviewAsVisitorClick,

  toggleFollow,
  onFollowersClick,
  onFollowingClick,
  className = '',
}) => {
  return (
    <div className={`${className}`}>
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
                  {artworks.length}
                </div>
                <div className='text-sm text-gray-600'>Works</div>
              </div>
              <div
                className='text-left cursor-pointer hover:opacity-80 transition-opacity duration-200'
                onClick={onFollowingClick}
                role='button'
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onFollowingClick();
                  }
                }}
              >
                <div className='text-xl font-bold text-gray-900'>
                  {followingCount || 0}
                </div>
                <div className='text-sm text-gray-600'>Following</div>
              </div>
              <div
                className='text-left cursor-pointer hover:opacity-80 transition-opacity duration-200'
                onClick={onFollowersClick}
                role='button'
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onFollowersClick();
                  }
                }}
              >
                <div className='text-xl font-bold text-gray-900'>
                  {followersCount}
                </div>
                <div className='text-sm text-gray-600'>Followers</div>
              </div>
            </div>

            {/* Right - Buttons */}
            <div className='flex items-center gap-3 lg:ml-auto'>
              {isOwnProfile ? (
                // 自己的档案：显示 Preview 和 Edit Profile 按钮
                <>
                  <button
                    onClick={onPreviewAsVisitorClick}
                    className='px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2'
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
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                    Preview as Visitor
                  </button>
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
                </>
              ) : (
                // 访客视角：始终显示 Follow 按钮
                <button
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    toggleFollow();
                  }}
                  className={getFollowButtonStyle(isFollowing)}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistHeader;
