import React from 'react';

/**
 * 统一的进度条组件
 * @param {Object} props - 组件属性
 * @param {number} props.progress - 进度百分比 (0-100)
 * @param {string} props.color - 进度条颜色 ('blue', 'green', 'purple', 'red', 'orange')
 * @param {string} props.size - 进度条高度 ('sm', 'md', 'lg')
 * @param {string} props.className - 额外的CSS类名
 * @param {boolean} props.showLabel - 是否显示进度标签
 * @param {string} props.label - 自定义标签文本
 */
export function ProgressBar(props) {
  const {
    progress = 0,
    color = 'blue',
    size = 'md',
    className = '',
    showLabel = false,
    label,
    ...restProps
  } = props;

  // 确保进度值在0-100范围内
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // 颜色配置
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600',
    orange: 'bg-orange-600',
  };

  // 尺寸配置
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const progressBarClasses = `w-full bg-gray-200 rounded-full ${sizeClasses[size]} ${className}`;
  const progressFillClasses = `${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500`;

  return (
    <div className='w-full'>
      {showLabel && (
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm text-gray-600'>{label || 'Progress'}</span>
          <span className='text-sm font-medium text-gray-900'>
            {clampedProgress}%
          </span>
        </div>
      )}
      <div
        className={progressBarClasses}
        role='progressbar'
        aria-valuemin='0'
        aria-valuemax='100'
        aria-valuenow={clampedProgress}
        aria-label={`Progress: ${clampedProgress}%`}
        {...restProps}
      >
        <div
          className={progressFillClasses}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
