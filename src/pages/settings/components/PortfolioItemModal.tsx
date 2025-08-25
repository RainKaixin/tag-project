import React, { useState, useEffect } from 'react';

import styles from '../EditProfile.module.css';

export interface PortfolioItemData {
  title: string;
  description: string;
  software: string[]; // 改为数组以支持多个软件
  tags: string[]; // 添加 tags 字段
}

interface PortfolioItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PortfolioItemData) => void;
  initialData?: Partial<PortfolioItemData>;
  fileName?: string;
}

const PortfolioItemModal: React.FC<PortfolioItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  fileName = '',
}) => {
  const [formData, setFormData] = useState<PortfolioItemData>({
    title: '',
    description: '',
    software: [],
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 当弹窗打开时，重置表单数据
  useEffect(() => {
    if (isOpen) {
      const defaultTitle = fileName.replace(/\.[^/.]+$/, '') || '';
      setFormData({
        title: initialData.title || defaultTitle,
        description: initialData.description || '',
        software: Array.isArray(initialData.software)
          ? initialData.software
          : [],
        tags: Array.isArray(initialData.tags) ? initialData.tags : [],
      });
      setErrors({});
    }
  }, [isOpen, fileName, initialData]); // 重新添加 initialData 依赖

  const handleInputChange = (field: keyof PortfolioItemData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.portfolioModalContent}>
        <div className={styles.portfolioModalHeader}>
          <h2>Edit Portfolio Item</h2>
          <button
            type='button'
            className={styles.portfolioCloseButton}
            onClick={handleCancel}
          >
            ×
          </button>
        </div>

        <div className={styles.portfolioModalBody}>
          <div className={styles.formGroup}>
            <label htmlFor='title' className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              type='text'
              id='title'
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              className={`${styles.input} ${errors.title ? styles.error : ''}`}
              placeholder='Enter your artwork title'
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='description' className={styles.label}>
              Description
            </label>
            <textarea
              id='description'
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              className={styles.textarea}
              placeholder='Describe your artwork, concept, or inspiration...'
              rows={4}
            />
          </div>
        </div>

        <div className={styles.portfolioModalFooter}>
          <button
            type='button'
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type='button'
            className={styles.saveButton}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItemModal;
