// use-register-actions v1: 注册操作逻辑Hook
// 从 RegisterPage.js 中提取的操作逻辑

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
        // 实现实际的验证码发送逻辑
        // 例如：await supabase.auth.sendOtp({ email })
        console.log('Sending verification code to:', email);

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
        // 实现实际的注册逻辑
        // 例如：const { data, error } = await supabase.auth.signUp({
        //   email: formData.email,
        //   password: formData.password
        // });

        console.log('Registration info:', formData);

        // 模拟注册成功
        setTimeout(() => {
          setLoading(false);
          alert('Registration successful! Please go to login page');
          navigate('/login');
        }, 1000);
      } catch (error) {
        console.error('Registration failed:', error);
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
