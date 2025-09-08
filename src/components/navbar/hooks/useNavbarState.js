// use-navbar-state v1: 导航栏状态管理Hook

import React, { useState, useEffect } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { notificationService } from '../../../services';

/**
 * 导航栏状态管理Hook
 * @param {Object} user - 当前用户对象
 * @returns {Object} 状态和设置函数
 */
const useNavbarState = user => {
  // 未读通知计数
  const [unreadCount, setUnreadCount] = useState(0);

  // 从 AuthContext 获取当前用户
  const { user: currentUser } = useAuth();

  // 下拉菜单状态
  const [showDropdown, setShowDropdown] = useState(false);

  // 加载未读通知计数
  const loadUnreadCount = async () => {
    try {
      if (!currentUser?.id) {
        setUnreadCount(0);
        return;
      }

      const result = await notificationService.getUserNotifications(
        currentUser.id
      );
      if (result.success) {
        const notifications = result.data || [];
        const unreadCount = notifications.filter(n => !n.isRead).length;
        setUnreadCount(unreadCount);
      } else {
        console.error('Error loading unread notifications:', result.error);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error loading unread notifications:', error);
      setUnreadCount(0);
    }
  };

  // 监听未读通知变化
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (mounted) {
        await loadUnreadCount();
      }
    };

    // 只在组件挂载时加载一次
    load();

    // 监听未读变化事件
    const onChange = e => {
      const id = e?.detail?.userId;
      console.log('[useNavbarState] Notification change event:', e);
      console.log('[useNavbarState] Event userId:', id);
      console.log('[useNavbarState] Current userId:', currentUser?.id);

      if (!id || id === currentUser?.id) {
        console.log('[useNavbarState] Reloading unread count...');
        if (mounted) {
          // 延迟加载未读计数，避免频繁调用
          setTimeout(() => {
            if (mounted) {
              loadUnreadCount();
            }
          }, 100);
        }
      }
    };

    // 不再需要监听用户切换事件，直接从 useAuth 获取

    window.addEventListener('notif:unreadChanged', onChange);

    return () => {
      mounted = false;
      window.removeEventListener('notif:unreadChanged', onChange);
    };
  }, [currentUser]); // 依赖 currentUser，当用户状态变化时重新执行

  // 外部点击关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = event => {
      if (showDropdown) {
        // 这里需要外部传入ref，暂时用简单逻辑
        const target = event.target;
        const isNavbarClick = target.closest('[data-navbar-dropdown]');
        if (!isNavbarClick) {
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return {
    // 状态
    unreadCount,
    currentUser, // 从 AuthContext 获取的用户
    showDropdown,

    // 设置函数
    setUnreadCount,
    setShowDropdown,

    // 操作函数
    loadUnreadCount,
    toggleDropdown: () => setShowDropdown(!showDropdown),
    closeDropdown: () => setShowDropdown(false),
  };
};

export default useNavbarState;
