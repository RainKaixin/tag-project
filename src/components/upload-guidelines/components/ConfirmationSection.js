// confirmation-section v1: 确认区域组件
// 从 UploadGuidelines.js 中提取的确认区域

import React from 'react';

/**
 * ConfirmationSection 组件 - 确认区域
 * @param {Object} props - 组件属性
 * @param {boolean} props.guidelinesConfirmed - 指南确认状态
 * @param {Function} props.onCheckboxChange - 复选框变化处理函数
 * @param {Function} props.onConfirm - 确认处理函数
 * @param {Object} props.user - 用户对象
 * @returns {JSX.Element} 确认区域组件
 */
const ConfirmationSection = ({
  guidelinesConfirmed,
  onCheckboxChange,
  onConfirm,
  user,
}) => {
  return (
    <div className='border-t border-gray-200 pt-8 mt-8'>
      <div className='flex items-center justify-center space-x-4'>
        <label className='flex items-center space-x-3 cursor-pointer'>
          <input
            type='checkbox'
            checked={guidelinesConfirmed}
            onChange={onCheckboxChange}
            className='h-5 w-5 text-tag-blue focus:ring-tag-blue border-gray-300 rounded'
          />
          <span className='text-gray-700 font-medium'>
            I understand and agree to follow these guidelines
          </span>
        </label>
      </div>

      <div className='mt-6 flex justify-center'>
        <button
          onClick={onConfirm}
          disabled={!guidelinesConfirmed}
          className='px-8 py-3 bg-gradient-to-r from-tag-blue to-tag-purple text-white font-medium rounded-lg shadow-lg hover:from-tag-dark-blue hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105'
        >
          {user ? 'Proceed to Upload' : 'Continue to Login'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationSection;
