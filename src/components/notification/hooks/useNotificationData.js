// useNotificationData.js - 获取通知数据的Hook

import { useEffect, useState } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { notificationService } from '../../../services';

const useNotificationData = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // 获取通知
  const fetchNotifications = async () => {
    if (!user?.id) {
      console.log('[useNotificationData] No user ID, skipping fetch');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(
        '[useNotificationData] Fetching notifications for user:',
        user.id
      );

      const result = await notificationService.getUserNotifications(user.id);

      if (result.success) {
        console.log(
          '[useNotificationData] Retrieved notifications:',
          result.data.length
        );
        setNotifications(result.data || []);

        // 计算未读数量
        const unread = (result.data || []).filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        console.error(
          '[useNotificationData] Failed to fetch notifications:',
          result.error
        );
        setError(result.error);
      }
    } catch (err) {
      console.error('[useNotificationData] Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 标记通知为已读
  const markAsRead = async notificationId => {
    try {
      const result = await notificationService.markAsRead(notificationId);
      if (result.success) {
        // 更新本地状态
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('[useNotificationData] Error marking as read:', err);
    }
  };

  // 标记所有为已读
  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const result = await notificationService.markAllAsRead(user.id);
      if (result.success) {
        // 更新本地状态
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('[useNotificationData] Error marking all as read:', err);
    }
  };

  // 监听通知变化事件
  useEffect(() => {
    const handleNotificationChange = () => {
      console.log(
        '[useNotificationData] Notification change detected, refreshing...'
      );
      fetchNotifications();
    };

    // 监听 follow、like、comment 事件
    window.addEventListener('follow:changed', handleNotificationChange);
    window.addEventListener('like:changed', handleNotificationChange);
    window.addEventListener('comment:added', handleNotificationChange);

    return () => {
      window.removeEventListener('follow:changed', handleNotificationChange);
      window.removeEventListener('like:changed', handleNotificationChange);
      window.removeEventListener('comment:added', handleNotificationChange);
    };
  }, [user?.id]);

  // 组件加载时获取通知
  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotificationData;
