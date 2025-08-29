import React, { useState } from 'react';

/**
 * ReviewHeader组件 - 显示review区域的标题和说明
 * @param {Object} props - 组件属性
 * @param {string} props.title - 标题文本
 * @param {string} props.description - 说明文本
 * @param {string} props.className - 额外的CSS类名
 */
const ReviewHeader = ({
  title = 'After-Finished Review',
  description = 'Final, qualitative comments after project completion only.',
  className = '',
}) => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <div className={`${className}`}>
      {/* 分节标题和帮助图标 */}
      <div className='flex items-center gap-2 mb-2'>
        <h3 className='text-base font-semibold text-gray-900'>{title}</h3>

        {/* 帮助图标 */}
        <button
          onClick={() => setShowHelpModal(true)}
          className='text-purple-500 hover:text-purple-700 transition-colors duration-200'
          title='Learn more about After-Finished Review'
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
              d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </button>
      </div>

      {/* 说明文本 */}
      <p className='text-sm text-gray-600 mb-8'>{description}</p>

      {/* 帮助弹窗 */}
      {showHelpModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4'>
            {/* 弹窗标题 */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <h3 className='text-xl font-bold text-gray-900'>
                After-Finished Review Guide
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1'
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

            {/* 弹窗内容 */}
            <div className='p-6 space-y-6'>
              {/* 第一部分 */}
              <div className='flex items-start gap-4'>
                <div className='flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
                  <span className='text-purple-600 font-semibold text-sm'>
                    1
                  </span>
                </div>
                <div className='flex-1'>
                  <h4 className='font-bold text-gray-900 mb-2 text-lg'>
                    Done with your part? 🎉
                  </h4>
                  <p className='text-gray-600 mb-3 leading-relaxed'>
                    Send a request to confirm completion:
                  </p>
                  <ul className='text-gray-600 space-y-2 ml-4'>
                    <li className='flex items-start gap-2'>
                      <span className='text-purple-500 mt-1'>•</span>
                      <span>
                        Collaborators send a request to the Initiator.
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-purple-500 mt-1'>•</span>
                      <span>Initiators send a request to collaborators.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 第二部分 */}
              <div className='flex items-start gap-4'>
                <div className='flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
                  <span className='text-purple-600 font-semibold text-sm'>
                    2
                  </span>
                </div>
                <div className='flex-1'>
                  <h4 className='font-bold text-gray-900 mb-2 text-lg'>
                    Reviews are a mutual exchange
                  </h4>
                  <p className='text-gray-600 leading-relaxed'>
                    They unlock only once both sides agree the work is complete.
                    After approval, you'll be able to leave a After-Finished
                    Review (final review) of the project and its lead — your
                    feedback will remain as a part of the Collaboration History.
                  </p>
                </div>
              </div>
            </div>

            {/* 关闭按钮 */}
            <div className='flex justify-end p-6 border-t border-gray-200'>
              <button
                onClick={() => setShowHelpModal(false)}
                className='px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 text-base'
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewHeader;
