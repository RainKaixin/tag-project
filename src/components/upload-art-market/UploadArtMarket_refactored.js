// UploadArtMarket_refactored v1: 重构后的艺术市场上传主组件
// 从 UploadArtMarket.js 重构而来，使用模块化组件和自定义Hook

import React, { useState } from 'react';

import UploadSuccess from '../upload/UploadSuccess';

import {
  ArtMarketHeader,
  FileUploadSection,
  ArtMarketForm,
  ArtMarketFooter,
} from './components';
import { useArtMarketForm, useArtMarketActions } from './hooks';

/**
 * UploadArtMarket_refactored 组件 - 重构后的艺术市场上传页面
 * @returns {JSX.Element} 艺术市场上传页面
 */
const UploadArtMarket_refactored = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  // 使用自定义Hook管理表单状态
  const {
    formData,
    errors,
    isSubmitting,
    handleFormChange,
    handleFileUpload,
    validateForm,
    setSubmitting,
  } = useArtMarketForm();

  // 处理成功提交
  const handleSuccess = () => {
    setShowSuccess(true);
  };

  // 使用自定义Hook管理操作
  const actions = useArtMarketActions({
    formData,
    validateForm,
    setSubmitting,
    onSuccess: handleSuccess,
  });

  // 如果显示成功界面，则渲染UploadSuccess组件
  if (showSuccess) {
    return <UploadSuccess module='Art Market' />;
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      {/* Header Section */}
      <ArtMarketHeader />

      {/* Form */}
      <form className='space-y-6'>
        {/* File Upload Section */}
        <FileUploadSection onFileUpload={handleFileUpload} />

        {/* Form Fields */}
        <ArtMarketForm
          formData={formData}
          onFormChange={handleFormChange}
          errors={errors}
        />

        {/* Footer Section */}
        <ArtMarketFooter
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={actions.handleSubmit}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};

export default UploadArtMarket_refactored;
