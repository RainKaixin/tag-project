// code-step v1: 驗證碼輸入步驟組件
// 用於忘記密碼流程的第二步：輸入驗證碼

import React from 'react';

/**
 * CodeStep 組件 - 驗證碼輸入步驟
 * @param {Object} props - 組件屬性
 * @param {string} props.email - 郵箱地址
 * @param {string} props.verificationCode - 驗證碼
 * @param {Function} props.onCodeChange - 驗證碼變化處理函數
 * @param {Function} props.onPreviousStep - 返回上一步的回調函數
 * @param {Function} props.onNextStep - 進入下一步的回調函數
 * @param {string} props.error - 錯誤信息
 * @param {Function} props.setError - 設置錯誤的函數
 * @param {boolean} props.isLoading - 是否正在加載
 * @param {Function} props.setIsLoading - 設置加載狀態的函數
 * @returns {JSX.Element} 驗證碼輸入步驟組件
 */
const CodeStep = ({
  email,
  verificationCode,
  onCodeChange,
  onPreviousStep,
  onNextStep,
  error,
  setError,
  isLoading,
  setIsLoading,
}) => {
  // 驗證驗證碼格式
  const validateCode = code => {
    return /^\d{6}$/.test(code);
  };

  // 處理驗證碼驗證
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('verificationCode', 'Please enter the verification code');
      return;
    }

    if (!validateCode(verificationCode)) {
      setError('verificationCode', 'Verification code should be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 實現真實的驗證碼驗證邏輯
      // 例如：await supabase.auth.verifyOtp({ email, token: verificationCode, type: 'recovery' })
      console.log('Verifying code:', verificationCode, 'for email:', email);

      // 模擬驗證成功
      setTimeout(() => {
        setIsLoading(false);
        onNextStep();
      }, 1000);
    } catch (error) {
      console.error('Failed to verify code:', error);
      setIsLoading(false);
      setError(
        'verificationCode',
        'Invalid verification code, please try again'
      );
    }
  };

  // 處理跳過驗證（開發模式）
  const handleSkipVerification = () => {
    if (!verificationCode) {
      setError(
        'verificationCode',
        'Please enter a verification code (or any 6 digits for testing)'
      );
      return;
    }

    // 開發模式下直接進入下一步
    onNextStep();
  };

  return (
    <div className='space-y-4'>
      {/* 說明文字 */}
      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          We've sent a verification code to{' '}
          <span className='font-medium text-gray-900'>{email}</span>
        </p>
        <p className='text-sm text-gray-500 mt-1'>
          Please check your email and enter the 6-digit code below.
        </p>
      </div>

      {/* 驗證碼輸入框 */}
      <div>
        <label
          htmlFor='verificationCode'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Verification Code
        </label>
        <input
          id='verificationCode'
          type='text'
          value={verificationCode}
          onChange={e => onCodeChange(e.target.value)}
          placeholder='Enter 6-digit code'
          maxLength='6'
          className={`block w-full px-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm text-center text-lg tracking-widest ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      </div>

      {/* 重新發送驗證碼 */}
      <div className='text-center'>
        <button
          type='button'
          className='text-sm text-tag-blue hover:text-tag-dark-blue font-medium'
          onClick={() => onPreviousStep()}
        >
          Didn't receive the code? Try again
        </button>
      </div>

      {/* 操作按鈕 */}
      <div className='flex space-x-3 pt-4'>
        <button
          type='button'
          onClick={onPreviousStep}
          className='flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200'
        >
          Back
        </button>
        <button
          type='button'
          onClick={handleVerifyCode}
          disabled={!verificationCode || isLoading}
          className='flex-1 bg-tag-blue text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </div>

      {/* 開發模式提示 */}
      <div className='text-center'>
        <p className='text-xs text-gray-500'>
          Development Mode: You can enter any 6 digits to continue.
        </p>
        <button
          type='button'
          onClick={handleSkipVerification}
          className='text-xs text-tag-blue hover:text-tag-dark-blue mt-1'
        >
          Skip verification (dev mode)
        </button>
      </div>
    </div>
  );
};

export default CodeStep;
