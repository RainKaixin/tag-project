import { useState, useEffect } from 'react';

/**
 * 管理员认证管理Hook
 * @returns {Object} 认证状态和方法
 */
export const useAdminAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 权限验证函数
  const validateAdminAccess = () => {
    try {
      // 只检查新的密码验证系统，不再兼容旧的URL参数验证
      const authDataStr = localStorage.getItem('admin_auth_data');
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);

        // 检查认证是否有效（24小时内）
        const loginTime = new Date(authData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        if (authData.isAuthenticated && hoursDiff < 24) {
          setIsAuthorized(true);
          setAuthData(authData);
          return true;
        } else {
          // 认证过期，清除所有认证数据
          localStorage.removeItem('admin_auth_data');
          localStorage.removeItem('admin_super_token');
          localStorage.removeItem('admin_token_timestamp');
        }
      }

      // 不再支持URL参数验证，必须通过密码登录
      return false;
    } catch (error) {
      console.error('Admin validation error:', error);
      return false;
    }
  };

  // 处理登录成功
  const handleLoginSuccess = authData => {
    setAuthData(authData);
    setIsAuthorized(true);
  };

  // 退出登录
  const handleLogout = () => {
    // 清除所有可能的认证数据
    localStorage.removeItem('admin_auth_data');
    localStorage.removeItem('admin_super_token');
    localStorage.removeItem('admin_token_timestamp');

    // 重置状态
    setIsAuthorized(false);
    setAuthData(null);

    // 记录退出日志
    console.log(
      `[Admin Logout] 管理员退出登录 - ${new Date().toLocaleString()}`
    );
  };

  // 激活管理员模式（已废弃，现在必须通过密码登录）
  const activateAdminMode = () => {
    console.warn('[Admin] 旧的激活方式已废弃，请使用密码登录');
    alert('请使用用户名和密码登录管理员面板');
  };

  // 初始化认证状态
  useEffect(() => {
    const isValid = validateAdminAccess();
    if (isValid) {
      // 认证有效，可以在这里加载其他数据
    }
    setLoading(false);

    // 暴露激活函数到全局（已废弃）
    window.activateAdminMode = activateAdminMode;

    // 设置会话超时检测（每小时检查一次）
    const sessionCheckInterval = setInterval(() => {
      const authDataStr = localStorage.getItem('admin_auth_data');
      if (authDataStr) {
        try {
          const authData = JSON.parse(authDataStr);
          const loginTime = new Date(authData.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

          if (hoursDiff >= 24) {
            // 会话过期，自动退出
            handleLogout();
            alert('会话已过期，请重新登录');
          }
        } catch (error) {
          console.error('Session check error:', error);
        }
      }
    }, 60 * 60 * 1000); // 每小时检查一次

    // 清理定时器
    return () => clearInterval(sessionCheckInterval);
  }, []);

  return {
    isAuthorized,
    authData,
    loading,
    handleLoginSuccess,
    handleLogout,
    activateAdminMode,
  };
};
