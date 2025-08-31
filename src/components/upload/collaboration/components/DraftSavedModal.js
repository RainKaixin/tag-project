import React from 'react';

const DraftSavedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-purple-600'
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
            <h3 className='text-lg font-semibold text-gray-900'>Draft Saved</h3>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          <p className='text-gray-600 mb-6'>
            Your collaboration draft has been saved successfully! You can
            continue editing later or publish when you're ready.
          </p>

          <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
            <div className='flex items-center space-x-2'>
              <svg
                className='w-5 h-5 text-purple-600'
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
              <span className='text-sm text-purple-700 font-medium'>
                Draft saved to your profile
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end p-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200 font-medium'
          >
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftSavedModal;
