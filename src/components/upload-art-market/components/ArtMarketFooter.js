// art-market-footer v1: 艺术市场底部组件
// 从 UploadArtMarket.js 中提取的底部区域

import React from 'react';

/**
 * ArtMarketFooter 组件 - 艺术市场表单底部区域
 * @param {Object} props - 组件属性
 * @param {Object} props.formData - 表单数据
 * @param {Function} props.onFormChange - 表单变化处理函数
 * @param {Function} props.onSubmit - 提交处理函数
 * @param {boolean} props.isSubmitting - 是否正在提交
 * @returns {JSX.Element} 底部组件
 */
const ArtMarketFooter = ({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <div className='space-y-4'>
      {/* Marketplace Guidelines */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <div className='flex items-start'>
          <svg
            className='w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <div>
            <h4 className='text-sm font-semibold text-blue-800 mb-1'>
              Marketplace Guidelines
            </h4>
            <p className='text-sm text-blue-800'>
              All assets must be original work. We take 30% commission on sales.
              Assets are reviewed before going live.
            </p>
          </div>
        </div>
      </div>

      {/* 协议确认 */}
      <div className='flex items-start'>
        <input
          type='checkbox'
          name='agreeToTerms'
          checked={formData.agreeToTerms}
          onChange={onFormChange}
          className='mt-1 h-4 w-4 text-tag-blue focus:ring-tag-blue border-gray-300 rounded'
        />
        <label className='ml-2 text-sm text-gray-700'>
          I agree to the marketplace terms and confirm this is my original work
        </label>
      </div>

      {/* 提交按钮 */}
      <button
        type='submit'
        disabled={!formData.agreeToTerms || isSubmitting}
        onClick={onSubmit}
        className={`w-full font-semibold py-3 rounded-md transition-colors duration-200 flex items-center justify-center ${
          formData.agreeToTerms && !isSubmitting
            ? 'bg-tag-blue text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <svg
              className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            Submitting...
          </>
        ) : (
          <>
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
                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
              />
            </svg>
            List on TAG!
          </>
        )}
      </button>
    </div>
  );
};

export default ArtMarketFooter;


















