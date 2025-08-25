import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { artistService } from '../../services/index.js';
import {
  createPortfolioItem,
  uploadPortfolioImage,
} from '../../services/supabase/portfolio';
import { getCurrentUser } from '../../utils/currentUser';
import { extractTags, limitTags } from '../../utils/tagParser';
import { SuccessModal, ErrorModal } from '../ui';

const UploadPortfolio = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    title: '',
    software: [],
    description: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');

  const [showCustomSoftwareModal, setShowCustomSoftwareModal] = useState(false);
  const [customSoftware, setCustomSoftware] = useState('');

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 处理表单数据变化
  const handleFormChange = e => {
    const { name, value } = e.target;

    if (name === 'software') {
      if (value === 'Other') {
        setShowCustomSoftwareModal(true);
        return;
      }

      if (value && !formData.software.includes(value)) {
        setFormData(prev => ({
          ...prev,
          software: [...prev.software, value],
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 处理自定义软件添加
  const handleAddCustomSoftware = () => {
    if (
      customSoftware.trim() &&
      !formData.software.includes(customSoftware.trim())
    ) {
      setFormData(prev => ({
        ...prev,
        software: [...prev.software, customSoftware.trim()],
      }));
      setCustomSoftware('');
      setShowCustomSoftwareModal(false);
    }
  };

  // 移除软件
  const handleRemoveSoftware = softwareToRemove => {
    setFormData(prev => ({
      ...prev,
      software: prev.software.filter(software => software !== softwareToRemove),
    }));
  };

  // 处理标签输入
  const handleTagInputChange = e => {
    const value = e.target.value;
    setTagInput(value);

    // 检查是否以 # 开头
    if (!value.startsWith('#') && value.length > 0) {
      return; // 不是以 # 开头，不处理
    }

    // 检查分隔符：空格、逗号、回车
    const separators = [' ', ',', '\n'];
    const hasSeparator = separators.some(separator =>
      value.includes(separator)
    );

    if (hasSeparator) {
      // 检查标签数量限制
      if (formData.tags.length >= 10) {
        setTagInput('');
        return;
      }

      // 提取当前标签
      const currentTag = value.split(/[\s,\n]/)[0].toLowerCase();

      // 使用统一的标签解析器验证
      const extractedTags = extractTags(currentTag);
      console.log(
        '[UploadPortfolio] Extracted tags:',
        extractedTags,
        'from:',
        currentTag
      );
      if (extractedTags.length > 0) {
        const newTag = `#${extractedTags[0].slug}`;
        console.log('[UploadPortfolio] Adding tag:', newTag);
        // 检查是否重复
        if (!formData.tags.includes(newTag)) {
          setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, newTag],
          }));
        }
      } else {
        console.log('[UploadPortfolio] No tags extracted from:', currentTag);
      }

      // 清空输入框，准备下一个标签
      setTagInput('');
    }
  };

  // 处理标签输入框的键盘事件
  const handleTagInputKeyDown = e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();

      // 检查标签数量限制
      if (formData.tags.length >= 10) {
        setTagInput('');
        return;
      }

      const value = tagInput.trim();
      if (value.startsWith('#')) {
        // 使用统一的标签解析器验证
        const extractedTags = extractTags(value);
        if (extractedTags.length > 0) {
          const newTag = `#${extractedTags[0].slug}`;
          if (!formData.tags.includes(newTag)) {
            setFormData(prev => ({
              ...prev,
              tags: [...prev.tags, newTag],
            }));
          }
        }
      }
      setTagInput('');
    }
  };

  // 移除标签
  const handleRemoveTag = tagToRemove => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // 处理文件上传
  const handleFileUpload = useCallback(e => {
    const files = Array.from(e.target.files);
    console.log('Portfolio files selected:', files);

    // 验证文件类型和大小
    const validFiles = files.filter(file => {
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setErrorMessage(
          `Invalid file type: ${file.name}. Please upload JPG, PNG, GIF, or PDF files.`
        );
        setShowErrorModal(true);
        return false;
      }

      if (file.size > maxSize) {
        setErrorMessage(`File too large: ${file.name}. Maximum size is 10MB.`);
        setShowErrorModal(true);
        return false;
      }

      return true;
    });

    setSelectedFiles(validFiles);
  }, []);

  // 验证表单
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    // 软件使用字段是可选的，不需要验证

    if (selectedFiles.length === 0) {
      newErrors.files = 'Please select at least one file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedFiles]);

  // 处理文件上传到 Supabase Storage
  const uploadFiles = useCallback(async () => {
    const uploadedFiles = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // 更新上传进度
      setUploadProgress((i / selectedFiles.length) * 100);

      // 上传文件到 Supabase Storage
      const result = await uploadPortfolioImage(file, currentUser.id);

      if (result.success) {
        uploadedFiles.push(result.data);
      } else {
        throw new Error(`Failed to upload ${file.name}: ${result.error}`);
      }
    }

    setUploadProgress(100);
    return uploadedFiles;
  }, [selectedFiles, currentUser.id]);

  // 处理表单提交
  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      if (!currentUser) {
        setErrorMessage('Please log in to upload artwork');
        setShowErrorModal(true);
        return;
      }

      // 显示确认弹窗
      setShowConfirmModal(true);
    },
    [formData, selectedFiles, currentUser, validateForm]
  );

  // 确认上传
  const handleConfirmUpload = useCallback(async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setErrors({});

    try {
      // 上传文件到 Supabase Storage
      const uploadedFiles = await uploadFiles();

      // 准备作品数据
      // 调试：检查标签数据
      console.log('[UploadPortfolio] Form data tags:', formData.tags);
      console.log('[UploadPortfolio] Form data software:', formData.software);

      const portfolioData = {
        title: formData.title.trim(),
        category: 'design', // 默认分类
        description: formData.description.trim(),
        tags: [...formData.tags, ...formData.software], // tags 现在是数组，直接使用
        imagePaths: uploadedFiles.map(file => file.path), // 存储文件路径作为 key
        thumbnailPath: uploadedFiles[0]?.path || '', // 存储文件路径作为 key
        // 确保imageKey与IndexedDB的key一致
        imageKey: uploadedFiles[0]?.path || '',
        isPublic: true,
      };

      console.log(
        '[UploadPortfolio] Final portfolio data tags:',
        portfolioData.tags
      );

      // 保存到 Supabase 数据库
      const result = await createPortfolioItem(portfolioData);

      if (result.success) {
        // 确保艺术家被索引
        if (currentUser && currentUser.id) {
          try {
            await artistService.ensureArtistIndexed(currentUser.id);
            console.log('[UploadPortfolio] Artist indexed successfully');
          } catch (indexError) {
            console.warn(
              '[UploadPortfolio] Failed to index artist:',
              indexError
            );
            // 不阻止上传成功，只是记录警告
          }
        }

        setShowSuccessModal(true);
        // 延遲導航，讓用戶看到成功提示
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setErrors({ general: result.error || 'Failed to save artwork' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ general: 'Upload failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  }, [formData, selectedFiles, currentUser, navigate, uploadFiles]);

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='text-center mb-6'>
        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            className='w-8 h-8 text-tag-blue'
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
        </div>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          Share Your Portfolio Work
        </h2>
        <p className='text-gray-600'>
          Upload your creative work to the gallery for everyone to see and get
          inspired
        </p>
      </div>

      {/* 错误显示 */}
      {errors.general && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-red-600 text-sm'>{errors.general}</p>
        </div>
      )}

      {/* 文件上传区域 */}
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
          onChange={handleFileUpload}
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

      {/* 文件预览 */}
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
                      src={URL.createObjectURL(file)}
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
                  onClick={() =>
                    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
                  }
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

      {/* 上传进度 */}
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

      {/* 表单字段 */}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Title *
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleFormChange}
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

            {/* 已选择的软件标签 */}
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
                      onClick={() => handleRemoveSoftware(software)}
                      className='ml-2 text-blue-600 hover:text-blue-800'
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 软件选择下拉框 */}
            <div className='relative'>
              <select
                name='software'
                value=''
                onChange={handleFormChange}
                disabled={isSubmitting}
                className={`w-full bg-gray-50 border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue appearance-none ${
                  errors.software ? 'border-red-300' : 'border-gray-300'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value=''>Add software</option>
                <option value='Photoshop'>Photoshop</option>
                <option value='Illustrator'>Illustrator</option>
                <option value='Blender'>Blender</option>
                <option value='Maya'>Maya</option>
                <option value='3ds Max'>3ds Max</option>
                <option value='Cinema 4D'>Cinema 4D</option>
                <option value='After Effects'>After Effects</option>
                <option value='Premiere Pro'>Premiere Pro</option>
                <option value='Figma'>Figma</option>
                <option value='Sketch'>Sketch</option>
                <option value='Procreate'>Procreate</option>
                <option value='ZBrush'>ZBrush</option>
                <option value='Substance Painter'>Substance Painter</option>
                <option value='Unity'>Unity</option>
                <option value='Unreal Engine'>Unreal Engine</option>
                <option value='Other'>Other</option>
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
            onChange={handleFormChange}
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

          {/* 已选择的标签 */}
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
                    onClick={() => handleRemoveTag(tag)}
                    className='ml-2 text-green-600 hover:text-green-800'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 标签输入框 */}
          <input
            type='text'
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
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
              Start with # and use lowercase letters only. Press space, comma,
              or enter to add tags.
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

        {/* 自定义软件输入模态框 */}
        {showCustomSoftwareModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
              <h3 className='text-lg font-semibold mb-4'>
                Add Custom Software
              </h3>
              <input
                type='text'
                value={customSoftware}
                onChange={e => setCustomSoftware(e.target.value)}
                placeholder='Enter software name...'
                className='w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleAddCustomSoftware();
                  }
                }}
              />
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={() => {
                    setShowCustomSoftwareModal(false);
                    setCustomSoftware('');
                  }}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleAddCustomSoftware}
                  disabled={!customSoftware.trim()}
                  className='px-4 py-2 bg-tag-blue text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full font-semibold py-3 rounded-md transition-colors duration-200 flex items-center justify-center ${
            isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-tag-blue text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Publishing...
            </>
          ) : (
            <>
              <svg
                className='w-5 h-5 mr-2'
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
              Publish to TAG!
            </>
          )}
        </button>
      </form>

      {/* 确认上传弹窗 */}
      {showConfirmModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-tag-blue'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Confirm Upload
              </h3>
              <p className='text-gray-600 mb-6'>
                Are you sure you want to publish this work to TAG? This action
                cannot be undone.
              </p>
              <div className='flex space-x-3'>
                <button
                  type='button'
                  onClick={() => setShowConfirmModal(false)}
                  className='flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleConfirmUpload}
                  className='flex-1 px-4 py-2 bg-tag-blue text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                  Confirm Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示模態框 */}
      <SuccessModal
        isOpen={showSuccessModal}
        title='🎉 Success!'
        message='Portfolio work published successfully to TAG!'
        onClose={() => setShowSuccessModal(false)}
      />

      {/* 錯誤提示模態框 */}
      <ErrorModal
        isOpen={showErrorModal}
        title='⚠️ Error'
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
};

export default UploadPortfolio;
