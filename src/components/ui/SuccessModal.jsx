import React from 'react';

/**
 * 成功提示模态框组件
 * @param {boolean} isOpen - 是否显示
 * @param {string} title - 标题
 * @param {string} message - 消息内容
 * @param {Function} onClose - 关闭回调
 * @param {string} className - 额外的CSS类名
 */
export function SuccessModal(props) {
  const {
    isOpen,
    title = 'Success!',
    message = 'Operation completed successfully.',
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
        {/* 成功图标 */}
        <div className='flex justify-center mb-6'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-green-600'
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

        {/* 标题 */}
        <h3 className='text-xl font-semibold text-gray-900 text-center mb-3'>
          {title}
        </h3>

        {/* 消息 */}
        <p className='text-gray-600 text-center mb-6 leading-relaxed'>
          {message}
        </p>

        {/* 确认按钮 */}
        <div className='flex justify-center'>
          <button
            onClick={onClose}
            className='bg-tag-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-tag-dark-blue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:ring-offset-2'
          >
            Got it!
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
