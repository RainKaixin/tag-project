import React from 'react';

/**
 * 统一的文件上传区域组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onFileUpload - 文件上传处理函数
 * @param {string} props.id - 文件输入框ID
 * @param {React.ReactNode} props.children - 子组件内容
 * @param {string} props.className - 额外的CSS类名
 * @param {string} props.variant - 上传区域变体 ('default', 'compact', 'large')
 * @param {string} props.accept - 接受的文件类型
 * @param {boolean} props.multiple - 是否允许多文件选择
 * @param {string} props.buttonText - 按钮文本
 * @param {string} props.placeholder - 占位符文本
 */
export function FileUploadArea(props) {
  const {
    onFileUpload,
    id,
    children,
    className = '',
    variant = 'default',
    accept = '.jpg,.jpeg,.png,.gif,.pdf',
    multiple = true,
    buttonText = 'Choose Files',
    placeholder = 'Drag and drop files here, or click to select',
    ...restProps
  } = props;

  // 变体配置
  const variantClasses = {
    default:
      'border-2 border-dashed border-gray-300 rounded-lg bg-white py-8 px-4',
    compact:
      'border-2 border-dashed border-gray-300 rounded-lg bg-white py-4 px-3',
    large:
      'border-2 border-dashed border-gray-300 rounded-lg bg-white py-12 px-6',
  };

  const iconSizes = {
    default: 'w-8 h-8',
    compact: 'w-6 h-6',
    large: 'w-12 h-12',
  };

  const buttonSizes = {
    default: 'px-4 py-2',
    compact: 'px-3 py-1 text-sm',
    large: 'px-6 py-3 text-lg',
  };

  const containerClasses = `${variantClasses[variant]} text-center ${className}`;

  return (
    <div className={containerClasses} {...restProps}>
      <svg
        className={`${iconSizes[variant]} text-gray-400 mx-auto mb-3`}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
        />
      </svg>

      {children || <p className='text-gray-600 mb-4'>{placeholder}</p>}

      <input
        type='file'
        multiple={multiple}
        accept={accept}
        onChange={onFileUpload}
        className='hidden'
        id={id}
      />

      <label
        htmlFor={id}
        className={`bg-tag-blue text-white ${buttonSizes[variant]} rounded cursor-pointer hover:bg-tag-dark-blue transition-colors duration-200 inline-block`}
      >
        {buttonText}
      </label>
    </div>
  );
}
