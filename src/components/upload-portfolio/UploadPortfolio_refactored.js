// upload-portfolio-refactored v1: 重構後的作品集上傳組件

import React, { useState } from 'react';

import { SuccessModal, ErrorModal } from '../ui';

import {
  FileUploadSection,
  FormFields,
  CustomSoftwareModal,
  ConfirmUploadModal,
  SubmitButton,
} from './components';
import { usePortfolioForm, usePortfolioActions } from './hooks';

/**
 * 重構後的作品集上傳組件
 * @returns {JSX.Element} 作品集上傳組件
 */
const UploadPortfolio_refactored = () => {
  // 使用自定義 Hooks
  const {
    formData,
    tagInput,
    errors,
    handleFormChange,
    handleAddCustomSoftware,
    handleRemoveSoftware,
    handleTagInputChange,
    handleTagInputKeyDown,
    handleRemoveTag,
    validateForm,
    setErrors,
  } = usePortfolioForm();

  const {
    selectedFiles,
    isSubmitting,
    uploadProgress,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    showConfirmModal,
    handleFileUpload,
    handleRemoveFile,
    handleSubmit,
    handleConfirmUpload,
    handleCloseSuccessModal,
    handleCloseErrorModal,
    handleCloseConfirmModal,
  } = usePortfolioActions();

  // 自定義軟件模態框狀態
  const [showCustomSoftwareModal, setShowCustomSoftwareModal] = useState(false);

  // 處理顯示自定義軟件模態框
  const handleShowCustomSoftwareModal = () => {
    setShowCustomSoftwareModal(true);
  };

  // 處理關閉自定義軟件模態框
  const handleCloseCustomSoftwareModal = () => {
    setShowCustomSoftwareModal(false);
  };

  // 處理添加自定義軟件
  const handleAddCustomSoftwareWithClose = customSoftware => {
    const success = handleAddCustomSoftware(customSoftware);
    if (success) {
      handleCloseCustomSoftwareModal();
    }
  };

  // 處理表單提交
  const handleFormSubmit = e => {
    handleSubmit(e, formData, validateForm);
  };

  // 處理確認上傳
  const handleConfirmUploadWithData = () => {
    handleConfirmUpload(formData);
  };

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

      {/* 錯誤顯示 */}
      {errors.general && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-red-600 text-sm'>{errors.general}</p>
        </div>
      )}

      {/* 文件上傳區域 */}
      <FileUploadSection
        selectedFiles={selectedFiles}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        isSubmitting={isSubmitting}
        uploadProgress={uploadProgress}
        errors={errors}
      />

      {/* 表單字段 */}
      <form onSubmit={handleFormSubmit} className='space-y-4'>
        <FormFields
          formData={formData}
          tagInput={tagInput}
          onFormChange={handleFormChange}
          onTagInputChange={handleTagInputChange}
          onTagInputKeyDown={handleTagInputKeyDown}
          onRemoveSoftware={handleRemoveSoftware}
          onRemoveTag={handleRemoveTag}
          onShowCustomSoftwareModal={handleShowCustomSoftwareModal}
          isSubmitting={isSubmitting}
          errors={errors}
        />

        {/* 提交按鈕 */}
        <SubmitButton isSubmitting={isSubmitting} onSubmit={handleFormSubmit} />
      </form>

      {/* 自定義軟件輸入模態框 */}
      <CustomSoftwareModal
        isOpen={showCustomSoftwareModal}
        onClose={handleCloseCustomSoftwareModal}
        onAdd={handleAddCustomSoftwareWithClose}
      />

      {/* 確認上傳彈窗 */}
      <ConfirmUploadModal
        isOpen={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmUploadWithData}
      />

      {/* 成功提示模態框 */}
      <SuccessModal
        isOpen={showSuccessModal}
        title='🎉 Success!'
        message='Portfolio work published successfully to TAG!'
        onClose={handleCloseSuccessModal}
      />

      {/* 錯誤提示模態框 */}
      <ErrorModal
        isOpen={showErrorModal}
        title='⚠️ Error'
        message={errorMessage}
        onClose={handleCloseErrorModal}
      />
    </div>
  );
};

export default UploadPortfolio_refactored;
