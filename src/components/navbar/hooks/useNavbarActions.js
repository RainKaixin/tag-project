// use-navbar-actions v1: 导航栏操作管理Hook

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '../../../utils/navigation';
import { isUserLoggedIn } from '../utils/navbarHelpers';

/**
 * 导航栏操作管理Hook
 * @param {Object} state - 状态对象
 * @param {Object} setters - 设置函数对象
 * @param {Object} user - 当前用户对象
 * @returns {Object} 操作函数
 */
const useNavbarActions = ({ state, setters, user }) => {
  const navigate = useNavigate();
  const { navigateToTAGMe, goHome, navigateToGallery, navigateToArtist } =
    useNavigation();
  const { logout } = useAuth();

  // 处理下拉菜单切换
  const handleDropdownToggle = useCallback(
    e => {
      e.stopPropagation();

      // 如果未登录，直接跳转到登录页
      if (!isUserLoggedIn(user)) {
        navigate('/login');
        return;
      }

      // 检查点击的是头像还是箭头
      const target = e.target;
      const isAvatar = target.tagName === 'IMG' || target.closest('img');
      const isArrow = target.tagName === 'svg' || target.closest('svg');

      if (isAvatar) {
        // 点击头像，跳转到个人档案页
        console.log(
          '🔍 [handleDropdownToggle] Avatar clicked, navigating to /me'
        );
        navigate('/me');
      } else if (isArrow) {
        // 点击箭头，切换下拉菜单
        setters.setShowDropdown(!state.showDropdown);
      } else {
        // 点击按钮其他区域，切换下拉菜单
        setters.setShowDropdown(!state.showDropdown);
      }
    },
    [user, state.showDropdown, setters, navigate, navigateToArtist]
  );

  // 处理设置按钮点击
  const handleSettingsClick = useCallback(() => {
    setters.setShowDropdown(false);
    navigate('/settings/edit-profile');
  }, [setters, navigate]);

  // 处理通知按钮点击
  const handleNotificationsClick = useCallback(() => {
    setters.setShowDropdown(false);
    navigate('/notifications');
  }, [setters, navigate]);

  // 处理登出按钮点击
  const handleLogoutClick = useCallback(() => {
    setters.setShowDropdown(false);

    // 调用认证上下文的登出函数
    logout();

    // 跳转到登录页
    navigate('/login');
  }, [setters, logout, navigate]);

  // 处理Upload按钮点击
  const handleUploadClick = useCallback(() => {
    // 强制先跳转到指南页面，不允许跳过
    navigate('/upload/guidelines');
  }, [navigate]);

  // 处理TAGMe按钮点击
  const handleTAGMeClick = useCallback(() => {
    navigateToTAGMe();
  }, [navigateToTAGMe]);

  // 处理Gallery按钮点击
  const handleGalleryClick = useCallback(() => {
    navigateToGallery();
  }, [navigateToGallery]);

  // 处理Logo点击
  const handleLogoClick = useCallback(() => {
    goHome();
  }, [goHome]);

  // 处理搜索输入
  const handleSearchInput = useCallback(e => {
    const value = e.target.value;
    // 这里可以添加搜索逻辑
    console.log('Search input:', value);
  }, []);

  return {
    // 导航操作
    handleLogoClick,
    handleUploadClick,
    handleTAGMeClick,
    handleGalleryClick,
    handleSearchInput,

    // 用户菜单操作
    handleDropdownToggle,
    handleSettingsClick,
    handleNotificationsClick,
    handleLogoutClick,
  };
};

export default useNavbarActions;
