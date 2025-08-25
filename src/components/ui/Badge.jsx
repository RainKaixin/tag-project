import React from 'react';

/**
 * 统一的徽章组件
 * @param {Object} props - 组件属性
 * @param {string|number} props.count - 徽章显示的数值
 * @param {string} props.color - 徽章颜色 ('gray', 'blue', 'green', 'red', 'yellow', 'purple')
 * @param {string} props.size - 徽章尺寸 ('sm', 'md', 'lg')
 * @param {string} props.variant - 徽章变体 ('default', 'outline', 'dot')
 * @param {string} props.className - 额外的CSS类名
 */
export function Badge(props) {
  const {
    count,
    color = 'gray',
    size = 'md',
    variant = 'default',
    className = '',
    ...restProps
  } = props;

  // 颜色配置
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    red: 'bg-red-100 text-red-600 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
  };

  // 尺寸配置
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  };

  // 变体配置
  const variantClasses = {
    default: 'rounded-full',
    outline: 'rounded-full border',
    dot: 'rounded-full w-2 h-2',
  };

  // 如果是dot变体，忽略count和size
  if (variant === 'dot') {
    return (
      <span
        className={`inline-block ${colorClasses[color]} ${variantClasses[variant]} ${className}`}
        {...restProps}
      />
    );
  }

  // 如果count为0或null，不显示徽章
  if (!count || count === 0) {
    return null;
  }

  const badgeClasses = `${colorClasses[color]} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <span
      className={`inline-flex items-center justify-center font-medium ${badgeClasses}`}
      {...restProps}
    >
      {count}
    </span>
  );
}
