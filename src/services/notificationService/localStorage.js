// notificationService/localStorage.js - LocalStorage 适配器

import { isMock } from '../../utils/envCheck.js';

/**
 * LocalStorage 通知数据适配器
 * 在本地存储中管理通知数据
 */
export const localStorageAdapter = {
  /**
   * 获取存储键名 - 按用户命名空间隔离
   * @param {string} userId - 用户ID
   * @returns {string} 存储键名
   */
  getStorageKey: userId => {
    // 如果没有 userId，返回 null（不再使用默认用户）
    if (!userId) {
      return null;
    }
    return `u.${userId}.notifications`;
  },

  /**
   * 创建通知
   * @param {Object} notification - 通知数据
   * @returns {Promise<Object>} 创建结果
   */
  createNotification: async notification => {
    try {
      const key = localStorageAdapter.getStorageKey(notification.receiverId);
      const existingNotifications = JSON.parse(
        localStorage.getItem(key) || '[]'
      );

      // 添加新通知到列表开头
      existingNotifications.unshift(notification);

      // 限制通知数量，保留最新的100条
      const limitedNotifications = existingNotifications.slice(0, 100);

      localStorage.setItem(key, JSON.stringify(limitedNotifications));

      // 触发未读通知变化事件
      window.dispatchEvent(
        new CustomEvent('notif:unreadChanged', {
          detail: { userId: notification.receiverId },
        })
      );

      console.log(
        `[localStorageAdapter] Created notification for user ${notification.receiverId}`
      );
      console.log('[localStorageAdapter] Notification data:', notification);
      return { success: true, data: notification };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error creating notification:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取用户通知列表
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 通知列表
   */
  getUserNotifications: async userId => {
    try {
      const key = localStorageAdapter.getStorageKey(userId);
      const notifications = JSON.parse(localStorage.getItem(key) || '[]');

      console.log(
        `[localStorageAdapter] Retrieved ${notifications.length} notifications for user ${userId}`
      );
      return { success: true, data: notifications };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error getting notifications for user ${userId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 标记通知为已读
   * @param {string} notificationId - 通知ID
   * @returns {Promise<Object>} 更新结果
   */
  markAsRead: async notificationId => {
    try {
      // 遍历所有用户的通知，找到对应的通知并标记为已读
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith('u.')
      ); // 只遍历以 'u.' 开头的键

      for (const key of keys) {
        const notifications = JSON.parse(localStorage.getItem(key) || '[]');
        const notificationIndex = notifications.findIndex(
          n => n.id === notificationId
        );

        if (notificationIndex !== -1) {
          notifications[notificationIndex].isRead = true;
          localStorage.setItem(key, JSON.stringify(notifications));

          // 触发未读通知变化事件
          const userId = key.replace('u.', '');
          window.dispatchEvent(
            new CustomEvent('notif:unreadChanged', {
              detail: { userId },
            })
          );

          console.log(
            `[localStorageAdapter] Marked notification ${notificationId} as read`
          );
          return { success: true, data: notifications[notificationIndex] };
        }
      }

      console.warn(
        `[localStorageAdapter] Notification ${notificationId} not found`
      );
      return { success: false, error: 'Notification not found' };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error marking notification as read:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 标记用户所有通知为已读
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 更新结果
   */
  markAllAsRead: async userId => {
    try {
      const key = localStorageAdapter.getStorageKey(userId);
      const notifications = JSON.parse(localStorage.getItem(key) || '[]');

      // 标记所有通知为已读
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true,
      }));

      localStorage.setItem(key, JSON.stringify(updatedNotifications));

      // 触发未读通知变化事件
      window.dispatchEvent(
        new CustomEvent('notif:unreadChanged', {
          detail: { userId },
        })
      );

      console.log(
        `[localStorageAdapter] Marked all notifications as read for user ${userId}`
      );
      return { success: true, data: updatedNotifications };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error marking all notifications as read:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 删除通知
   * @param {string} notificationId - 通知ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteNotification: async notificationId => {
    try {
      // 遍历所有用户的通知，找到对应的通知并删除
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith('u.')
      ); // 只遍历以 'u.' 开头的键

      for (const key of keys) {
        const notifications = JSON.parse(localStorage.getItem(key) || '[]');
        const notificationIndex = notifications.findIndex(
          n => n.id === notificationId
        );

        if (notificationIndex !== -1) {
          notifications.splice(notificationIndex, 1);
          localStorage.setItem(key, JSON.stringify(notifications));

          // 触发未读通知变化事件
          const userId = key.replace('u.', '');
          window.dispatchEvent(
            new CustomEvent('notif:unreadChanged', {
              detail: { userId },
            })
          );

          console.log(
            `[localStorageAdapter] Deleted notification ${notificationId}`
          );
          return { success: true };
        }
      }

      console.warn(
        `[localStorageAdapter] Notification ${notificationId} not found`
      );
      return { success: false, error: 'Notification not found' };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error deleting notification:`,
        error
      );
      return { success: false, error: error.message };
    }
  },
};
