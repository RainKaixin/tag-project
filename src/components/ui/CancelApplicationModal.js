import React from 'react';

const CancelApplicationModal = ({
  isOpen,
  onClose,
  onConfirm,
  positionTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-4'>
          <div className='flex-shrink-0'>
            <svg
              className='w-6 h-6 text-orange-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Cancel Application
          </h3>
        </div>

        {/* Warning Message */}
        <div className='mb-6'>
          <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4'>
            <div className='flex items-start gap-3'>
              <svg
                className='w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
              <div>
                <p className='text-orange-800 text-sm font-medium mb-2'>
                  Important: Cancellation Consequences
                </p>
                <ul className='text-orange-700 text-sm space-y-1'>
                  <li>
                    • Your application for <strong>{positionTitle}</strong> will
                    be withdrawn
                  </li>
                  <li>
                    • If you reapply later, you'll need to get the project
                    initiator's approval again
                  </li>
                  <li>• Your previous application data will be cleared</li>
                </ul>
              </div>
            </div>
          </div>

          <p className='text-gray-700 text-sm'>
            Are you sure you want to cancel your application? This action cannot
            be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200'
          >
            Keep Application
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200'
          >
            Cancel Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelApplicationModal;
