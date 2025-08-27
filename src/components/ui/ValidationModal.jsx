import React from 'react';

const ValidationModal = ({
  isOpen,
  onClose,
  errors,
  title = 'Please Complete Required Fields',
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 背景遮罩 */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* 模态框 */}
      <div className='relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden'>
        {/* 头部 */}
        <div className='bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                <svg
                  className='w-5 h-5 text-white'
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
              <h3 className='text-lg font-semibold text-white'>{title}</h3>
            </div>
            <button
              onClick={onClose}
              className='text-white/80 hover:text-white transition-colors'
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
        </div>

        {/* 内容 */}
        <div className='px-6 py-6'>
          <div className='space-y-4'>
            <p className='text-gray-700 text-sm leading-relaxed'>
              Please complete the following required fields to continue:
            </p>

            {/* 错误列表 */}
            <div className='space-y-2'>
              {Array.isArray(errors) ? (
                errors.map((error, index) => (
                  <div
                    key={index}
                    className='flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg'
                  >
                    <div className='flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5'>
                      <svg
                        className='w-3 h-3 text-white'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-sm text-red-700 font-medium'>
                      {error}
                    </span>
                  </div>
                ))
              ) : (
                <div className='flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <div className='flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5'>
                    <svg
                      className='w-3 h-3 text-white'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <span className='text-sm text-red-700 font-medium'>
                    {errors}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
          >
            Got it, I'll fix these
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
