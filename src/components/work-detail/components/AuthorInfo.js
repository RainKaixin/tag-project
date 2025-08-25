// author-info v1: 作者信息组件

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 作者信息组件
 * @param {Object} author - 作者数据
 * @param {Function} onAuthorClick - 作者点击事件
 * @param {string} className - 额外的CSS类名
 */
const AuthorInfo = ({
  author,
  isFollowing = false,
  followersCount = 0,
  onAuthorClick,
  onFollowClick,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg p-6 mb-6 ${className}`}>
      <Link
        to={`/artist/${author.id}`}
        className='flex items-center mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 block'
      >
        <img
          src={author.avatar}
          alt={author.name}
          className='w-16 h-16 rounded-full mr-4'
        />
        <div>
          <h3 className='text-lg font-semibold text-gray-900 hover:text-tag-blue transition-colors duration-200'>
            {author.name}
          </h3>
          <p className='text-sm text-gray-600'>{author.role}</p>
        </div>
      </Link>

      {/* Author Stats */}
      <div className='flex justify-between mb-4 text-sm'>
        <div className='text-center'>
          <div className='font-semibold text-gray-900'>{author.works}</div>
          <div className='text-gray-500'>Works</div>
        </div>
        <div className='text-center'>
          <div className='font-semibold text-gray-900'>{followersCount}</div>
          <div className='text-gray-500'>Followers</div>
        </div>
        <div className='text-center'>
          <div className='font-semibold text-gray-900'>{author.following}</div>
          <div className='text-gray-500'>Following</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex'>
        <button
          onClick={onFollowClick}
          className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
            isFollowing
              ? 'bg-gray-500 text-white hover:bg-gray-600'
              : 'bg-tag-blue text-white hover:bg-tag-dark-blue'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default AuthorInfo;
