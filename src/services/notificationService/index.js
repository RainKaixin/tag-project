// notificationService/index.js - 通知服务主接口

import { localStorageAdapter } from './localStorage.js';
import { supabaseAdapter } from './supabase.js';

/**
 * 通知服务接口
 * 提供统一的通知数据访问，支持多数据源适配
 */
export const notificationService = {
  /**
   * 创建关注通知
   * @param {string} followerId - 关注者ID
   * @param {string} followerName - 关注者姓名
   * @param {string} followedId - 被关注者ID
   * @returns {Promise<Object>} 创建结果
   */
  createFollowNotification: async (followerId, followerName, followedId) => {
    try {
      const notification = {
        id: `follow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'follow',
        senderId: followerId,
        senderName: followerName,
        receiverId: followedId,
        title: 'New Follower',
        content: `${followerName} followed you`,
        message: `${followerName} followed you`,
        isRead: false,
        createdAt: new Date().toISOString(),
        meta: {
          action: 'follow',
          followerId,
          followerName,
        },
      };

      // 优先保存到 LocalStorage
      const result = await localStorageAdapter.createNotification(notification);
      if (result.success) {
        console.log(
          `[notificationService] Created follow notification in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.createNotification(
        notification
      );
      if (supabaseResult.success) {
        console.log(
          `[notificationService] Created follow notification in Supabase`
        );
        return supabaseResult;
      }

      console.warn(
        `[notificationService] Failed to create follow notification`
      );
      return { success: false, error: 'Failed to create follow notification' };
    } catch (error) {
      console.error(
        `[notificationService] Error creating follow notification:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 创建点赞通知
   * @param {string} likerId - 点赞者ID
   * @param {string} likerName - 点赞者姓名
   * @param {string} workId - 作品ID
   * @param {string} workTitle - 作品标题
   * @param {string} workAuthorId - 作品作者ID
   * @returns {Promise<Object>} 创建结果
   */
  createLikeNotification: async (
    likerId,
    likerName,
    workId,
    workTitle,
    workAuthorId
  ) => {
    try {
      const notification = {
        id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'like',
        senderId: likerId,
        senderName: likerName,
        receiverId: workAuthorId,
        title: 'Work Liked',
        content: `${likerName} liked your work "${workTitle}"`,
        message: `${likerName} liked your work "${workTitle}"`,
        isRead: false,
        createdAt: new Date().toISOString(),
        meta: {
          action: 'like',
          workId,
          workTitle,
          likerId,
          likerName,
        },
      };

      // 优先保存到 LocalStorage
      const result = await localStorageAdapter.createNotification(notification);
      if (result.success) {
        console.log(
          `[notificationService] Created like notification in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.createNotification(
        notification
      );
      if (supabaseResult.success) {
        console.log(
          `[notificationService] Created like notification in Supabase`
        );
        return supabaseResult;
      }

      console.warn(`[notificationService] Failed to create like notification`);
      return { success: false, error: 'Failed to create like notification' };
    } catch (error) {
      console.error(
        `[notificationService] Error creating like notification:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 创建评论通知
   * @param {string} commenterId - 评论者ID
   * @param {string} commenterName - 评论者姓名
   * @param {string} workId - 作品ID
   * @param {string} workTitle - 作品标题
   * @param {string} workAuthorId - 作品作者ID
   * @param {string} commentContent - 评论内容
   * @returns {Promise<Object>} 创建结果
   */
  createCommentNotification: async (
    commenterId,
    commenterName,
    workId,
    workTitle,
    workAuthorId,
    commentContent
  ) => {
    try {
      const notification = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'comment',
        senderId: commenterId,
        senderName: commenterName,
        receiverId: workAuthorId,
        title: 'New Comment',
        content: `${commenterName} commented on your work "${workTitle}"`,
        message: `${commenterName} commented on your work "${workTitle}": "${commentContent}"`,
        isRead: false,
        createdAt: new Date().toISOString(),
        meta: {
          action: 'comment',
          workId,
          workTitle,
          commenterId,
          commenterName,
          commentContent,
        },
      };

      // 优先保存到 LocalStorage
      const result = await localStorageAdapter.createNotification(notification);
      if (result.success) {
        console.log(
          `[notificationService] Created comment notification in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.createNotification(
        notification
      );
      if (supabaseResult.success) {
        console.log(
          `[notificationService] Created comment notification in Supabase`
        );
        return supabaseResult;
      }

      console.warn(
        `[notificationService] Failed to create comment notification`
      );
      return { success: false, error: 'Failed to create comment notification' };
    } catch (error) {
      console.error(
        `[notificationService] Error creating comment notification:`,
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
      // 优先级1: LocalStorage
      const localStorageNotifications =
        await localStorageAdapter.getUserNotifications(userId);
      if (localStorageNotifications && localStorageNotifications.success) {
        console.log(
          `[notificationService] Using LocalStorage notifications for user ${userId}`
        );
        return localStorageNotifications;
      }

      // 优先级2: Supabase
      const supabaseNotifications = await supabaseAdapter.getUserNotifications(
        userId
      );
      if (supabaseNotifications && supabaseNotifications.success) {
        console.log(
          `[notificationService] Using Supabase notifications for user ${userId}`
        );
        return supabaseNotifications;
      }

      console.log(
        `[notificationService] No notifications found for user ${userId}`
      );
      return { success: true, data: [] };
    } catch (error) {
      console.error(
        `[notificationService] Error getting notifications for user ${userId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 创建Collaboration申请通知
   * @param {string} applicantId - 申请者ID
   * @param {string} applicantName - 申请者姓名
   * @param {string} applicantAvatar - 申请者头像
   * @param {string} collaborationId - 协作项目ID
   * @param {string} collaborationTitle - 协作项目标题
   * @param {string} initiatorId - 项目发起者ID
   * @param {Object} applicationData - 申请数据
   * @returns {Promise<Object>} 创建结果
   */
  createCollaborationApplicationNotification: async (
    applicantId,
    applicantName,
    applicantAvatar,
    collaborationId,
    collaborationTitle,
    initiatorId,
    applicationData
  ) => {
    try {
      const notification = {
        id: `collaboration_application_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        type: 'collaboration',
        senderId: applicantId,
        senderName: applicantName,
        senderAvatar: applicantAvatar,
        receiverId: initiatorId,
        title: 'New Collaboration Application',
        content: `${applicantName} applied for your collaboration "${collaborationTitle}"`,
        message: `${applicantName} applied for your collaboration "${collaborationTitle}". Click to view the application details.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        meta: {
          action: 'collaboration_application',
          collaborationId,
          collaborationTitle,
          applicantId,
          applicantName,
          applicantAvatar,
          applicationData,
        },
      };

      // 优先保存到 LocalStorage
      const result = await localStorageAdapter.createNotification(notification);
      if (result.success) {
        console.log(
          `[notificationService] Created collaboration application notification in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.createNotification(
        notification
      );
      if (supabaseResult.success) {
        console.log(
          `[notificationService] Created collaboration application notification in Supabase`
        );
        return supabaseResult;
      }

      console.warn(
        `[notificationService] Failed to create collaboration application notification`
      );
      return {
        success: false,
        error: 'Failed to create collaboration application notification',
      };
    } catch (error) {
      console.error(
        `[notificationService] Error creating collaboration application notification:`,
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
      // 优先更新 LocalStorage
      const result = await localStorageAdapter.markAsRead(notificationId);
      if (result.success) {
        console.log(
          `[notificationService] Marked notification ${notificationId} as read in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.markAsRead(notificationId);
      if (supabaseResult.success) {
        console.log(
          `[notificationService] Marked notification ${notificationId} as read in Supabase`
        );
        return supabaseResult;
      }

      console.warn(
        `[notificationService] Failed to mark notification ${notificationId} as read`
      );
      return { success: false, error: 'Failed to mark notification as read' };
    } catch (error) {
      console.error(
        `[notificationService] Error marking notification as read:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 标记所有通知为已读
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 更新结果
   */
  markAllAsRead: async userId => {
    try {
      // 优先更新 LocalStorage
      const result = await localStorageAdapter.markAllAsRead(userId);
      if (result.success) {
        console.log(
          `[notificationService] Marked all notifications as read in LocalStorage for user ${userId}`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.markAllAsRead(userId);
      if (supabaseResult.success) {
        console.log(
          `[notificationService] Marked all notifications as read in Supabase for user ${userId}`
        );
        return supabaseResult;
      }

      console.warn(
        `[notificationService] Failed to mark all notifications as read for user ${userId}`
      );
      return {
        success: false,
        error: 'Failed to mark all notifications as read',
      };
    } catch (error) {
      console.error(
        `[notificationService] Error marking all notifications as read:`,
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
      // 优先删除 LocalStorage
      const result = await localStorageAdapter.deleteNotification(
        notificationId
      );
      if (result.success) {
        console.log(
          `[notificationService] Deleted notification ${notificationId} in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.deleteNotification(
        notificationId
      );
      if (supabaseResult.success) {
        console.log(
          `[notificationService] Deleted notification ${notificationId} in Supabase`
        );
        return supabaseResult;
      }

      console.warn(
        `[notificationService] Failed to delete notification ${notificationId}`
      );
      return { success: false, error: 'Failed to delete notification' };
    } catch (error) {
      console.error(
        `[notificationService] Error deleting notification:`,
        error
      );
      return { success: false, error: error.message };
    }
  },
};

export default notificationService;
