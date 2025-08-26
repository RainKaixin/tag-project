// use-portfolio-form v1: 作品集表單狀態管理 Hook

import { useState, useCallback } from 'react';

import { extractTags } from '../../../utils/tagParser';
import {
  getInitialFormData,
  validateFormData,
  clearFieldError,
} from '../utils/formDataHelpers';

/**
 * 作品集表單狀態管理 Hook
 * @returns {Object} 表單狀態和操作方法
 */
export const usePortfolioForm = () => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // 處理表單數據變化
  const handleFormChange = useCallback(
    e => {
      const { name, value } = e.target;

      if (name === 'software') {
        if (value === 'Other') {
          return { action: 'showCustomSoftwareModal' };
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

      // 清除對應字段的錯誤
      if (errors[name]) {
        setErrors(prev => clearFieldError(prev, name));
      }

      return { action: 'none' };
    },
    [formData.software, errors]
  );

  // 處理自定義軟件添加
  const handleAddCustomSoftware = useCallback(
    customSoftware => {
      if (
        customSoftware.trim() &&
        !formData.software.includes(customSoftware.trim())
      ) {
        setFormData(prev => ({
          ...prev,
          software: [...prev.software, customSoftware.trim()],
        }));
        return true;
      }
      return false;
    },
    [formData.software]
  );

  // 移除軟件
  const handleRemoveSoftware = useCallback(softwareToRemove => {
    setFormData(prev => ({
      ...prev,
      software: prev.software.filter(software => software !== softwareToRemove),
    }));
  }, []);

  // 處理標籤輸入
  const handleTagInputChange = useCallback(
    e => {
      const value = e.target.value;
      setTagInput(value);

      // 檢查是否以 # 開頭
      if (!value.startsWith('#') && value.length > 0) {
        return; // 不是以 # 開頭，不處理
      }

      // 檢查分隔符：空格、逗號、回車
      const separators = [' ', ',', '\n'];
      const hasSeparator = separators.some(separator =>
        value.includes(separator)
      );

      if (hasSeparator) {
        // 檢查標籤數量限制
        if (formData.tags.length >= 10) {
          setTagInput('');
          return;
        }

        // 提取當前標籤
        const currentTag = value.split(/[\s,\n]/)[0].toLowerCase();

        // 使用統一的標籤解析器驗證
        const extractedTags = extractTags(currentTag);
        if (extractedTags.length > 0) {
          const newTag = `#${extractedTags[0].slug}`;
          // 檢查是否重複
          if (!formData.tags.includes(newTag)) {
            setFormData(prev => ({
              ...prev,
              tags: [...prev.tags, newTag],
            }));
          }
        }

        // 清空輸入框，準備下一個標籤
        setTagInput('');
      }
    },
    [formData.tags]
  );

  // 處理標籤輸入框的鍵盤事件
  const handleTagInputKeyDown = useCallback(
    e => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();

        // 檢查標籤數量限制
        if (formData.tags.length >= 10) {
          setTagInput('');
          return;
        }

        const value = tagInput.trim();
        if (value.startsWith('#')) {
          // 使用統一的標籤解析器驗證
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
    },
    [tagInput, formData.tags]
  );

  // 移除標籤
  const handleRemoveTag = useCallback(tagToRemove => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  }, []);

  // 驗證表單
  const validateForm = useCallback(
    selectedFiles => {
      const newErrors = validateFormData(formData, selectedFiles);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  // 重置表單
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setTagInput('');
    setErrors({});
  }, []);

  return {
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
    resetForm,
    setErrors,
  };
};
