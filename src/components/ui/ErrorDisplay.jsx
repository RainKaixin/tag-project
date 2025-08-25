import React from 'react';

/**
 * 统一的错误显示组件
 * @param {Object} props - 组件属性
 * @param {string} props.error - 错误信息
 * @param {string} props.className - 额外的CSS类名
 * @param {string} props.variant - 错误样式变体 ('default', 'compact', 'full')
 */
export function ErrorDisplay(props) {
  const { error, className = '', variant = 'default' } = props;

  if (!error) {
    return null;
  }

  // 不同变体的样式配置
  const variantStyles = {
    default: 'p-3 bg-red-50 border border-red-200 rounded-lg',
    compact: 'p-2 bg-red-50 border border-red-200 rounded text-sm',
    full: 'p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm',
  };

  const textStyles = {
    default: 'text-sm text-red-600',
    compact: 'text-xs text-red-600',
    full: 'text-base text-red-600 font-medium',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      <p className={textStyles[variant]}>{error}</p>
    </div>
  );
}
