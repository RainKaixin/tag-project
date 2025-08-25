import React from 'react';

/**
 * 错误提示模态框组件
 * @param {boolean} isOpen - 是否显示
 * @param {string} title - 标题
 * @param {string} message - 错误消息
 * @param {Function} onClose - 关闭回调
 * @param {string} className - 额外的CSS类名
 */
export function ErrorModal(props) {
  const {
    isOpen,
    title = 'Error',
    message = 'An error occurred.',
    onClose,
    className = '',
  } = props;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 背景遮罩 */}
      <div
        className='absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300'
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 ${className}`}
      >
        {/* 错误图标 */}
        <div className='flex justify-center mb-6'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-red-600'
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
        </div>

        {/* 标题 */}
        <h3 className='text-xl font-semibold text-gray-900 text-center mb-3'>
          {title}
        </h3>

        {/* 错误消息 */}
        <p className='text-gray-600 text-center mb-6 leading-relaxed'>
          {message}
        </p>

        {/* 确认按钮 */}
        <div className='flex justify-center'>
          <button
            onClick={onClose}
            className='bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          >
            OK
          </button>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200'
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
  );
}
