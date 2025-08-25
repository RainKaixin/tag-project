// use-art-market-actions v1: 艺术市场操作逻辑Hook
// 从 UploadArtMarket.js 中提取的操作逻辑

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatFormDataForSubmission } from '../utils/formDataHelpers';

/**
 * useArtMarketActions Hook - 处理艺术市场表单的操作逻辑
 * @param {Object} params - 参数对象
 * @param {Object} params.formData - 表单数据
 * @param {Function} params.validateForm - 验证表单函数
 * @param {Function} params.setSubmitting - 设置提交状态函数
 * @param {Function} params.onSuccess - 成功回调函数
 * @returns {Object} 操作函数
 */
const useArtMarketActions = ({
  formData,
  validateForm,
  setSubmitting,
  onSuccess,
}) => {
  const navigate = useNavigate();

  // 处理表单提交
  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      // 验证表单
      if (!validateForm()) {
        return;
      }

      setSubmitting(true);

      try {
        // 格式化表单数据
        const formattedData = formatFormDataForSubmission(formData);
        console.log('Art Market form submitted:', formattedData);

        // 这里可以添加实际的API调用
        // await submitArtMarketData(formattedData);

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 调用成功回调
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        // 这里可以添加错误处理逻辑
      } finally {
        setSubmitting(false);
      }
    },
    [formData, validateForm, setSubmitting, onSuccess]
  );

  // 处理取消操作
  const handleCancel = useCallback(() => {
    navigate('/upload/form');
  }, [navigate]);

  return {
    handleSubmit,
    handleCancel,
  };
};

export default useArtMarketActions;
