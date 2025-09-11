// register-form v1: 注册表单组件
// 从 RegisterPage.js 中提取的表单字段

import React, { useState } from 'react';

import { validateScadEmail } from '../utils/formDataHelpers';

/**
 * RegisterForm 组件 - 注册表单字段
 * @param {Object} props - 组件属性
 * @param {Object} props.formData - 表单数据
 * @param {Object} props.errors - 错误信息对象
 * @param {Function} props.onInputChange - 输入变化处理函数
 * @param {Function} props.onSendCode - 发送验证码处理函数
 * @param {Function} props.onSubmit - 表单提交处理函数
 * @param {boolean} props.isLoading - 是否正在加载
 * @param {boolean} props.isSendingCode - 是否正在发送验证码
 * @returns {JSX.Element} 表单组件
 */
const RegisterForm = ({
  formData,
  errors,
  onInputChange,
  onSendCode,
  onSubmit,
  isLoading,
  isSendingCode,
}) => {
  // 检查邮箱是否为有效的 SCAD 邮箱（保留逻辑，暂时不启用）
  const isScadEmail = validateScadEmail(formData.email);

  // 启用 SCAD 邮箱限制，只允许 @scad.edu 邮箱注册
  const isDevelopmentMode = process.env.NODE_ENV === 'development';
  const allowAllEmails = false; // 是否允许所有邮箱

  // 檢查是否為有效的SCAD郵箱（包括student.scad.edu）或授權的後門郵箱
  const isValidScadEmail = isScadEmail;
    formData.email.toLowerCase() === 'seeyousiyu@gmail.com' || 
    formData.email.toLowerCase() === 'lampzeni@gmail.com';

  // 調試信息
  console.log('RegisterForm Debug:', {
    email: formData.email,
    isScadEmail,
    isValidScadEmail,
    allowAllEmails,
    isSendingCode,
    buttonDisabled: isSendingCode || (!allowAllEmails && !isValidScadEmail),
  });

  // 測試 validateScadEmail 函數
  console.log('Email validation test:', {
    'test@scad.edu': validateScadEmail('test@scad.edu'),
    'test@student.scad.edu': validateScadEmail('test@student.scad.edu'),
    'test@mail.student.scad.edu': validateScadEmail(
      'test@mail.student.scad.edu'
    ),
    'test@gmail.com': validateScadEmail('test@gmail.com'),
  });

  // 密码显示状态
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 强制清除任何可能的默认值
  React.useEffect(() => {
    // 延迟执行，确保DOM已渲染
    const timer = setTimeout(() => {
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirmPassword');

      if (emailInput && emailInput.value !== '') {
        emailInput.value = '';
      }

      if (passwordInput && passwordInput.value !== '') {
        passwordInput.value = '';
      }

      if (confirmPasswordInput && confirmPasswordInput.value !== '') {
        confirmPasswordInput.value = '';
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* Email Field */}
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Student Email
        </label>
        <div className='flex space-x-2'>
          <div className='relative flex-1'>
            <input
              id='email'
              name='email'
              type='email'
              required
              value={formData.email}
              onChange={onInputChange}
              placeholder='your.name@university.edu'
              autoComplete='off'
              className={`block w-full px-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          <button
            type='button'
            onClick={() => onSendCode(formData.email)}
            disabled={isSendingCode || !isValidScadEmail}
            className={`px-4 py-3 text-sm font-medium rounded-md whitespace-nowrap transition-colors duration-200 ${
              (allowAllEmails || isValidScadEmail) && !isSendingCode
                ? 'text-white bg-tag-blue hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue'
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            {isSendingCode ? 'Sending...' : 'Send Code'}
          </button>
        </div>
        {errors.email && (
          <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
        )}
      </div>

      {/* Verification Code Field */}
      <div>
        <label
          htmlFor='verificationCode'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Verification Code
        </label>
        <div className='relative'>
          <input
            id='verificationCode'
            name='verificationCode'
            type='text'
            required
            value={formData.verificationCode}
            onChange={onInputChange}
            placeholder='Enter 6-digit code'
            maxLength='6'
            autoComplete='off'
            className={`block w-full px-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
              errors.verificationCode ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.verificationCode && (
          <p className='mt-1 text-sm text-red-600'>{errors.verificationCode}</p>
        )}
        <p className='mt-1 text-xs text-gray-500'>
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Password
        </label>
        <div className='relative'>
          <input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={onInputChange}
            placeholder='Enter your password'
            autoComplete='off'
            className={`block w-full pr-10 px-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            {showPassword ? (
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
        {errors.password && (
          <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
        )}
        <p className='mt-1 text-xs text-gray-500'>
          Password must be at least 6 characters
        </p>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Confirm Password
        </label>
        <div className='relative'>
          <input
            id='confirmPassword'
            name='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={onInputChange}
            placeholder='Confirm your password'
            autoComplete='off'
            className={`block w-full pr-10 px-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-tag-blue focus:ring-2 focus:ring-tag-blue sm:text-sm ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
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
        {errors.confirmPassword && (
          <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword}</p>
        )}
      </div>

      {/* General Error */}
      {errors.general && (
        <div className='rounded-md bg-red-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-red-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>
                {errors.general}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type='submit'
        disabled={isLoading}
        className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tag-blue hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
      >
        {isLoading ? (
          <div className='flex items-center'>
            <svg
              className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            Creating Account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
