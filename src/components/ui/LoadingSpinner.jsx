import React from 'react';

/**
 * 统一的加载状态组件
 * @param {string} message - 加载消息
 * @param {string} className - 额外的CSS类名
 * @param {string} size - 加载器大小 ('sm', 'md', 'lg')
 * @param {string} color - 加载器颜色 ('blue', 'gray', 'green', 'red')
 * @param {boolean} fullScreen - 是否全屏显示
 * @param {string} variant - 变体类型 ('default', 'simple')
 */
export function LoadingSpinner(props) {
  const {
    message = 'Loading...',
    className = '',
    size = 'md',
    color = 'blue',
    fullScreen = false,
    variant = 'default',
  } = props;

  // 尺寸配置
  const sizeConfig = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  // 颜色配置
  const colorConfig = {
    blue: 'border-tag-blue',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600',
  };

  // 简单变体（只有旋转器，没有消息）
  if (variant === 'simple') {
    return (
      <div
        className={`animate-spin rounded-full ${sizeConfig[size]} border-b-2 ${colorConfig[color]} mx-auto ${className}`}
      />
    );
  }

  // 默认变体（有旋转器和消息）
  const containerClasses = fullScreen
    ? `flex items-center justify-center h-screen ${className}`
    : `flex items-center justify-center ${className}`;

  return (
    <div className={containerClasses}>
      <div className='text-center'>
        <div
          className={`animate-spin rounded-full ${sizeConfig[size]} border-b-2 ${colorConfig[color]} mx-auto mb-4`}
        />
        {message && <p className='text-gray-600'>{message}</p>}
      </div>
    </div>
  );
}
