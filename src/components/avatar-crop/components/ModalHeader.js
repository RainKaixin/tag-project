import React from 'react';

import { UI_TEXTS } from '../utils/constants';

const ModalHeader = ({ onCancel, error }) => {
  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {UI_TEXTS.TITLE}
        </h3>
        <button
          onClick={onCancel}
          className='text-gray-400 hover:text-gray-600'
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

      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-red-600 text-sm'>{error}</p>
        </div>
      )}
    </>
  );
};

export default ModalHeader;
