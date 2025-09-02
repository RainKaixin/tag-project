// email-step v1: 郵箱輸入步驟組件
// 用於忘記密碼流程的第一步：輸入郵箱並發送驗證碼

import React, { useState } from 'react';

/**
 * EmailStep 組件 - 郵箱輸入步驟
 * @param {Object} props - 組件屬性
 * @param {string} props.email - 郵箱地址
 * @param {Function} props.onEmailChange - 郵箱變化處理函數
 * @param {Function} props.onNextStep - 進入下一步的回調函數
 * @param {string} props.error - 錯誤信息
 * @param {Function} props.setError - 設置錯誤的函數
 * @param {boolean} props.isLoading - 是否正在加載
 * @param {Function} props.setIsLoading - 設置加載狀態的函數
 * @returns {JSX.Element} 郵箱輸入步驟組件
 */
const EmailStep = ({
  email,
  onEmailChange,
  onNextStep,
  error,
  setError,
  isLoading,
  setIsLoading,
}) => {
  const [isSendingCode, setIsSendingCode] = useState(false);

  // 驗證郵箱格式
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 處理發送驗證碼
  const handleSendCode = async () => {
    if (!email) {
      setError('email', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('email', 'Please enter a valid email address');
      return;
    }

    setIsSendingCode(true);
    try {
      // TODO: 實現真實的驗證碼發送邏輯
      // 例如：await supabase.auth.resetPasswordForEmail(email)
      console.log('Sending reset code to:', email);

      // 模擬發送成功
      setTimeout(() => {
        setIsSendingCode(false);
        // 顯示成功消息並進入下一步
        onNextStep();
      }, 1000);
    } catch (error) {
      console.error('Failed to send reset code:', error);
      setIsSendingCode(false);
      setError('email', 'Failed to send reset code, please try again');
    }
  };

  // 處理繼續按鈕
  const handleContinue = () => {
    if (!email) {
      setError('email', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('email', 'Please enter a valid email address');
      return;
    }

    // 直接進入下一步（跳過發送驗證碼，用於開發測試）
    onNextStep();
  };

  return (
    <div className='space-y-4'>
      {/* 說明文字 */}
      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          Enter your email address and we'll send you a verification code to
          reset your password.
        </p>
      </div>

      {/* 郵箱輸入框 */}
      <div>
        <label
          htmlFor='resetEmail'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Student Email
        </label>
        <div className='flex space-x-2'>
          <div className='relative flex-1'>
            <input
              id='resetEmail'
              type='email'
              value={email}
              onChange={e => onEmailChange(e.target.value)}
              placeholder='your.name@university.edu'
              className={`block w-full px-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          <button
            type='button'
            onClick={handleSendCode}
            disabled={isSendingCode || !email}
            className={`px-4 py-3 text-sm font-medium rounded-md whitespace-nowrap transition-colors duration-200 ${
              email && !isSendingCode
                ? 'text-white bg-tag-blue hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue'
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            {isSendingCode ? 'Sending...' : 'Send Code'}
          </button>
        </div>
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      </div>

      {/* 操作按鈕 */}
      <div className='flex space-x-3 pt-4'>
        <button
          type='button'
          onClick={handleContinue}
          disabled={!email || isLoading}
          className='flex-1 bg-tag-blue text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
        >
          Continue
        </button>
      </div>

      {/* 開發模式提示 */}
      <div className='text-center'>
        <p className='text-xs text-gray-500'>
          Development Mode: You can continue without sending a real verification
          code.
        </p>
      </div>
    </div>
  );
};

export default EmailStep;
