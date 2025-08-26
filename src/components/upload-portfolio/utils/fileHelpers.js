// file-helpers v1: 文件處理工具函數

/**
 * 驗證文件類型和大小
 * @param {File} file - 文件對象
 * @returns {Object} 驗證結果 {isValid: boolean, error: string}
 */
export const validateFile = file => {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.name}. Please upload JPG, PNG, GIF, or PDF files.`,
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File too large: ${file.name}. Maximum size is 10MB.`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * 驗證多個文件
 * @param {Array} files - 文件數組
 * @returns {Object} 驗證結果 {validFiles: Array, errors: Array}
 */
export const validateFiles = files => {
  const validFiles = [];
  const errors = [];

  files.forEach(file => {
    const validation = validateFile(file);
    if (validation.isValid) {
      validFiles.push(file);
    } else {
      errors.push(validation.error);
    }
  });

  return { validFiles, errors };
};

/**
 * 創建文件預覽 URL
 * @param {File} file - 文件對象
 * @returns {string} 預覽 URL
 */
export const createFilePreviewUrl = file => {
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  }
  return null;
};

/**
 * 清理文件預覽 URL
 * @param {string} url - 預覽 URL
 */
export const cleanupFilePreviewUrl = url => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
