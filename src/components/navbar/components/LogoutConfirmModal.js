// LogoutConfirmModal.js - 登出确认弹窗组件
// 用于确认用户登出操作，显示注册邮箱

import React from 'react';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, userEmail }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // 阻止背景点击关闭
  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      onClick={handleBackdropClick}
    >
      <div className='bg-white border border-gray-200 rounded-lg shadow-xl max-w-md w-full mx-4'>
        {/* 头部 */}
        <div className='flex items-center p-4 border-b border-gray-200'>
          <span className='text-2xl mr-3 text-orange-600'>⚠️</span>
          <h3 className='text-lg font-semibold text-gray-900'>
            Confirm Logout
          </h3>
        </div>

        {/* 内容 */}
        <div className='p-4'>
          <div className='mb-4'>
            <p className='text-sm text-gray-600 mb-2'>Registered email:</p>
            <p className='text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded border'>
              {userEmail || 'Unknown'}
            </p>
          </div>
          <p className='text-gray-700'>Are you sure you want to logout?</p>
        </div>

        {/* 按钮 */}
        <div className='flex justify-end space-x-3 p-4 border-t border-gray-200'>
          <button
            onClick={handleCancel}
            className='px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className='px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded transition-colors'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
