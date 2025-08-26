// submit-button v1: 提交按鈕組件

import React from 'react';

/**
 * 提交按鈕組件
 * @param {Object} props - 組件屬性
 * @param {boolean} props.isSubmitting - 是否正在提交
 * @param {Function} props.onSubmit - 提交處理函數
 * @returns {JSX.Element} 提交按鈕組件
 */
const SubmitButton = ({ isSubmitting, onSubmit }) => {
  return (
    <button
      type='submit'
      disabled={isSubmitting}
      onClick={onSubmit}
      className={`w-full font-semibold py-3 rounded-md transition-colors duration-200 flex items-center justify-center ${
        isSubmitting
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
          : 'bg-tag-blue text-white hover:bg-blue-700'
      }`}
    >
      {isSubmitting ? (
        <>
          <svg
            className='animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600'
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
          Publishing...
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
              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
            />
          </svg>
          Publish to TAG!
        </>
      )}
    </button>
  );
};

export default SubmitButton;
