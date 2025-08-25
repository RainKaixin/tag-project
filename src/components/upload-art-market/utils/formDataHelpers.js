// form-data-helpers v1: 表单数据工具函数
// 从 UploadArtMarket.js 中提取的表单数据处理逻辑

/**
 * 获取初始表单数据
 * @returns {Object} 初始表单数据对象
 */
export const getInitialFormData = () => {
  return {
    title: '',
    category: '',
    description: '',
    tags: '',
    price: '0.00',
    licenseType: 'Standard License',
    fileFormat: '',
    softwareUsed: '',
    agreeToTerms: false,
  };
};

/**
 * 获取分类选项
 * @returns {Array} 分类选项数组
 */
export const getCategoryOptions = () => {
  return [
    { value: '', label: 'Select category' },
    { value: 'graphics', label: 'Graphics' },
    { value: 'illustrations', label: 'Illustrations' },
    { value: 'templates', label: 'Templates' },
    { value: 'icons', label: 'Icons' },
    { value: 'fonts', label: 'Fonts' },
    { value: 'textures', label: 'Textures' },
  ];
};

/**
 * 获取许可证类型选项
 * @returns {Array} 许可证类型选项数组
 */
export const getLicenseTypeOptions = () => {
  return [
    { value: 'Standard License', label: 'Standard License' },
    { value: 'Extended License', label: 'Extended License' },
    { value: 'Commercial License', label: 'Commercial License' },
  ];
};

/**
 * 验证表单数据
 * @param {Object} formData - 表单数据
 * @returns {Object} 验证结果 { isValid: boolean, errors: Array }
 */
export const validateFormData = formData => {
  const errors = [];

  if (!formData.title.trim()) {
    errors.push('Title is required');
  }

  if (!formData.category) {
    errors.push('Category is required');
  }

  if (!formData.description.trim()) {
    errors.push('Description is required');
  }

  if (parseFloat(formData.price) < 0) {
    errors.push('Price must be non-negative');
  }

  if (!formData.agreeToTerms) {
    errors.push('You must agree to the terms');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 格式化表单数据用于提交
 * @param {Object} formData - 原始表单数据
 * @returns {Object} 格式化后的表单数据
 */
export const formatFormDataForSubmission = formData => {
  return {
    ...formData,
    price: parseFloat(formData.price) || 0,
    tags: formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag),
    submittedAt: new Date().toISOString(),
  };
};
