// file-upload-section v1: 文件上傳區域組件

import React from 'react';

import { validateFiles, createFilePreviewUrl } from '../utils/fileHelpers';

/**
 * 文件上傳區域組件
 * @param {Object} props - 組件屬性
 * @param {Array} props.selectedFiles - 選中的文件
 * @param {Function} props.onFileUpload - 文件上傳處理函數
 * @param {Function} props.onRemoveFile - 移除文件處理函數
 * @param {boolean} props.isSubmitting - 是否正在提交
 * @param {number} props.uploadProgress - 上傳進度
 * @param {Object} props.errors - 錯誤信息
 * @returns {JSX.Element} 文件上傳區域組件
 */
const FileUploadSection = ({
  selectedFiles,
  onFileUpload,
  onRemoveFile,
  isSubmitting,
  uploadProgress,
  errors,
}) => {
  // 處理文件選擇
  const handleFileSelect = e => {
    const files = Array.from(e.target.files);
    const { validFiles, errors: validationErrors } = validateFiles(files);

    if (validationErrors.length > 0) {
      // 顯示第一個錯誤
      alert(validationErrors[0]);
      return;
    }

    onFileUpload({ target: { files: validFiles } });
  };

  return (
    <>
      {/* 文件上傳區域 */}
      <div className='border-2 border-dashed border-gray-300 rounded-lg bg-white py-6 px-4 text-center mb-6'>
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
        <p className='text-gray-600 mb-2'>Drag files here or click to browse</p>
        <p className='text-xs text-gray-400 mb-4'>
          JPG, PNG, GIF, PDF (Max 10MB)
        </p>
        <input
          type='file'
          multiple
          accept='.jpg,.jpeg,.png,.gif,.pdf'
          onChange={handleFileSelect}
          className='hidden'
          id='portfolio-file-upload'
          disabled={isSubmitting}
        />
        <label
          htmlFor='portfolio-file-upload'
          className={`bg-tag-blue text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors duration-200 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {selectedFiles.length > 0
            ? `Selected ${selectedFiles.length} files`
            : 'Choose Files'}
        </label>
      </div>

      {/* 文件預覽 */}
      {selectedFiles.length > 0 && (
        <div className='mb-6'>
          <h3 className='text-sm font-medium text-gray-700 mb-3'>
            Selected Files:
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            {selectedFiles.map((file, index) => (
              <div key={index} className='relative group'>
                <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                  {file.type.startsWith('image/') ? (
                    <img
                      src={createFilePreviewUrl(file)}
                      alt={file.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <svg
                        className='w-8 h-8 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <p className='text-xs text-gray-600 mt-1 truncate'>
                  {file.name}
                </p>
                <button
                  type='button'
                  onClick={() => onRemoveFile(index)}
                  className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.files && (
            <p className='text-red-600 text-sm mt-2'>{errors.files}</p>
          )}
        </div>
      )}

      {/* 上傳進度 */}
      {isSubmitting && (
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              Uploading...
            </span>
            <span className='text-sm text-gray-500'>
              {Math.round(uploadProgress)}%
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-tag-blue h-2 rounded-full transition-all duration-300'
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileUploadSection;
