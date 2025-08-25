// register-form v1: 注册表单组件
// 从 RegisterPage.js 中提取的表单字段

import React from 'react';

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
  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* Email Field with Send Code Button */}
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Student Email
        </label>
        <div className='flex space-x-2'>
          <div className='relative flex-1'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <svg
                className='h-5 w-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
            </div>
            <input
              id='email'
              name='email'
              type='email'
              required
              value={formData.email}
              onChange={onInputChange}
              placeholder='your.name@university.edu'
              className={`block w-full pl-10 pr-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          <button
            type='button'
            onClick={() => onSendCode(formData.email)}
            disabled={isSendingCode}
            className='px-4 py-3 text-sm font-medium text-white bg-tag-blue hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-md whitespace-nowrap'
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
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <input
            id='verificationCode'
            name='verificationCode'
            type='text'
            required
            value={formData.verificationCode}
            onChange={onInputChange}
            placeholder='Enter 6-digit code'
            maxLength='6'
            className={`block w-full pl-10 pr-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
              errors.verificationCode ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.verificationCode && (
          <p className='mt-1 text-sm text-red-600'>{errors.verificationCode}</p>
        )}
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
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <input
            id='password'
            name='password'
            type='password'
            required
            value={formData.password}
            onChange={onInputChange}
            placeholder='••••••••'
            className={`block w-full pl-10 pr-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.password && (
          <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
        )}
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
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            required
            value={formData.confirmPassword}
            onChange={onInputChange}
            placeholder='••••••••'
            className={`block w-full pl-10 pr-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.confirmPassword && (
          <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword}</p>
        )}
      </div>

      {/* General Error */}
      {errors.general && (
        <div className='text-sm text-red-600 text-center'>{errors.general}</div>
      )}

      {/* Register Button */}
      <button
        type='submit'
        disabled={isLoading}
        className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tag-blue hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
      >
        {isLoading ? (
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
        ) : null}
        {isLoading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
