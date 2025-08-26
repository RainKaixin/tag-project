// confirm-upload-modal v1: 確認上傳模態框組件

import React from 'react';

/**
 * 確認上傳模態框組件
 * @param {Object} props - 組件屬性
 * @param {boolean} props.isOpen - 是否顯示模態框
 * @param {Function} props.onClose - 關閉模態框處理函數
 * @param {Function} props.onConfirm - 確認上傳處理函數
 * @returns {JSX.Element|null} 確認上傳模態框組件
 */
const ConfirmUploadModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-tag-blue'
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
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Confirm Upload
          </h3>
          <p className='text-gray-600 mb-6'>
            Are you sure you want to publish this work to TAG? This action
            cannot be undone.
          </p>
          <div className='flex space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={onConfirm}
              className='flex-1 px-4 py-2 bg-tag-blue text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              Confirm Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUploadModal;
