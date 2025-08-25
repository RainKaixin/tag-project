// work-header v1: 作品详情页头部组件

import React from 'react';

import WorkImageGallery from './WorkImageGallery';

/**
 * 作品详情页头部组件
 * @param {Object} workData - 作品数据
 * @param {Function} onBackClick - 返回按钮点击事件
 * @param {Function} onImageNavigation - 图片导航事件
 * @param {Object} navigationState - 作品导航状态
 * @param {string} className - 额外的CSS类名
 */
const WorkHeader = ({
  workData,
  onBackClick,
  onImageNavigation,
  navigationState,
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      {/* Back Button */}
      <button
        onClick={onBackClick}
        className='flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200 relative z-10 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md'
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
        Back
      </button>

      {/* Navigation Arrows for Works (not images) */}
      <div className='flex justify-between items-center mb-6'>
        <button
          onClick={navigationState?.navigateToPrevious}
          disabled={
            !navigationState?.hasPrevious && navigationState?.totalWorks <= 1
          }
          className='flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          title='Previous work (←)'
        >
          <svg
            className='w-5 h-5 mr-2 text-blue-600'
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
          Previous Work
        </button>

        <button
          onClick={navigationState?.navigateToNext}
          disabled={
            !navigationState?.hasNext && navigationState?.totalWorks <= 1
          }
          className='flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          title='Next work (→)'
        >
          Next Work
          <svg
            className='w-5 h-5 ml-2 text-blue-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      </div>

      {/* 作品图片画廊 */}
      <div className='mb-6'>
        <WorkImageGallery
          images={workData.allImages || [workData.mainImage]}
          workTitle={workData.title}
        />
      </div>
    </div>
  );
};

export default WorkHeader;
