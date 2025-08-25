import React from 'react';

export function BackButton(props) {
  const { onClick, text = 'Back', className = '', showIcon = true } = props;

  return (
    <button
      onClick={onClick}
      className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 ${className}`}
    >
      {showIcon && (
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
      )}
      {text}
    </button>
  );
}
