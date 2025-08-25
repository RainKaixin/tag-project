// commentService/localStorage.js - LocalStorage 适配器

/**
 * LocalStorage 评论数据适配器
 * 在本地存储中管理评论数据
 */
export const localStorageAdapter = {
  /**
   * 创建评论
   * @param {Object} comment - 评论数据
   * @returns {Promise<Object>} 创建结果
   */
  createComment: async comment => {
    try {
      const key = `comments_${comment.workId}`;
      const existingComments = JSON.parse(localStorage.getItem(key) || '[]');

      // 确保评论数据包含所有必要字段
      const commentToSave = {
        ...comment,
        // 确保这些字段存在
        parentId: comment.parentId || null,
        rootId: comment.rootId || null,
        text: comment.text || comment.content || '',
        createdAt: comment.createdAt || Date.now(),
        updatedAt: comment.updatedAt || Date.now(),
      };

      // 添加新评论到列表开头
      existingComments.unshift(commentToSave);

      // 限制评论数量，保留最新的100条
      const limitedComments = existingComments.slice(0, 100);

      localStorage.setItem(key, JSON.stringify(limitedComments));

      console.log(
        `[localStorageAdapter] Created comment for work ${comment.workId}`
      );

      // 返回保存后的完整评论数据
      return { success: true, data: commentToSave };
    } catch (error) {
      console.error(`[localStorageAdapter] Error creating comment:`, error);
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
      const key = `comments_${workId}`;
      const comments = JSON.parse(localStorage.getItem(key) || '[]');

      // 过滤已删除的评论，并确保所有评论都有正确的字段
      const activeComments = comments
        .filter(comment => !comment.isDeleted)
        .map(comment => ({
          ...comment,
          // 确保这些字段存在，兼容旧数据
          parentId: comment.parentId || null,
          rootId: comment.rootId || null,
          text: comment.text || comment.content || '',
          createdAt:
            comment.createdAt ||
            (comment.createdAt
              ? new Date(comment.createdAt).getTime()
              : Date.now()),
          updatedAt:
            comment.updatedAt ||
            (comment.updatedAt
              ? new Date(comment.updatedAt).getTime()
              : Date.now()),
        }));

      console.log(
        `[localStorageAdapter] Retrieved ${activeComments.length} comments for work ${workId}`
      );
      return { success: true, data: activeComments };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error getting comments for work ${workId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取所有评论（用于确定rootId）
   * @returns {Array} 所有评论数组
   */
  getAllComments: async () => {
    try {
      const allComments = [];
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith('comments_')
      );

      for (const key of keys) {
        const comments = JSON.parse(localStorage.getItem(key) || '[]');
        allComments.push(...comments);
      }

      return allComments;
    } catch (error) {
      console.error('[localStorageAdapter] Error getting all comments:', error);
      return [];
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
      // 遍历所有作品的评论，找到对应的评论并点赞
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith('comments_')
      );

      for (const key of keys) {
        const comments = JSON.parse(localStorage.getItem(key) || '[]');
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex !== -1) {
          const comment = comments[commentIndex];

          // 初始化点赞用户列表
          if (!comment.likedBy) {
            comment.likedBy = [];
          }

          // 如果用户已经点赞，则取消点赞
          const userLikeIndex = comment.likedBy.indexOf(userId);
          if (userLikeIndex !== -1) {
            comment.likedBy.splice(userLikeIndex, 1);
            comment.likes = Math.max(0, comment.likes - 1);
          } else {
            // 如果用户未点赞，则添加点赞
            comment.likedBy.push(userId);
            comment.likes++;
          }

          comment.updatedAt = new Date().toISOString();
          localStorage.setItem(key, JSON.stringify(comments));

          console.log(
            `[localStorageAdapter] ${
              userLikeIndex !== -1 ? 'Unliked' : 'Liked'
            } comment ${commentId}`
          );
          return {
            success: true,
            data: comment,
            isLiked: userLikeIndex === -1,
          };
        }
      }

      console.warn(`[localStorageAdapter] Comment ${commentId} not found`);
      return { success: false, error: 'Comment not found' };
    } catch (error) {
      console.error(`[localStorageAdapter] Error liking comment:`, error);
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
      // 遍历所有作品的评论，找到对应的评论并取消点赞
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith('comments_')
      );

      for (const key of keys) {
        const comments = JSON.parse(localStorage.getItem(key) || '[]');
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex !== -1) {
          const comment = comments[commentIndex];

          // 初始化点赞用户列表
          if (!comment.likedBy) {
            comment.likedBy = [];
          }

          // 移除用户点赞
          const userLikeIndex = comment.likedBy.indexOf(userId);
          if (userLikeIndex !== -1) {
            comment.likedBy.splice(userLikeIndex, 1);
            comment.likes = Math.max(0, comment.likes - 1);
            comment.updatedAt = new Date().toISOString();
            localStorage.setItem(key, JSON.stringify(comments));

            console.log(`[localStorageAdapter] Unliked comment ${commentId}`);
            return {
              success: true,
              data: comment,
              isLiked: false,
            };
          }
        }
      }

      console.warn(
        `[localStorageAdapter] Comment ${commentId} not found or not liked`
      );
      return { success: false, error: 'Comment not found or not liked' };
    } catch (error) {
      console.error(`[localStorageAdapter] Error unliking comment:`, error);
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
      // 遍历所有作品的评论，找到对应的评论并删除
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith('comments_')
      );

      for (const key of keys) {
        const comments = JSON.parse(localStorage.getItem(key) || '[]');
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex !== -1) {
          const comment = comments[commentIndex];

          // 验证权限：只有评论作者或作品作者可以删除评论
          if (comment.authorId !== userId) {
            console.warn(
              `[localStorageAdapter] User ${userId} not authorized to delete comment ${commentId}`
            );
            return {
              success: false,
              error: 'Not authorized to delete comment',
            };
          }

          // 软删除：标记为已删除
          comment.isDeleted = true;
          comment.updatedAt = new Date().toISOString();
          localStorage.setItem(key, JSON.stringify(comments));

          console.log(`[localStorageAdapter] Deleted comment ${commentId}`);
          return { success: true };
        }
      }

      console.warn(`[localStorageAdapter] Comment ${commentId} not found`);
      return { success: false, error: 'Comment not found' };
    } catch (error) {
      console.error(`[localStorageAdapter] Error deleting comment:`, error);
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
      // 遍历所有作品的评论，找到对应的评论并更新
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith('comments_')
      );

      for (const key of keys) {
        const comments = JSON.parse(localStorage.getItem(key) || '[]');
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex !== -1) {
          const comment = comments[commentIndex];

          // 验证权限：只有评论作者可以更新评论
          if (comment.authorId !== userId) {
            console.warn(
              `[localStorageAdapter] User ${userId} not authorized to update comment ${commentId}`
            );
            return {
              success: false,
              error: 'Not authorized to update comment',
            };
          }

          // 更新评论内容
          comment.content = content;
          comment.updatedAt = new Date().toISOString();
          localStorage.setItem(key, JSON.stringify(comments));

          console.log(`[localStorageAdapter] Updated comment ${commentId}`);
          return { success: true, data: comment };
        }
      }

      console.warn(`[localStorageAdapter] Comment ${commentId} not found`);
      return { success: false, error: 'Comment not found' };
    } catch (error) {
      console.error(`[localStorageAdapter] Error updating comment:`, error);
      return { success: false, error: error.message };
    }
  },
};
