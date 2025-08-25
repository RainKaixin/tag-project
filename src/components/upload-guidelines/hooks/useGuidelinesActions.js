// use-guidelines-actions v1: 上传指南操作处理Hook
// 从 UploadGuidelines.js 中提取的操作逻辑

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * useGuidelinesActions Hook - 处理上传指南的操作逻辑
 * @param {Object} params - 参数对象
 * @param {boolean} params.guidelinesConfirmed - 指南确认状态
 * @param {Object} params.user - 用户对象
 * @returns {Object} 操作函数
 */
const useGuidelinesActions = ({ guidelinesConfirmed, user }) => {
  const navigate = useNavigate();

  // 处理确认指南
  const handleConfirm = useCallback(() => {
    if (guidelinesConfirmed) {
      // 保存用户已确认指南的状态
      localStorage.setItem('tag_guidelines_accepted', 'true');

      // 检查用户是否已登录
      if (user) {
        // 如果已登录，跳转到上传表单页面
        navigate('/upload/form');
      } else {
        // 如果未登录，跳转到登录页面
        navigate('/login');
      }
    }
  }, [guidelinesConfirmed, user, navigate]);

  // 处理返回首页
  const handleBackToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    handleConfirm,
    handleBackToHome,
  };
};

export default useGuidelinesActions;
