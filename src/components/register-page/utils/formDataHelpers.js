// form-data-helpers v1: 注册表单数据工具函数
// 从 RegisterPage.js 中提取的表单数据处理逻辑

/**
 * 获取初始表单数据
 * @returns {Object} 初始表单数据对象
 */
export const getInitialFormData = () => {
  return {
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
  };
};

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export const validateEmail = email => {
  return /\S+@\S+\.\S+/.test(email);
};

/**
 * 验证验证码格式
 * @param {string} code - 验证码
 * @returns {boolean} 是否有效
 */
export const validateVerificationCode = code => {
  return /^\d{6}$/.test(code);
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {boolean} 是否有效
 */
export const validatePassword = password => {
  return password.length >= 6;
};

/**
 * 验证密码确认
 * @param {string} password - 密码
 * @param {string} confirmPassword - 确认密码
 * @returns {boolean} 是否匹配
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * 验证表单数据
 * @param {Object} formData - 表单数据
 * @returns {Object} 验证结果 { isValid: boolean, errors: Object }
 */
export const validateFormData = formData => {
  const errors = {};

  // 验证邮箱
  if (!formData.email) {
    errors.email = 'Please enter your email address';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // 验证验证码
  if (!formData.verificationCode) {
    errors.verificationCode = 'Please enter verification code';
  } else if (!validateVerificationCode(formData.verificationCode)) {
    errors.verificationCode = 'Verification code should be 6 digits';
  }

  // 验证密码
  if (!formData.password) {
    errors.password = 'Please enter password';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  // 验证确认密码
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm password';
  } else if (
    !validatePasswordConfirmation(formData.password, formData.confirmPassword)
  ) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * 清除字段错误
 * @param {Object} errors - 当前错误对象
 * @param {string} fieldName - 字段名称
 * @returns {Object} 清除后的错误对象
 */
export const clearFieldError = (errors, fieldName) => {
  if (errors[fieldName]) {
    const newErrors = { ...errors };
    delete newErrors[fieldName];
    return newErrors;
  }
  return errors;
};


















