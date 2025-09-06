// form-data-helpers v1: 表單數據處理工具函數

/**
 * 獲取初始表單數據
 * @returns {Object} 初始表單數據
 */
export const getInitialFormData = () => ({
  title: '',
  software: [],
  description: '',
  tags: [],
});

/**
 * 獲取軟件選項列表
 * @returns {Array} 軟件選項數組
 */
export const getSoftwareOptions = () => [
  '3D-Coat',
  '3ds Max',
  'After Effects',
  'Blender',
  'Cinema 4D',
  'DaVinci Resolve',
  'Figma',
  'Gaea',
  'Houdini',
  'Illustrator',
  'InDesign',
  'JavaScript',
  'Maya',
  'Nuke',
  'Photoshop',
  'Python',
  'Substance Designer',
  'Substance Painter',
  'Unity',
  'Unreal Engine',
  'ZBrush',
  'Other',
];

/**
 * 驗證表單數據
 * @param {Object} formData - 表單數據
 * @param {Array} selectedFiles - 選中的文件
 * @returns {Object} 錯誤對象
 */
export const validateFormData = (formData, selectedFiles) => {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  }

  if (formData.tags.length === 0) {
    errors.tags = 'At least one tag is required';
  }

  if (selectedFiles.length === 0) {
    errors.files = 'Please select at least one file';
  }

  return errors;
};

/**
 * 格式化表單數據用於提交
 * @param {Object} formData - 表單數據
 * @param {Array} uploadedFiles - 上傳的文件
 * @param {string} userId - 用戶ID
 * @returns {Object} 格式化後的數據
 */
export const formatFormDataForSubmission = (
  formData,
  uploadedFiles,
  userId
) => ({
  userId: userId, // 添加用戶ID
  title: formData.title.trim(),
  description: formData.description.trim(),
  tags: formData.tags || [], // 自定義標籤，保持原有格式
  software: formData.software || [], // 軟件標籤，分別存儲
  imagePaths: uploadedFiles.map(file => file.path), // 存儲文件路徑作為 key
  thumbnailPath: uploadedFiles[0]?.path || '', // 存儲文件路徑作為 key
  // 確保imageKey與IndexedDB的key一致
  imageKey: uploadedFiles[0]?.path || '',
  isPublic: true,
});

/**
 * 清除字段錯誤
 * @param {Object} errors - 當前錯誤對象
 * @param {string} fieldName - 字段名稱
 * @returns {Object} 更新後的錯誤對象
 */
export const clearFieldError = (errors, fieldName) => {
  const newErrors = { ...errors };
  if (newErrors[fieldName]) {
    delete newErrors[fieldName];
  }
  return newErrors;
};
