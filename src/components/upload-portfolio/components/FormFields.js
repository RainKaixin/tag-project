// form-fields v1: 表單字段組件

import React from 'react';

import { getSoftwareOptions } from '../utils/formDataHelpers';

/**
 * 表單字段組件
 * @param {Object} props - 組件屬性
 * @param {Object} props.formData - 表單數據
 * @param {string} props.tagInput - 標籤輸入值
 * @param {Function} props.onFormChange - 表單變化處理函數
 * @param {Function} props.onTagInputChange - 標籤輸入變化處理函數
 * @param {Function} props.onTagInputKeyDown - 標籤輸入鍵盤事件處理函數
 * @param {Function} props.onRemoveSoftware - 移除軟件處理函數
 * @param {Function} props.onRemoveTag - 移除標籤處理函數
 * @param {Function} props.onShowCustomSoftwareModal - 顯示自定義軟件模態框處理函數
 * @param {boolean} props.isSubmitting - 是否正在提交
 * @param {Object} props.errors - 錯誤信息
 * @returns {JSX.Element} 表單字段組件
 */
const FormFields = ({
  formData,
  tagInput,
  onFormChange,
  onTagInputChange,
  onTagInputKeyDown,
  onRemoveSoftware,
  onRemoveTag,
  onShowCustomSoftwareModal,
  isSubmitting,
  errors,
}) => {
  const softwareOptions = getSoftwareOptions();

  // 處理軟件選擇
  const handleSoftwareChange = e => {
    const result = onFormChange(e);
    if (result?.action === 'showCustomSoftwareModal') {
      onShowCustomSoftwareModal();
    }
  };

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Title *
          </label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={onFormChange}
            placeholder='Give your work a title...'
            disabled={isSubmitting}
            className={`w-full bg-gray-50 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.title && (
            <p className='text-red-600 text-sm mt-1'>{errors.title}</p>
          )}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Software Used
          </label>

          {/* 已選擇的軟件標籤 */}
          {formData.software.length > 0 && (
            <div className='mb-3 flex flex-wrap gap-2'>
              {formData.software.map((software, index) => (
                <span
                  key={index}
                  className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'
                >
                  {software}
                  <button
                    type='button'
                    onClick={() => onRemoveSoftware(software)}
                    className='ml-2 text-blue-600 hover:text-blue-800'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 軟件選擇下拉框 */}
          <div className='relative'>
            <select
              name='software'
              value=''
              onChange={handleSoftwareChange}
              disabled={isSubmitting}
              className={`w-full bg-gray-50 border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue appearance-none ${
                errors.software ? 'border-red-300' : 'border-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value=''>Add software</option>
              {softwareOptions.map(option => (
                <option key={option} value={option}>
                  {option}
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
          {errors.software && (
            <p className='text-red-600 text-sm mt-1'>{errors.software}</p>
          )}
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Description
        </label>
        <textarea
          name='description'
          value={formData.description}
          onChange={onFormChange}
          placeholder='Describe your work...'
          rows={6}
          disabled={isSubmitting}
          className={`w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue h-24 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Tags <span className='text-red-500'>*</span>
        </label>

        {/* 已選擇的標籤 */}
        {formData.tags.length > 0 && (
          <div className='mb-3 flex flex-wrap gap-2'>
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800'
              >
                {tag}
                <button
                  type='button'
                  onClick={() => onRemoveTag(tag)}
                  className='ml-2 text-green-600 hover:text-green-800'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 標籤輸入框 */}
        <input
          type='text'
          value={tagInput}
          onChange={onTagInputChange}
          onKeyDown={onTagInputKeyDown}
          placeholder={
            formData.tags.length >= 10
              ? 'Maximum 10 tags reached'
              : 'Type # to add tags (e.g., #design #illustration)'
          }
          disabled={isSubmitting || formData.tags.length >= 10}
          className={`w-full bg-gray-50 border rounded px-3 py-2 focus:outline-none focus:ring-1 ${
            formData.tags.length >= 10
              ? 'border-red-300 bg-red-50 text-gray-400'
              : 'border-gray-300 focus:ring-tag-blue focus:border-tag-blue'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div className='flex justify-between items-center mt-1'>
          <p className='text-xs text-gray-500'>
            Start with # and use lowercase letters only. Press space, comma, or
            enter to add tags.
          </p>
          <p
            className={`text-xs ${
              formData.tags.length >= 10
                ? 'text-red-500'
                : formData.tags.length >= 8
                ? 'text-yellow-600'
                : 'text-gray-400'
            }`}
          >
            {formData.tags.length}/10 tags
          </p>
        </div>
        {formData.tags.length >= 10 && (
          <p className='text-xs text-red-500 mt-1'>
            ⚠️ Maximum of 10 tags allowed. Remove some tags to add new ones.
          </p>
        )}
        {errors.tags && (
          <p className='text-red-600 text-sm mt-1'>{errors.tags}</p>
        )}
      </div>
    </div>
  );
};

export default FormFields;
