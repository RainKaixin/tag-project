import { supabase } from './client.js';

/**
 * 通知数据服务
 * 提供通知CRUD操作、标记已读、批量操作等功能
 */

// 获取用户通知列表
export const getNotifications = async (userId, options = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      isRead,
      orderBy = 'created_at',
      orderDirection = 'desc',
    } = options;

    let query = supabase
      .from('notifications')
      .select(
        `
        *,
        sender:users(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .eq('recipient_id', userId)
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    if (type) {
      query = query.eq('type', type);
    }

    if (isRead !== undefined) {
      query = query.eq('is_read', isRead);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取单个通知详情
export const getNotification = async notificationId => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(
        `
        *,
        sender:users(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .eq('id', notificationId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 创建通知
export const createNotification = async notificationData => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select(
        `
        *,
        sender:users(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 批量创建通知
export const createBatchNotifications = async notificationsData => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationsData).select(`
        *,
        sender:users(
          id,
          name,
          avatar_url,
          role
        )
      `);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 更新通知
export const updateNotification = async (notificationId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', notificationId)
      .select(
        `
        *,
        sender:users(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 删除通知
export const deleteNotification = async notificationId => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 标记通知为已读
export const markAsRead = async notificationId => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 批量标记通知为已读
export const markMultipleAsRead = async notificationIds => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .in('id', notificationIds)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 标记用户所有通知为已读
export const markAllAsRead = async userId => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('recipient_id', userId)
      .eq('is_read', false)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取未读通知数量
export const getUnreadCount = async userId => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取通知统计
export const getNotificationStats = async userId => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('type, is_read')
      .eq('recipient_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    const stats = {
      total: data.length,
      unread: data.filter(n => !n.is_read).length,
      byType: {},
    };

    data.forEach(notification => {
      if (!stats.byType[notification.type]) {
        stats.byType[notification.type] = { total: 0, unread: 0 };
      }
      stats.byType[notification.type].total++;
      if (!notification.is_read) {
        stats.byType[notification.type].unread++;
      }
    });

    return { success: true, stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 删除用户所有通知
export const deleteAllNotifications = async userId => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('recipient_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 删除已读通知
export const deleteReadNotifications = async userId => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('recipient_id', userId)
      .eq('is_read', true);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 搜索通知
export const searchNotifications = async (userId, searchTerm, options = {}) => {
  try {
    const { page = 1, limit = 20, type } = options;

    let query = supabase
      .from('notifications')
      .select(
        `
        *,
        sender:users(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .eq('recipient_id', userId)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 创建系统通知
export const createSystemNotification = async (
  recipientId,
  notificationData
) => {
  try {
    const systemNotification = {
      recipient_id: recipientId,
      type: 'system',
      sender_id: null, // 系统通知没有发送者
      ...notificationData,
    };

    const { data, error } = await supabase
      .from('notifications')
      .insert(systemNotification)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 创建用户间通知
export const createUserNotification = async (
  recipientId,
  senderId,
  notificationData
) => {
  try {
    const userNotification = {
      recipient_id: recipientId,
      sender_id: senderId,
      ...notificationData,
    };

    const { data, error } = await supabase
      .from('notifications')
      .insert(userNotification)
      .select(
        `
        *,
        sender:users(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
