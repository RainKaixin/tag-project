// use-portfolio-actions v1: 作品集表單操作邏輯 Hook

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { artistService } from '../../../services/index.js';
import {
  createPortfolioItem,
  uploadPortfolioImage,
} from '../../../services/supabase/portfolio';
import { getCurrentUser } from '../../../utils/currentUser';
import { formatFormDataForSubmission } from '../utils/formDataHelpers';

/**
 * 作品集表單操作邏輯 Hook
 * @returns {Object} 操作方法和狀態
 */
export const usePortfolioActions = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 處理文件上傳
  const handleFileUpload = useCallback(e => {
    const files = Array.from(e.target.files);
    console.log('Portfolio files selected:', files);

    // 驗證文件類型和大小的邏輯將在組件中處理
    setSelectedFiles(files);
  }, []);

  // 移除文件
  const handleRemoveFile = useCallback(index => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // 處理文件上傳到 Supabase Storage
  const uploadFiles = useCallback(async () => {
    const uploadedFiles = [];
    const currentUser = getCurrentUser();

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // 更新上傳進度
      setUploadProgress((i / selectedFiles.length) * 100);

      // 上傳文件到 Supabase Storage
      const result = await uploadPortfolioImage(file, currentUser.id);

      if (result.success) {
        uploadedFiles.push(result.data);
      } else {
        throw new Error(`Failed to upload ${file.name}: ${result.error}`);
      }
    }

    setUploadProgress(100);
    return uploadedFiles;
  }, [selectedFiles]);

  // 處理表單提交
  const handleSubmit = useCallback(
    async (e, formData, validateForm) => {
      e.preventDefault();

      if (!validateForm(selectedFiles)) {
        return;
      }

      const currentUser = getCurrentUser();
      if (!currentUser) {
        setErrorMessage('Please log in to upload artwork');
        setShowErrorModal(true);
        return;
      }

      // 顯示確認彈窗
      setShowConfirmModal(true);
    },
    [selectedFiles]
  );

  // 確認上傳
  const handleConfirmUpload = useCallback(
    async formData => {
      setShowConfirmModal(false);
      setIsSubmitting(true);

      try {
        // 上傳文件到 Supabase Storage
        const uploadedFiles = await uploadFiles();

        // 準備作品數據
        console.log('[UploadPortfolio] Form data tags:', formData.tags);
        console.log('[UploadPortfolio] Form data software:', formData.software);

        const portfolioData = formatFormDataForSubmission(
          formData,
          uploadedFiles
        );

        console.log(
          '[UploadPortfolio] Final portfolio data tags:',
          portfolioData.tags
        );

        // 保存到 Supabase 數據庫
        const result = await createPortfolioItem(portfolioData);

        if (result.success) {
          // 確保藝術家被索引
          const currentUser = getCurrentUser();
          if (currentUser && currentUser.id) {
            try {
              await artistService.ensureArtistIndexed(currentUser.id);
              console.log('[UploadPortfolio] Artist indexed successfully');
            } catch (indexError) {
              console.warn(
                '[UploadPortfolio] Failed to index artist:',
                indexError
              );
              // 不阻止上傳成功，只是記錄警告
            }
          }

          setShowSuccessModal(true);
          // 延遲導航，讓用戶看到成功提示
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          throw new Error(result.error || 'Failed to save artwork');
        }
      } catch (error) {
        console.error('Upload error:', error);
        setErrorMessage('Upload failed. Please try again.');
        setShowErrorModal(true);
      } finally {
        setIsSubmitting(false);
        setUploadProgress(0);
      }
    },
    [uploadFiles, navigate]
  );

  // 關閉成功模態框
  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  // 關閉錯誤模態框
  const handleCloseErrorModal = useCallback(() => {
    setShowErrorModal(false);
  }, []);

  // 關閉確認模態框
  const handleCloseConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  return {
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
  };
};
