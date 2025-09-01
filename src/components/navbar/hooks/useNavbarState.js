// use-navbar-state v1: 导航栏状态管理Hook

import React, { useState, useEffect } from 'react';

import { notificationService } from '../../../services';
import {
  getCurrentUserId,
  getCurrentUser,
} from '../../../utils/currentUser.js';

/**
 * 导航栏状态管理Hook
 * @param {Object} user - 当前用户对象
 * @returns {Object} 状态和设置函数
 */
const useNavbarState = user => {
  // 未读通知计数
  const [unreadCount, setUnreadCount] = useState(0);

  // 当前模拟用户
  const [currentMockUser, setCurrentMockUser] = useState(null);

  // 初始化当前用户
  useEffect(() => {
    setCurrentMockUser(getCurrentUser());
  }, []);

  // 下拉菜单状态
  const [showDropdown, setShowDropdown] = useState(false);

  // 加载未读通知计数
  const loadUnreadCount = async () => {
    try {
      const result = await notificationService.getUserNotifications(
        getCurrentUserId()
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
      console.log('[useNavbarState] Current userId:', getCurrentUserId());

      if (!id || id === getCurrentUserId()) {
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

    // 监听用户切换事件
    const onUserChange = e => {
      const id = e?.detail?.userId;
      if (id && mounted) {
        setCurrentMockUser(getCurrentUser());
        // 延迟加载未读计数，避免频繁调用
        setTimeout(() => {
          if (mounted) {
            loadUnreadCount();
          }
        }, 100);
      }
    };

    window.addEventListener('notif:unreadChanged', onChange);
    window.addEventListener('user:changed', onUserChange);

    return () => {
      mounted = false;
      window.removeEventListener('notif:unreadChanged', onChange);
      window.removeEventListener('user:changed', onUserChange);
    };
  }, []); // 空依赖数组，只在挂载时执行

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
    currentMockUser,
    showDropdown,

    // 设置函数
    setUnreadCount,
    setCurrentMockUser,
    setShowDropdown,

    // 操作函数
    loadUnreadCount,
    toggleDropdown: () => setShowDropdown(!showDropdown),
    closeDropdown: () => setShowDropdown(false),
  };
};

export default useNavbarState;
