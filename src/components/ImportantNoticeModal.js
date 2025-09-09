// ImportantNoticeModal.js - 重要通知彈窗組件
// 用於用戶登入後首次進入網站時顯示的重要通知

import React from 'react';

const ImportantNoticeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      // 不允許點擊背景關閉，必須點擊 "I Understand" 按鈕
      return;
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col'>
        {/* 头部 */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>IMPORTANT</h2>
          {/* 不顯示關閉按鈕，強制用戶點擊 "I Understand" */}
        </div>

        {/* 内容 */}
        <div className='p-6 overflow-y-auto flex-1'>
          <div className='prose prose-sm max-w-none'>
            <div className='mb-6'>
              <p className='text-lg leading-relaxed text-gray-700'>
                At the current stage, all the{' '}
                <span className='text-blue-600 font-semibold'>
                  Gallery features (blue)
                </span>{' '}
                of TAG have been completed, while the{' '}
                <span className='text-purple-600 font-semibold'>
                  Collaboration system (purple)
                </span>{' '}
                is still under testing and development. I will do my best to
                bring those functions to life in the following weeks.
              </p>
            </div>

            <hr className='my-6' />

            <div className='text-center'>
              <p className='text-lg font-semibold text-gray-900 mb-4'>
                Excited to have you join TAG.
              </p>
              <p className='text-base text-gray-600'>
                Best,
                <br />
                Rain Wang
                <br />
                <span className='text-purple-600 font-semibold'>
                  Founder of TAG
                </span>
              </p>
              <p className='text-base text-gray-600 mt-4'>
                Contact:{' '}
                <a
                  href='mailto:tag@rainwang.art'
                  className='text-purple-600 underline hover:text-purple-700 transition-colors duration-200'
                >
                  tag@rainwang.art
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className='flex justify-center p-6 border-t border-gray-200 flex-shrink-0'>
          <button
            onClick={onClose}
            className='px-8 py-3 bg-tag-blue text-white rounded-md hover:bg-tag-dark-blue transition-colors duration-200 font-medium text-lg'
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportantNoticeModal;
