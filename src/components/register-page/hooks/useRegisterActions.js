// use-register-actions v1: 注册操作逻辑Hook
// 从 RegisterPage.js 中提取的操作逻辑

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { signUp } from '../../../services/supabase/auth';

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
}) => {
  const navigate = useNavigate();

  // 发送验证码
  const sendVerificationCode = useCallback(
    async email => {
      if (!email) {
        setError('email', 'Please enter your email address');
        return;
      }

      setSendingCode(true);
      try {
        // 使用 Supabase 发送验证码
        // 注意：Supabase v2 中，signUp 会自动发送验证邮件
        // 我们这里模拟发送成功，实际注册时会处理
        console.log('Preparing to send verification code to:', email);

        // 模拟发送成功
        setTimeout(() => {
          setSendingCode(false);
          alert('Verification code has been sent to your email');
        }, 1000);
      } catch (error) {
        console.error('Failed to send verification code:', error);
        setSendingCode(false);
        setError('email', 'Failed to send verification code, please try again');
      }
    },
    [setSendingCode, setError]
  );

  // 处理表单提交
  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      try {
        // 使用 Supabase 实现真实的注册逻辑
        const { success, user, error } = await signUp(
          formData.email,
          formData.password,
          {
            // 可以在这里添加额外的用户数据
            // 例如：display_name, avatar_url 等
          }
        );

        if (success) {
          console.log('Registration successful:', user);
          setLoading(false);
          alert(
            'Registration successful! Please check your email to verify your account, then go to login page.'
          );
          navigate('/login');
        } else {
          console.error('Registration failed:', error);
          setLoading(false);
          setGeneralError(error || 'Registration failed, please try again');
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
