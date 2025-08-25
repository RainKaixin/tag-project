import React from 'react';

/**
 * 统一的操作按钮组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 按钮内容
 * @param {string} props.variant - 按钮变体 ('primary', 'success', 'danger', 'secondary')
 * @param {string} props.size - 按钮尺寸 ('sm', 'md', 'lg')
 * @param {string} props.className - 额外的CSS类名
 * @param {boolean} props.disabled - 是否禁用
 * @param {Function} props.onClick - 点击事件处理函数
 */
export function ActionButton(props) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    onClick,
    ...restProps
  } = props;

  // 基础样式类
  const baseClasses =
    'font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // 尺寸配置
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  // 变体配置
  const variantClasses = {
    primary:
      'bg-tag-blue text-white hover:bg-tag-dark-blue focus:ring-tag-blue',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  };

  // 禁用状态样式
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
}
