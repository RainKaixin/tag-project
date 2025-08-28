import React, { useEffect, useState } from 'react';

const SuccessToast = ({ isVisible, message, onClose, duration = 4000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      setProgress(100);

      const timer = setTimeout(() => {
        onClose();
      }, duration);

      const progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(progressTimer);
            return 0;
          }
          return prev - 100 / (duration / 50); // Update every 50ms
        });
      }, 50);

      return () => {
        clearTimeout(timer);
        clearInterval(progressTimer);
      };
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className='fixed top-4 right-4 z-50 transform transition-all duration-300 ease-out translate-x-0 opacity-100'>
      <div className='bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm'>
        <div className='flex items-start gap-3'>
          {/* Success Icon */}
          <div className='flex-shrink-0'>
            <svg
              className='w-6 h-6 text-green-600'
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

          {/* Message */}
          <div className='flex-1'>
            <p className='text-green-800 text-sm font-medium leading-relaxed'>
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className='flex-shrink-0 text-green-400 hover:text-green-600 transition-colors duration-200'
          >
            <svg
              className='w-4 h-4'
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

        {/* Progress Bar */}
        <div className='mt-3 h-1 bg-green-200 rounded-full overflow-hidden'>
          <div
            className='h-full bg-green-500 rounded-full transition-all duration-50 ease-linear'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessToast;
