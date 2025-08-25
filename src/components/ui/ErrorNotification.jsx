import React, { useState, useEffect } from 'react';

import { ERROR_TYPES } from '../../utils/errorHandler';

/**
 * 错误通知组件
 * 用于显示用户友好的错误提示，支持自动消失和手动关闭
 */
export function ErrorNotification({
  error,
  title,
  message,
  type = 'error',
  duration = 5000,
  onClose,
  onRetry,
  showRetry = false,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // 自动关闭
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  // 处理关闭
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // 动画持续时间
  };

  // 处理重试
  const handleRetry = () => {
    onRetry?.();
    handleClose();
  };

  if (!isVisible) return null;

  // 根据类型确定样式
  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700 text-white',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
    }
  };

  const styles = getStyles();

  // 获取图标
  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg
            className='w-5 h-5'
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
        );
      case 'warning':
        return (
          <svg
            className='w-5 h-5'
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
        );
      case 'info':
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      default:
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        border rounded-lg shadow-lg p-4
        transform transition-all duration-300 ease-in-out
        ${styles.container}
        ${
          isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }
        ${className}
      `}
    >
      <div className='flex items-start'>
        {/* 图标 */}
        <div className={`flex-shrink-0 ${styles.icon}`}>{getIcon()}</div>

        {/* 内容 */}
        <div className='ml-3 flex-1'>
          {title && <h3 className='text-sm font-medium mb-1'>{title}</h3>}
          <p className='text-sm'>
            {message || (error && error.message) || 'An error occurred'}
          </p>
        </div>

        {/* 关闭按钮 */}
        <div className='ml-4 flex-shrink-0'>
          <button
            onClick={handleClose}
            className='inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600'
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
      </div>

      {/* 操作按钮 */}
      {(showRetry || onRetry) && (
        <div className='mt-3 flex gap-2'>
          {onRetry && (
            <button
              onClick={handleRetry}
              className={`px-3 py-1 text-xs rounded ${styles.button} transition-colors`}
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 错误通知管理器
 * 用于管理多个错误通知的显示
 */
export function ErrorNotificationManager() {
  const [notifications, setNotifications] = useState([]);

  // 添加通知
  const addNotification = notification => {
    const id = Date.now() + Math.random();
    const newNotification = { id, ...notification };
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  // 移除通知
  const removeNotification = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // 清除所有通知
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className='fixed top-4 right-4 z-50 space-y-2'>
      {notifications.map(notification => (
        <ErrorNotification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

export default ErrorNotification;
