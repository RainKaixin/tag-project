// action-buttons v1: 操作按钮组件

import React from 'react';

/**
 * Upload按钮组件
 * @param {Function} onClick - 点击事件处理函数
 * @param {string} className - 额外的CSS类名
 */
const UploadButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-tag-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-tag-dark-blue transition-colors duration-200 flex items-center ${className}`}
    >
      <svg
        className='w-4 h-4 mr-2'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
        />
      </svg>
      Upload
    </button>
  );
};

/**
 * TAGMe按钮组件
 * @param {Function} onClick - 点击事件处理函数
 * @param {string} className - 额外的CSS类名
 */
const TAGMeButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-tag-purple text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors duration-200 ${className}`}
    >
      TAGMe
    </button>
  );
};

/**
 * 操作按钮组组件
 * @param {Function} onTAGMeClick - TAGMe按钮点击事件
 * @param {string} className - 额外的CSS类名
 */
const ActionButtons = ({ onTAGMeClick, className = '' }) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <TAGMeButton onClick={onTAGMeClick} />
    </div>
  );
};

export default ActionButtons;
export { UploadButton, TAGMeButton };
