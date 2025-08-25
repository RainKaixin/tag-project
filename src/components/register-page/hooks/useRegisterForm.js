// use-register-form v1: 注册表单状态管理Hook
// 从 RegisterPage.js 中提取的状态管理逻辑

import { useState, useCallback } from 'react';

import {
  getInitialFormData,
  validateFormData,
  clearFieldError,
} from '../utils/formDataHelpers';

/**
 * useRegisterForm Hook - 管理注册表单状态
 * @returns {Object} 状态和设置函数
 */
const useRegisterForm = () => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // 处理表单字段变化
  const handleInputChange = useCallback(
    e => {
      const { name, value } = e.target;

      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));

      // 清除对应字段的错误
      if (errors[name]) {
        setErrors(prev => clearFieldError(prev, name));
      }
    },
    [errors]
  );

  // 验证表单
  const validateForm = useCallback(() => {
    const validation = validateFormData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  // 重置表单
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setErrors({});
    setIsLoading(false);
    setIsSendingCode(false);
  }, []);

  // 设置加载状态
  const setLoading = useCallback(loading => {
    setIsLoading(loading);
  }, []);

  // 设置发送验证码状态
  const setSendingCode = useCallback(sending => {
    setIsSendingCode(sending);
  }, []);

  // 设置错误
  const setError = useCallback((fieldName, errorMessage) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  }, []);

  // 设置通用错误
  const setGeneralError = useCallback(errorMessage => {
    setErrors(prev => ({
      ...prev,
      general: errorMessage,
    }));
  }, []);

  return {
    formData,
    errors,
    isLoading,
    isSendingCode,
    handleInputChange,
    validateForm,
    resetForm,
    setLoading,
    setSendingCode,
    setError,
    setGeneralError,
  };
};

export default useRegisterForm;
