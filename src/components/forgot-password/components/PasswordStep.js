// password-step v1: 新密碼設置步驟組件
// 用於忘記密碼流程的第三步：設置新密碼

import React, { useState } from 'react';

/**
 * PasswordStep 組件 - 新密碼設置步驟
 * @param {Object} props - 組件屬性
 * @param {string} props.newPassword - 新密碼
 * @param {string} props.confirmPassword - 確認密碼
 * @param {Function} props.onPasswordChange - 密碼變化處理函數
 * @param {Function} props.onPreviousStep - 返回上一步的回調函數
 * @param {Function} props.onComplete - 完成密碼重置的回調函數
 * @param {Object} props.error - 錯誤信息對象
 * @param {Function} props.setError - 設置錯誤的函數
 * @param {Function} props.setGeneralError - 設置通用錯誤的函數
 * @param {boolean} props.isLoading - 是否正在加載
 * @param {Function} props.setIsLoading - 設置加載狀態的函數
 * @returns {JSX.Element} 新密碼設置步驟組件
 */
const PasswordStep = ({
  newPassword,
  confirmPassword,
  onPasswordChange,
  onPreviousStep,
  onComplete,
  error,
  setError,
  setGeneralError,
  isLoading,
  setIsLoading,
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 驗證密碼強度
  const validatePassword = password => {
    return password.length >= 6;
  };

  // 驗證密碼確認
  const validatePasswordConfirmation = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  // 處理密碼重置
  const handleResetPassword = async () => {
    // 清除之前的錯誤
    setError('newPassword', '');
    setError('confirmPassword', '');
    setGeneralError('');

    // 驗證新密碼
    if (!newPassword) {
      setError('newPassword', 'Please enter a new password');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('newPassword', 'Password must be at least 6 characters');
      return;
    }

    // 驗證確認密碼
    if (!confirmPassword) {
      setError('confirmPassword', 'Please confirm your new password');
      return;
    }

    if (!validatePasswordConfirmation(newPassword, confirmPassword)) {
      setError('confirmPassword', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 實現真實的密碼重置邏輯
      // 例如：await supabase.auth.updateUser({ password: newPassword })
      console.log('Resetting password to:', newPassword);

      // 模擬密碼重置成功
      setTimeout(() => {
        setIsLoading(false);
        // 顯示成功消息
        alert(
          'Password reset successfully! You can now login with your new password.'
        );
        onComplete();
      }, 1000);
    } catch (error) {
      console.error('Failed to reset password:', error);
      setIsLoading(false);
      setGeneralError('Failed to reset password, please try again');
    }
  };

  return (
    <div className='space-y-4'>
      {/* 說明文字 */}
      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          Create a new password for your account.
        </p>
        <p className='text-sm text-gray-500 mt-1'>
          Make sure it's secure and easy to remember.
        </p>
      </div>

      {/* 新密碼輸入框 */}
      <div>
        <label
          htmlFor='newPassword'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          New Password
        </label>
        <div className='relative'>
          <input
            id='newPassword'
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={e => onPasswordChange('newPassword', e.target.value)}
            placeholder='Enter new password'
            className={`block w-full pr-10 px-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
              error.newPassword ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <button
            type='button'
            onClick={() => setShowNewPassword(!showNewPassword)}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            {showNewPassword ? (
              <svg
                className='h-5 w-5 text-gray-400 hover:text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                />
              </svg>
            ) : (
              <svg
                className='h-5 w-5 text-gray-400 hover:text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            )}
          </button>
        </div>
        {error.newPassword && (
          <p className='mt-1 text-sm text-red-600'>{error.newPassword}</p>
        )}
      </div>

      {/* 確認密碼輸入框 */}
      <div>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Confirm New Password
        </label>
        <div className='relative'>
          <input
            id='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => onPasswordChange('confirmPassword', e.target.value)}
            placeholder='Confirm new password'
            className={`block w-full pr-10 px-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
              error.confirmPassword ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            {showConfirmPassword ? (
              <svg
                className='h-5 w-5 text-gray-400 hover:text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                />
              </svg>
            ) : (
              <svg
                className='h-5 w-5 text-gray-400 hover:text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            )}
          </button>
        </div>
        {error.confirmPassword && (
          <p className='mt-1 text-sm text-red-600'>{error.confirmPassword}</p>
        )}
      </div>

      {/* 密碼要求提示 */}
      <div className='bg-blue-50 border border-blue-200 rounded-md p-3'>
        <p className='text-sm text-blue-800'>
          <strong>Password requirements:</strong>
        </p>
        <ul className='text-sm text-blue-700 mt-1 space-y-1'>
          <li>• At least 6 characters long</li>
          <li>• Easy to remember but hard to guess</li>
        </ul>
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
          onClick={handleResetPassword}
          disabled={!newPassword || !confirmPassword || isLoading}
          className='flex-1 bg-tag-blue text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default PasswordStep;
