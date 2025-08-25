// art-market-form v1: 艺术市场表单组件
// 从 UploadArtMarket.js 中提取的表单字段

import React from 'react';

import {
  getCategoryOptions,
  getLicenseTypeOptions,
} from '../utils/formDataHelpers';

/**
 * ArtMarketForm 组件 - 艺术市场表单字段
 * @param {Object} props - 组件属性
 * @param {Object} props.formData - 表单数据
 * @param {Function} props.onFormChange - 表单变化处理函数
 * @param {Array} props.errors - 错误信息数组
 * @returns {JSX.Element} 表单组件
 */
const ArtMarketForm = ({ formData, onFormChange, errors = [] }) => {
  const categoryOptions = getCategoryOptions();
  const licenseTypeOptions = getLicenseTypeOptions();

  return (
    <div className='space-y-4'>
      {/* 标题字段 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Asset Title
        </label>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={onFormChange}
          placeholder='Name your digital asset...'
          className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
        />
      </div>

      {/* 分类字段 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Category
        </label>
        <div className='relative'>
          <select
            name='category'
            value={formData.category}
            onChange={onFormChange}
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue appearance-none'
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
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
      </div>

      {/* 描述字段 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Description
        </label>
        <textarea
          name='description'
          value={formData.description}
          onChange={onFormChange}
          placeholder="Describe your asset, what's included, and how it can be used..."
          rows={4}
          className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
        />
      </div>

      {/* 三字段并排布局 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* 价格字段 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Price
          </label>
          <input
            type='number'
            name='price'
            value={formData.price}
            onChange={onFormChange}
            placeholder='0.00'
            step='0.01'
            min='0'
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
          />
        </div>

        {/* 许可证类型字段 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            License Type
          </label>
          <div className='relative'>
            <select
              name='licenseType'
              value={formData.licenseType}
              onChange={onFormChange}
              className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue appearance-none'
            >
              {licenseTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
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
        </div>

        {/* 文件格式字段 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            File Format
          </label>
          <input
            type='text'
            name='fileFormat'
            value={formData.fileFormat}
            onChange={onFormChange}
            placeholder='e.g., AI, PSD, SVG'
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
          />
        </div>
      </div>

      {/* 标签字段 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Tags
        </label>
        <input
          type='text'
          name='tags'
          value={formData.tags}
          onChange={onFormChange}
          placeholder='Add relevant tags (e.g., minimal, vector, business)'
          className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
        />
      </div>

      {/* 软件使用字段 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Software Used
        </label>
        <input
          type='text'
          name='softwareUsed'
          value={formData.softwareUsed}
          onChange={onFormChange}
          placeholder='e.g., Adobe Illustrator, Photoshop'
          className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
        />
      </div>

      {/* 错误显示 */}
      {errors.length > 0 && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-start'>
            <svg
              className='w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <div>
              <h4 className='text-sm font-semibold text-red-800 mb-1'>
                Please fix the following errors:
              </h4>
              <ul className='text-sm text-red-800 list-disc list-inside'>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtMarketForm;
