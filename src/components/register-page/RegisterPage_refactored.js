// RegisterPage_refactored v1: 重构后的注册页面主组件
// 从 RegisterPage.js 重构而来，使用模块化组件和自定义Hook

import React from 'react';

import { RegisterHeader, RegisterForm, RegisterFooter } from './components';
import { useRegisterForm, useRegisterActions } from './hooks';

/**
 * RegisterPage_refactored 组件 - 重构后的注册页面
 * @returns {JSX.Element} 注册页面
 */
const RegisterPage_refactored = () => {
  // 使用自定义Hook管理表单状态
  const {
    formData,
    errors,
    isLoading,
    isSendingCode,
    handleInputChange,
    validateForm,
    setLoading,
    setSendingCode,
    setError,
    setGeneralError,
  } = useRegisterForm();

  // 使用自定义Hook管理操作
  const actions = useRegisterActions({
    formData,
    validateForm,
    setLoading,
    setSendingCode,
    setError,
    setGeneralError,
  });

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          {/* Register Card */}
          <div className='bg-white rounded-lg shadow-lg p-8'>
            {/* Header Section */}
            <RegisterHeader />

            {/* Form Section */}
            <RegisterForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onSendCode={actions.sendVerificationCode}
              onSubmit={actions.handleSubmit}
              isLoading={isLoading}
              isSendingCode={isSendingCode}
            />

            {/* Footer Section */}
            <RegisterFooter onLoginClick={actions.handleLoginClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage_refactored;
