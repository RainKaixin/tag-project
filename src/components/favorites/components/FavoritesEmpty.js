import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * 空状态组件
 */
const FavoritesEmpty = () => {
  const navigate = useNavigate();

  const content = {
    title: 'No favorites yet',
    buttonText: 'Start Exploring',
  };

  return (
    <div className='text-center py-12'>
      {/* 图标 */}
      <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
        <svg
          className='w-8 h-8 text-gray-400'
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
      </div>

      {/* 标题 */}
      <h3 className='text-lg font-semibold text-gray-800 mb-6'>
        {content.title}
      </h3>

      {/* 操作按钮 */}
      <Link
        to='/'
        className='inline-block px-6 py-3 bg-tag-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
      >
        {content.buttonText}
      </Link>
    </div>
  );
};

export default FavoritesEmpty;
