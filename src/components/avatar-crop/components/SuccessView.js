import React from 'react';

import { UI_TEXTS } from '../utils/constants';

const SuccessView = ({ onComplete }) => {
  return (
    <div className='text-center'>
      <div className='mb-4'>
        <div className='w-24 h-24 rounded-full mx-auto border-2 border-green-200 bg-green-50 flex items-center justify-center'>
          <svg
            className='w-12 h-12 text-green-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
        </div>
      </div>
      <p className='text-green-600 font-medium mb-2'>
        {UI_TEXTS.UPLOAD_SUCCESS}
      </p>
      <p className='text-gray-600 mb-4'>{UI_TEXTS.SUCCESS_MESSAGE}</p>
      <button
        onClick={onComplete}
        className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors'
      >
        {UI_TEXTS.DONE}
      </button>
    </div>
  );
};

export default SuccessView;
