// ConfirmDialog.js - 通用确认弹窗组件
// 用于所有危险操作的确认

import React from 'react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'danger', // danger, warning, info
}) => {
  if (!isOpen) return null;

  // 根据类型设置样式
  const getStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'info':
        return {
          icon: 'ℹ️',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
        };
      default:
        return {
          icon: '❓',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
        };
    }
  };

  const styles = getStyles();

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
      <div
        className={`${styles.bgColor} border ${styles.borderColor} rounded-lg shadow-xl max-w-md w-full mx-4`}
      >
        {/* 头部 */}
        <div className='flex items-center p-4 border-b border-gray-200'>
          <span className={`text-2xl mr-3 ${styles.iconColor}`}>
            {styles.icon}
          </span>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>

        {/* 内容 */}
        <div className='p-4'>
          <p className='text-gray-700 whitespace-pre-wrap'>{message}</p>
        </div>

        {/* 按钮 */}
        <div className='flex justify-end space-x-3 p-4 border-t border-gray-200'>
          <button
            onClick={handleCancel}
            className='px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded transition-colors'
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white ${styles.buttonColor} rounded transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
