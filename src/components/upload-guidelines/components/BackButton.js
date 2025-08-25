// back-button v1: 返回按钮组件
// 从 UploadGuidelines.js 中提取的返回按钮

import React from 'react';

/**
 * BackButton 组件 - 返回首页按钮
 * @param {Object} props - 组件属性
 * @param {Function} props.onBackClick - 返回点击处理函数
 * @returns {JSX.Element} 返回按钮组件
 */
const BackButton = ({ onBackClick }) => {
  return (
    <div className='p-4'>
      <button
        onClick={onBackClick}
        className='flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200'
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
            d='M10 19l-7-7m0 0l7-7m-7 7h18'
          />
        </svg>
        Back to Home
      </button>
    </div>
  );
};

export default BackButton;
