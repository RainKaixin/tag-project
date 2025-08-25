// file-upload-section v1: 文件上传组件
// 从 UploadArtMarket.js 中提取的文件上传区域

import React from 'react';

/**
 * FileUploadSection 组件 - 艺术市场文件上传区域
 * @param {Object} props - 组件属性
 * @param {Function} props.onFileUpload - 文件上传处理函数
 * @returns {JSX.Element} 文件上传组件
 */
const FileUploadSection = ({ onFileUpload }) => {
  return (
    <div className='space-y-6'>
      {/* 主文件上传区域 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Upload Files
        </label>
        <div className='border-2 border-dashed border-gray-300 rounded-lg bg-white py-6 px-4 text-center'>
          <svg
            className='w-12 h-12 text-gray-400 mx-auto mb-4'
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
          <p className='text-gray-600 mb-2'>
            Drag files here or click to browse
          </p>
          <p className='text-xs text-gray-400 mb-4'>
            JPG, PNG, AI, PSD, SVG, EPS (Max 25MB)
          </p>
          <input
            type='file'
            multiple
            accept='.jpg,.jpeg,.png,.ai,.psd,.svg,.eps'
            onChange={onFileUpload}
            className='hidden'
            id='art-market-file-upload'
          />
          <label
            htmlFor='art-market-file-upload'
            className='bg-tag-blue text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors duration-200'
          >
            Choose Files
          </label>
        </div>
      </div>

      {/* 预览图片上传 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Preview Images
        </label>
        <div className='border-2 border-dashed border-gray-300 rounded-lg bg-white py-6 px-4 text-center'>
          <svg
            className='w-8 h-8 text-gray-400 mx-auto mb-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <p className='text-gray-600 mb-2'>
            Upload preview images to showcase your asset
          </p>
          <p className='text-xs text-gray-400 mb-4'>JPG, PNG (Max 5MB each)</p>
          <input
            type='file'
            multiple
            accept='.jpg,.jpeg,.png'
            onChange={onFileUpload}
            className='hidden'
            id='preview-images-upload'
          />
          <label
            htmlFor='preview-images-upload'
            className='bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-blue-200 transition-colors duration-200'
          >
            Add Previews
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection;
