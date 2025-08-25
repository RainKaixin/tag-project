/**
 * 统一错误处理工具
 * 提供标准化的错误处理机制，包括错误分类、日志记录和用户提示
 */

// 错误类型枚举
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  CLIENT: 'CLIENT',
  UNKNOWN: 'UNKNOWN',
};

// 错误严重程度
export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

// 错误消息模板
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: {
    title: 'Network Error',
    message:
      'Unable to connect to the server. Please check your internet connection and try again.',
    userMessage: 'Connection failed. Please try again.',
  },
  [ERROR_TYPES.VALIDATION]: {
    title: 'Validation Error',
    message: 'The provided data is invalid.',
    userMessage: 'Please check your input and try again.',
  },
  [ERROR_TYPES.AUTHENTICATION]: {
    title: 'Authentication Error',
    message: 'You are not authenticated. Please log in.',
    userMessage: 'Please log in to continue.',
  },
  [ERROR_TYPES.AUTHORIZATION]: {
    title: 'Authorization Error',
    message: 'You do not have permission to perform this action.',
    userMessage: 'You do not have permission for this action.',
  },
  [ERROR_TYPES.NOT_FOUND]: {
    title: 'Not Found',
    message: 'The requested resource was not found.',
    userMessage: 'The requested item was not found.',
  },
  [ERROR_TYPES.SERVER]: {
    title: 'Server Error',
    message: 'An internal server error occurred.',
    userMessage: 'Something went wrong. Please try again later.',
  },
  [ERROR_TYPES.CLIENT]: {
    title: 'Client Error',
    message: 'An error occurred in the application.',
    userMessage: 'Something went wrong. Please refresh the page.',
  },
  [ERROR_TYPES.UNKNOWN]: {
    title: 'Unknown Error',
    message: 'An unexpected error occurred.',
    userMessage: 'Something went wrong. Please try again.',
  },
};

/**
 * 错误处理类
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  /**
   * 分析错误类型
   * @param {Error|Object} error - 错误对象
   * @returns {string} 错误类型
   */
  analyzeErrorType(error) {
    if (!error) return ERROR_TYPES.UNKNOWN;

    // 网络错误
    if (
      error.name === 'NetworkError' ||
      error.message?.includes('network') ||
      error.message?.includes('fetch') ||
      error.message?.includes('connection')
    ) {
      return ERROR_TYPES.NETWORK;
    }

    // 验证错误
    if (
      error.name === 'ValidationError' ||
      error.message?.includes('validation') ||
      error.message?.includes('invalid')
    ) {
      return ERROR_TYPES.VALIDATION;
    }

    // 认证错误
    if (
      error.message?.includes('unauthorized') ||
      error.message?.includes('authentication') ||
      error.status === 401
    ) {
      return ERROR_TYPES.AUTHENTICATION;
    }

    // 授权错误
    if (
      error.message?.includes('forbidden') ||
      error.message?.includes('permission') ||
      error.status === 403
    ) {
      return ERROR_TYPES.AUTHORIZATION;
    }

    // 未找到错误
    if (error.message?.includes('not found') || error.status === 404) {
      return ERROR_TYPES.NOT_FOUND;
    }

    // 服务器错误
    if (error.status >= 500) {
      return ERROR_TYPES.SERVER;
    }

    // 客户端错误
    if (error.status >= 400 && error.status < 500) {
      return ERROR_TYPES.CLIENT;
    }

    return ERROR_TYPES.UNKNOWN;
  }

  /**
   * 确定错误严重程度
   * @param {string} errorType - 错误类型
   * @param {Error|Object} error - 错误对象
   * @returns {string} 错误严重程度
   */
  determineSeverity(errorType, error) {
    switch (errorType) {
      case ERROR_TYPES.CRITICAL:
      case ERROR_TYPES.SERVER:
        return ERROR_SEVERITY.CRITICAL;
      case ERROR_TYPES.AUTHENTICATION:
      case ERROR_TYPES.AUTHORIZATION:
        return ERROR_SEVERITY.HIGH;
      case ERROR_TYPES.NETWORK:
      case ERROR_TYPES.VALIDATION:
        return ERROR_SEVERITY.MEDIUM;
      default:
        return ERROR_SEVERITY.LOW;
    }
  }

  /**
   * 记录错误日志
   * @param {Error|Object} error - 错误对象
   * @param {string} context - 错误上下文
   * @param {Object} additionalData - 额外数据
   */
  logError(error, context = '', additionalData = {}) {
    const errorType = this.analyzeErrorType(error);
    const severity = this.determineSeverity(errorType, error);
    const timestamp = new Date().toISOString();

    const errorEntry = {
      timestamp,
      type: errorType,
      severity,
      context,
      message: error.message || 'Unknown error',
      stack: error.stack,
      additionalData,
    };

    // 添加到内存日志
    this.errorLog.push(errorEntry);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // 控制台输出
    const logMethod = severity === ERROR_SEVERITY.CRITICAL ? 'error' : 'warn';
    console[logMethod](
      `[${errorType}] ${context}:`,
      error.message,
      additionalData
    );

    // 严重错误时记录完整堆栈
    if (severity === ERROR_SEVERITY.CRITICAL) {
      console.error('Full error stack:', error.stack);
    }
  }

  /**
   * 获取用户友好的错误消息
   * @param {Error|Object} error - 错误对象
   * @param {string} customMessage - 自定义消息
   * @returns {Object} 错误消息对象
   */
  getUserMessage(error, customMessage = null) {
    const errorType = this.analyzeErrorType(error);
    const template = ERROR_MESSAGES[errorType];

    return {
      title: template.title,
      message: customMessage || template.message,
      userMessage: template.userMessage,
      type: errorType,
    };
  }

  /**
   * 处理错误并返回标准格式
   * @param {Error|Object} error - 错误对象
   * @param {string} context - 错误上下文
   * @param {Object} options - 处理选项
   * @returns {Object} 标准化的错误对象
   */
  handleError(error, context = '', options = {}) {
    const {
      log = true,
      customMessage = null,
      additionalData = {},
      rethrow = false,
    } = options;

    // 记录错误
    if (log) {
      this.logError(error, context, additionalData);
    }

    // 获取用户消息
    const userMessage = this.getUserMessage(error, customMessage);

    // 创建标准化错误对象
    const standardizedError = {
      success: false,
      error: userMessage.userMessage,
      errorType: userMessage.type,
      errorTitle: userMessage.title,
      errorDetails: userMessage.message,
      context,
      timestamp: new Date().toISOString(),
    };

    // 重新抛出错误（如果需要）
    if (rethrow) {
      throw standardizedError;
    }

    return standardizedError;
  }

  /**
   * 获取错误日志
   * @returns {Array} 错误日志数组
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * 清除错误日志
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * 检查是否为可恢复错误
   * @param {Error|Object} error - 错误对象
   * @returns {boolean} 是否可恢复
   */
  isRecoverable(error) {
    const errorType = this.analyzeErrorType(error);
    return [
      ERROR_TYPES.NETWORK,
      ERROR_TYPES.VALIDATION,
      ERROR_TYPES.AUTHENTICATION,
    ].includes(errorType);
  }
}

// 创建全局错误处理器实例
export const errorHandler = new ErrorHandler();

/**
 * 异步错误包装器
 * @param {Function} asyncFunction - 异步函数
 * @param {string} context - 错误上下文
 * @param {Object} options - 处理选项
 * @returns {Function} 包装后的函数
 */
export const withErrorHandling = (
  asyncFunction,
  context = '',
  options = {}
) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      return errorHandler.handleError(error, context, options);
    }
  };
};

export default errorHandler;
