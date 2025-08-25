import React from 'react';

/**
 * 统一的通知徽章组件
 * @param {Object} props - 组件属性
 * @param {number} props.unreadCount - 未读通知数量
 * @param {string} props.className - 额外的CSS类名
 * @param {string} props.size - 徽章尺寸 ('sm', 'md', 'lg')
 * @param {string} props.color - 徽章颜色 ('red', 'blue', 'green', 'orange')
 */
export function NotificationBadge(props) {
  const { unreadCount = 0, className = '', size = 'md', color = 'red' } = props;

  // 如果未读数量为0或负数，不显示徽章
  if (unreadCount <= 0) {
    return null;
  }

  // 格式化显示数量
  const formatCount = count => {
    if (count > 99) return '99+';
    return count.toString();
  };

  // 尺寸配置
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  };

  // 颜色配置
  const colorClasses = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    orange: 'bg-orange-500 text-white',
  };

  const badgeClasses = `${sizeClasses[size]} ${colorClasses[color]} rounded-full flex items-center justify-center font-medium ${className}`;

  return (
    <div className={badgeClasses}>
      <span>{formatCount(unreadCount)}</span>
    </div>
  );
}
