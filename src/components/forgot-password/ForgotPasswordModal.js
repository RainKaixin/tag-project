// forgot-password-modal v1: 忘記密碼 Modal 組件
// 提供多步驟的密碼重置流程：郵箱輸入 → 驗證碼 → 新密碼設置

import React, { useState } from 'react';

import { EmailStep, CodeStep, PasswordStep } from './components';

/**
 * ForgotPasswordModal 組件 - 忘記密碼 Modal
 * @param {Object} props - 組件屬性
 * @param {boolean} props.isOpen - 是否顯示 Modal
 * @param {Function} props.onClose - 關閉 Modal 的回調函數
 * @returns {JSX.Element} Modal 組件
 */
const ForgotPasswordModal = ({ isOpen, onClose }) => {
  // 當前步驟：email, code, password
  const [currentStep, setCurrentStep] = useState('email');

  // 表單數據
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 錯誤信息
  const [errors, setErrors] = useState({});

  // 加載狀態
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // 處理步驟切換
  const handleNextStep = step => {
    setCurrentStep(step);
    setErrors({}); // 清除錯誤
  };

  // 處理返回上一步
  const handlePreviousStep = step => {
    setCurrentStep(step);
    setErrors({});
  };

  // 處理 Modal 關閉
  const handleClose = () => {
    setCurrentStep('email');
    setFormData({
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setIsLoading(false);
    setIsSendingCode(false);
    onClose();
  };

  // 處理表單數據更新
  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // 清除對應字段的錯誤
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 設置錯誤
  const setFieldError = (field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message,
    }));
  };

  // 設置通用錯誤
  const setGeneralError = message => {
    setErrors(prev => ({
      ...prev,
      general: message,
    }));
  };

  // 如果 Modal 未開啟，不渲染
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Reset Password
          </h2>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* Step Indicator */}
          <div className='flex items-center justify-center mb-6'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'email'
                    ? 'bg-tag-blue text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                1
              </div>
              <div
                className={`w-2 h-0.5 ${
                  currentStep === 'code' || currentStep === 'password'
                    ? 'bg-tag-blue'
                    : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'code'
                    ? 'bg-tag-blue text-white'
                    : currentStep === 'password'
                    ? 'bg-tag-blue text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
              <div
                className={`w-2 h-0.5 ${
                  currentStep === 'password' ? 'bg-tag-blue' : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'password'
                    ? 'bg-tag-blue text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 'email' && (
            <EmailStep
              email={formData.email}
              onEmailChange={value => handleFormDataChange('email', value)}
              onNextStep={() => handleNextStep('code')}
              error={errors.email}
              setError={setFieldError}
              isLoading={isSendingCode}
              setIsLoading={setIsSendingCode}
            />
          )}

          {currentStep === 'code' && (
            <CodeStep
              email={formData.email}
              verificationCode={formData.verificationCode}
              onCodeChange={value =>
                handleFormDataChange('verificationCode', value)
              }
              onPreviousStep={() => handlePreviousStep('email')}
              onNextStep={() => handleNextStep('password')}
              error={errors.verificationCode}
              setError={setFieldError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {currentStep === 'password' && (
            <PasswordStep
              newPassword={formData.newPassword}
              confirmPassword={formData.confirmPassword}
              onPasswordChange={(field, value) =>
                handleFormDataChange(field, value)
              }
              onPreviousStep={() => handlePreviousStep('code')}
              onComplete={handleClose}
              error={errors}
              setError={setFieldError}
              setGeneralError={setGeneralError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {/* General Error Display */}
          {errors.general && (
            <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-sm text-red-600'>{errors.general}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
