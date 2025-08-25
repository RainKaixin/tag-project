import React from 'react';

export function BaseModal(props) {
  const { isOpen, onClose, title, children, maxWidth = 'max-w-md' } = props;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className={`bg-white rounded-lg p-6 w-full mx-4 ${maxWidth}`}>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-bold text-gray-900'>{title}</h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
