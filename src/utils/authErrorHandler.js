// authErrorHandler.js - 统一的认证错误处理工具

// 统一的错误处理函数
export const getErrorMessage = error => {
  const message = error.message.toLowerCase();

  if (
    message.includes('already registered') ||
    message.includes('registered')
  ) {
    return 'This email is already registered. Please sign in or use a different email.';
  }
  if (message.includes('expired')) {
    return 'Verification code has expired. Please request a new one.';
  }
  if (message.includes('invalid')) {
    return 'Invalid verification code. Please try again.';
  }
  if (message.includes('password')) {
    return 'Password is not strong enough. Please use a more complex password.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (message.includes('user not found')) {
    return 'No account found with this email. Please sign up first.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please verify your email address first.';
  }
  if (message.includes('network') || message.includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }

  return 'Something went wrong. Please try again.';
};

// 认证流程的常见错误消息
export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Please enter a valid email address.',
  EMPTY_FIELD: 'This field is required.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
  PASSWORD_WEAK:
    'Password should include uppercase letters, numbers, or special characters.',
  CODE_REQUIRED: 'Verification code is required.',
  CODE_INVALID_FORMAT: 'Please enter a 6-digit code.',
  TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions.',
  PRIVACY_NOT_ACCEPTED: 'You must accept the privacy policy.',
};

// 输入验证函数
export const validateInputs = (email, code, password) => {
  if (!email) return AUTH_ERRORS.EMPTY_FIELD;
  if (!/\S+@\S+\.\S+/.test(email)) return AUTH_ERRORS.INVALID_EMAIL;
  if (code && !/^\d{6}$/.test(code)) return AUTH_ERRORS.CODE_INVALID_FORMAT;
  if (password && password.length < 6) return AUTH_ERRORS.PASSWORD_TOO_SHORT;
  return null;
};
