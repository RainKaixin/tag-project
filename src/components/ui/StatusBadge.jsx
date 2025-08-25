import React from 'react';

/**
 * 状态徽章组件
 * 显示状态信息，支持自定义样式
 * @param {Object} props - 组件属性
 * @param {string} props.status - 状态类型
 * @param {React.ReactNode} props.children - 显示内容
 * @param {string} props.className - 额外的CSS类名
 * @param {Object} props.restProps - 其他属性
 */
export function StatusBadge({ children, className = '', ...restProps }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}
      {...restProps}
    >
      {children}
    </span>
  );
}
