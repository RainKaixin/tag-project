// use-art-market-form v1: 艺术市场表单状态管理Hook
// 从 UploadArtMarket.js 中提取的状态管理逻辑

import { useState, useCallback } from 'react';

import { getInitialFormData, validateFormData } from '../utils/formDataHelpers';

/**
 * useArtMarketForm Hook - 管理艺术市场表单状态
 * @returns {Object} 状态和设置函数
 */
const useArtMarketForm = () => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理表单字段变化
  const handleFormChange = useCallback(
    e => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      setFormData(prev => ({
        ...prev,
        [name]: newValue,
      }));

      // 清除相关错误
      if (errors.length > 0) {
        setErrors(prev => prev.filter(error => !error.includes(name)));
      }
    },
    [errors]
  );

  // 处理文件上传
  const handleFileUpload = useCallback(e => {
    const files = e.target.files;
    console.log('Art Market files selected:', files);
    // 这里可以添加文件处理逻辑
  }, []);

  // 验证表单
  const validateForm = useCallback(() => {
    const validation = validateFormData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  // 重置表单
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setErrors([]);
    setIsSubmitting(false);
  }, []);

  // 设置提交状态
  const setSubmitting = useCallback(submitting => {
    setIsSubmitting(submitting);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleFormChange,
    handleFileUpload,
    validateForm,
    resetForm,
    setSubmitting,
  };
};

export default useArtMarketForm;
