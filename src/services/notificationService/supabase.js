// notificationService/supabase.js - Supabase 适配器

import { supabase } from '../supabase/client.js';

/**
 * Supabase 通知数据适配器
 * 作为通知服务的主要数据源
 */
export const supabaseAdapter = {
  /**
   * 创建通知
   * @param {Object} notification - 通知数据
   * @returns {Promise<Object>} 创建结果
   */
  createNotification: async notification => {
    try {
      // 转换数据格式以匹配数据库表结构
      const notificationData = {
        type: notification.type,
        sender_id: notification.senderId || null,
        sender_name: notification.senderName || null,
        receiver_id: notification.receiverId,
        title: notification.title,
        content: notification.content,
        message: notification.message,
        is_read: notification.isRead || false,
        created_at: notification.createdAt || new Date().toISOString(),
        meta: notification.meta || {},
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) {
        console.error('[supabaseAdapter] Error creating notification:', error);
        return { success: false, error: error.message };
      }

      console.log(
        '[supabaseAdapter] Created notification in Supabase:',
        data.id
      );
      return { success: true, data };
    } catch (error) {
      console.error('[supabaseAdapter] Error creating notification:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取用户通知列表
   * @param {string} userId - 用户ID
   * @param {Object} options - 查询选项
   * @param {number} options.limit - 限制数量
   * @param {number} options.offset - 偏移量
   * @param {string} options.type - 通知类型过滤
   * @returns {Promise<Object>} 通知列表
   */
  getUserNotifications: async (userId, options = {}) => {
    try {
      const { limit = 50, offset = 0, type = null } = options;

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // 如果指定了类型过滤
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[supabaseAdapter] Error getting notifications:', error);
        return { success: false, error: error.message };
      }

      // 转换数据格式以匹配前端期望的格式
      const notifications = (data || []).map(notification => ({
        id: notification.id,
        type: notification.type,
        senderId: notification.sender_id,
        senderName: notification.sender_name,
        receiverId: notification.receiver_id,
        title: notification.title,
        content: notification.content,
        message: notification.message,
        isRead: notification.is_read,
        createdAt: notification.created_at,
        updatedAt: notification.updated_at,
        meta: notification.meta || {},
      }));

      console.log(
        `[supabaseAdapter] Retrieved ${notifications.length} notifications for user ${userId}`
      );
      return { success: true, data: notifications };
    } catch (error) {
      console.error('[supabaseAdapter] Error getting notifications:', error);
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
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) {
        console.error(
          '[supabaseAdapter] Error marking notification as read:',
          error
        );
        return { success: false, error: error.message };
      }

      console.log(
        '[supabaseAdapter] Marked notification as read:',
        notificationId
      );
      return { success: true, data };
    } catch (error) {
      console.error(
        '[supabaseAdapter] Error marking notification as read:',
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
      // 直接使用 UPDATE 而不是 RPC（因为 RPC 函数可能不存在）
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          updated_at: new Date().toISOString(),
        })
        .eq('receiver_id', userId)
        .eq('is_read', false)
        .select();

      if (error) {
        console.error(
          '[supabaseAdapter] Error marking all notifications as read:',
          error
        );
        return { success: false, error: error.message };
      }

      console.log(
        `[supabaseAdapter] Marked ${data.length} notifications as read for user ${userId}`
      );
      return { success: true, data: { updatedCount: data.length } };
    } catch (error) {
      console.error(
        '[supabaseAdapter] Error marking all notifications as read:',
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
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('[supabaseAdapter] Error deleting notification:', error);
        return { success: false, error: error.message };
      }

      console.log('[supabaseAdapter] Deleted notification:', notificationId);
      return { success: true };
    } catch (error) {
      console.error('[supabaseAdapter] Error deleting notification:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取用户未读通知数量
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 未读数量
   */
  getUnreadCount: async userId => {
    try {
      // 直接查询而不是使用 RPC
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('[supabaseAdapter] Error getting unread count:', error);
        return { success: false, error: error.message };
      }

      console.log(`[supabaseAdapter] Unread count for ${userId}: ${count}`);
      return { success: true, data: count || 0 };
    } catch (error) {
      console.error('[supabaseAdapter] Error getting unread count:', error);
      return { success: false, error: error.message };
    }
  },
};
