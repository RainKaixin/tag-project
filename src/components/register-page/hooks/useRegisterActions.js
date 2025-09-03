// use-register-actions v1: 注册操作逻辑Hook
// 从 RegisterPage.js 中提取的操作逻辑

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  sendOTP,
  verifyOTP,
  createUserWithPassword,
} from '../../../services/supabase/auth';
import { getErrorMessage, AUTH_ERRORS } from '../../../utils/authErrorHandler';

/**
 * useRegisterActions Hook - 处理注册表单的操作逻辑
 * @param {Object} params - 参数对象
 * @param {Object} params.formData - 表单数据
 * @param {Function} params.validateForm - 验证表单函数
 * @param {Function} params.setLoading - 设置加载状态函数
 * @param {Function} params.setSendingCode - 设置发送验证码状态函数
 * @param {Function} params.setError - 设置错误函数
 * @param {Function} params.setGeneralError - 设置通用错误函数
 * @returns {Object} 操作函数
 */
const useRegisterActions = ({
  formData,
  validateForm,
  setLoading,
  setSendingCode,
  setError,
  setGeneralError,
  onStepChange, // 新增：步驟控制回調
}) => {
  const navigate = useNavigate();

  // 发送 OTP 验证码
  const sendVerificationCode = useCallback(
    async email => {
      if (!email) {
        setError('email', AUTH_ERRORS.EMPTY_FIELD);
        return;
      }

      setSendingCode(true);
      try {
        // 使用 Supabase OTP 发送验证码
        const { success, error } = await sendOTP(email);

        if (success) {
          setSendingCode(false);
          // 提示用户检查邮箱
          setError(
            'email',
            '✅ Verification code sent! Please check your inbox.'
          );
          // 發送成功後，通知組件跳轉到 OTP 驗證步驟
          if (onStepChange) {
            onStepChange('otp');
          }
        } else {
          setSendingCode(false);
          setError('email', getErrorMessage({ message: error }));
        }
      } catch (error) {
        console.error('Failed to send verification code:', error);
        setSendingCode(false);
        setError('email', 'Failed to send verification code, please try again');
      }
    },
    [setSendingCode, setError]
  );

  // 处理表单提交 - 验证 OTP 并设置密码
  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      try {
        // 使用我們的 Edge Function 創建用戶並設置密碼
        const {
          success: createSuccess,
          user,
          session,
          error: createError,
        } = await createUserWithPassword(
          formData.email,
          formData.verificationCode,
          formData.password
        );

        if (!createSuccess) {
          setLoading(false);
          setGeneralError(getErrorMessage({ message: createError }));
          return;
        }

        // 注册成功！
        console.log('Registration successful:', user);
        setLoading(false);
        alert('Registration successful! You are now logged in.');

        // 用户已经自动登录，跳转到用户的个人页面
        if (user?.id) {
          navigate(`/artist/${user.id}`);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setLoading(false);
        setGeneralError('Registration failed, please try again');
      }
    },
    [formData, validateForm, setLoading, setGeneralError, navigate]
  );

  // 处理登录导航
  const handleLoginClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  return {
    sendVerificationCode,
    handleSubmit,
    handleLoginClick,
  };
};

export default useRegisterActions;
