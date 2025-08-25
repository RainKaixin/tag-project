// commentService/index.js - 评论服务主接口

import { localStorageAdapter } from './localStorage.js';
import { supabaseAdapter } from './supabase.js';

/**
 * 评论服务接口
 * 提供统一的评论数据访问，支持多数据源适配
 */
export const commentService = {
  /**
   * 创建评论
   * @param {string} workId - 作品ID
   * @param {string} authorId - 评论者ID
   * @param {string} authorName - 评论者姓名
   * @param {string} content - 评论内容
   * @param {string} parentCommentId - 父评论ID（用于回复）
   * @returns {Promise<Object>} 创建结果
   */
  createComment: async (
    workId,
    authorId,
    authorName,
    content,
    parentCommentId = null
  ) => {
    try {
      // 如果是回复，需要获取父评论信息
      let parentComment = null;
      if (parentCommentId) {
        // 获取父评论信息来确定rootId
        const allComments = await localStorageAdapter.getAllComments();
        parentComment = allComments.find(c => c.id === parentCommentId);
      }

      const comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workId,
        authorId,
        authorName,
        text: content, // 改为 text 字段
        parentId: parentCommentId, // 新增：父评论ID
        rootId: parentComment ? parentComment.rootId || parentComment.id : null, // 新增：根评论ID
        likes: 0,
        replies: [],
        isDeleted: false,
        createdAt: Date.now(), // 改为数字时间戳
        updatedAt: Date.now(),
      };

      // 添加调试日志
      if (parentCommentId) {
        console.log('[reply:optimistic]', comment);
      }

      // 优先保存到 LocalStorage
      const result = await localStorageAdapter.createComment(comment);
      if (result.success) {
        console.log(`[commentService] Created comment in LocalStorage`);

        // 添加调试日志
        if (parentCommentId) {
          console.log('[reply:saved]', result.data);
        }

        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.createComment(comment);
      if (supabaseResult.success) {
        console.log(`[commentService] Created comment in Supabase`);

        // 添加调试日志
        if (parentCommentId) {
          console.log('[reply:saved]', supabaseResult.data);
        }

        return supabaseResult;
      }

      console.warn(`[commentService] Failed to create comment`);
      return { success: false, error: 'Failed to create comment' };
    } catch (error) {
      console.error(`[commentService] Error creating comment:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取作品评论列表
   * @param {string} workId - 作品ID
   * @returns {Promise<Object>} 评论列表
   */
  getWorkComments: async workId => {
    try {
      // 优先级1: LocalStorage
      const localStorageComments = await localStorageAdapter.getWorkComments(
        workId
      );
      if (localStorageComments && localStorageComments.success) {
        console.log(
          `[commentService] Using LocalStorage comments for work ${workId}`
        );
        return localStorageComments;
      }

      // 优先级2: Supabase
      const supabaseComments = await supabaseAdapter.getWorkComments(workId);
      if (supabaseComments && supabaseComments.success) {
        console.log(
          `[commentService] Using Supabase comments for work ${workId}`
        );
        return supabaseComments;
      }

      console.log(`[commentService] No comments found for work ${workId}`);
      return { success: true, data: [] };
    } catch (error) {
      console.error(
        `[commentService] Error getting comments for work ${workId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 点赞评论
   * @param {string} commentId - 评论ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 点赞结果
   */
  likeComment: async (commentId, userId) => {
    try {
      // 优先更新 LocalStorage
      const result = await localStorageAdapter.likeComment(commentId, userId);
      if (result.success) {
        console.log(
          `[commentService] Liked comment ${commentId} in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.likeComment(
        commentId,
        userId
      );
      if (supabaseResult.success) {
        console.log(`[commentService] Liked comment ${commentId} in Supabase`);
        return supabaseResult;
      }

      console.warn(`[commentService] Failed to like comment ${commentId}`);
      return { success: false, error: 'Failed to like comment' };
    } catch (error) {
      console.error(`[commentService] Error liking comment:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 取消点赞评论
   * @param {string} commentId - 评论ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 取消点赞结果
   */
  unlikeComment: async (commentId, userId) => {
    try {
      // 优先更新 LocalStorage
      const result = await localStorageAdapter.unlikeComment(commentId, userId);
      if (result.success) {
        console.log(
          `[commentService] Unliked comment ${commentId} in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.unlikeComment(
        commentId,
        userId
      );
      if (supabaseResult.success) {
        console.log(
          `[commentService] Unliked comment ${commentId} in Supabase`
        );
        return supabaseResult;
      }

      console.warn(`[commentService] Failed to unlike comment ${commentId}`);
      return { success: false, error: 'Failed to unlike comment' };
    } catch (error) {
      console.error(`[commentService] Error unliking comment:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 删除评论
   * @param {string} commentId - 评论ID
   * @param {string} userId - 用户ID（验证权限）
   * @returns {Promise<Object>} 删除结果
   */
  deleteComment: async (commentId, userId) => {
    try {
      // 优先删除 LocalStorage
      const result = await localStorageAdapter.deleteComment(commentId, userId);
      if (result.success) {
        console.log(
          `[commentService] Deleted comment ${commentId} in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.deleteComment(
        commentId,
        userId
      );
      if (supabaseResult.success) {
        console.log(
          `[commentService] Deleted comment ${commentId} in Supabase`
        );
        return supabaseResult;
      }

      console.warn(`[commentService] Failed to delete comment ${commentId}`);
      return { success: false, error: 'Failed to delete comment' };
    } catch (error) {
      console.error(`[commentService] Error deleting comment:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 更新评论
   * @param {string} commentId - 评论ID
   * @param {string} userId - 用户ID（验证权限）
   * @param {string} content - 新的评论内容
   * @returns {Promise<Object>} 更新结果
   */
  updateComment: async (commentId, userId, content) => {
    try {
      // 优先更新 LocalStorage
      const result = await localStorageAdapter.updateComment(
        commentId,
        userId,
        content
      );
      if (result.success) {
        console.log(
          `[commentService] Updated comment ${commentId} in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.updateComment(
        commentId,
        userId,
        content
      );
      if (supabaseResult.success) {
        console.log(
          `[commentService] Updated comment ${commentId} in Supabase`
        );
        return supabaseResult;
      }

      console.warn(`[commentService] Failed to update comment ${commentId}`);
      return { success: false, error: 'Failed to update comment' };
    } catch (error) {
      console.error(`[commentService] Error updating comment:`, error);
      return { success: false, error: error.message };
    }
  },
};

export default commentService;
