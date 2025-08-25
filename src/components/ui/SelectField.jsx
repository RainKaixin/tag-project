import React from 'react';

/**
 * 选择字段组件
 * 提供下拉选择功能，支持占位符和选项列表
 * @param {Object} props - 组件属性
 * @param {Array} props.options - 选项数组，每个选项包含value和label
 * @param {string} props.value - 当前选中的值
 * @param {Function} props.onChange - 值变化处理函数
 * @param {string} props.placeholder - 占位符文本
 * @param {string} props.name - 字段名称
 * @param {Object} props.restProps - 其他属性
 */
export function SelectField({
  options,
  value,
  onChange,
  placeholder,
  name,
  ...restProps
}) {
  return (
    <div className='relative'>
      <select
        value={value}
        onChange={onChange}
        name={name}
        className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple appearance-none'
        {...restProps}
      >
        {placeholder && <option value=''>{placeholder}</option>}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
        <svg
          className='w-4 h-4 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </div>
    </div>
  );
}
