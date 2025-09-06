// workService/localStorage.js - LocalStorage 适配器

import { getUserInfo } from '../../utils/mockUsers.js';
import {
  getMyPortfolio,
  getPublicPortfolio,
  getAllPublicPortfolios,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../supabase/portfolio.js';

/**
 * LocalStorage 作品数据适配器
 * 复用现有的 portfolio 服务，提供作品数据管理
 */
export const localStorageAdapter = {
  /**
   * 获取用户作品列表
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 作品列表
   */
  getUserWorks: async userId => {
    try {
      if (!userId) {
        return { success: false, error: 'Missing userId' };
      }

      // 复用现有的 getPublicPortfolio 函数
      const result = await getPublicPortfolio(userId);
      console.log(`[localStorageAdapter] Retrieved works for user ${userId}`);
      return result;
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error getting works for user ${userId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取作品详情
   * @param {string} workId - 作品ID
   * @param {string} userId - 用户ID (可选)
   * @returns {Promise<Object>} 作品详情
   */
  getWorkById: async (workId, userId = null) => {
    try {
      if (!workId) {
        return { success: false, error: 'Missing workId' };
      }

      // 如果没有提供 userId，需要从所有作品中查找
      if (!userId) {
        const allWorks = await getAllPublicPortfolios();
        if (allWorks.success) {
          const work = allWorks.data.find(w => w.id === workId);
          if (work) {
            // 统一数据格式，添加author字段
            const workWithAuthor = {
              ...work,
              author: {
                id: work.profiles?.id || work.userId || 'unknown',
                name: work.profiles?.full_name || 'Unknown Artist',
                role: work.profiles?.role || work.category || '',
                avatar: work.profiles?.avatar_url || '',
              },
            };
            console.log(`[localStorageAdapter] Found work ${workId}`);
            return { success: true, data: workWithAuthor };
          }
        }
      } else {
        // 从指定用户的作品中查找
        const userWorks = await getPublicPortfolio(userId);
        if (userWorks.success) {
          const work = userWorks.data.find(w => w.id === workId);
          if (work) {
            // 统一数据格式，添加author字段
            const workWithAuthor = {
              ...work,
              author: {
                id: userId,
                name: getUserInfo(userId)?.name || 'Unknown Artist',
                role: work.category || '',
                avatar: getUserInfo(userId)?.avatar || null, // 移除默认头像
              },
            };
            console.log(
              `[localStorageAdapter] Found work ${workId} for user ${userId}`
            );
            return { success: true, data: workWithAuthor };
          }
        }
      }

      console.log(`[localStorageAdapter] Work ${workId} not found`);
      return { success: false, error: 'Work not found' };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error getting work ${workId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 创建作品
   * @param {Object} workData - 作品数据
   * @returns {Promise<Object>} 创建结果
   */
  createWork: async workData => {
    try {
      if (!workData) {
        return { success: false, error: 'Missing workData' };
      }

      // 复用现有的 createPortfolioItem 函数
      const result = await createPortfolioItem(workData);
      console.log(`[localStorageAdapter] Created work`);
      return result;
    } catch (error) {
      console.error(`[localStorageAdapter] Error creating work:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 更新作品
   * @param {string} workId - 作品ID
   * @param {Object} workData - 作品数据
   * @returns {Promise<Object>} 更新结果
   */
  updateWork: async (workId, workData) => {
    try {
      if (!workId || !workData) {
        return { success: false, error: 'Missing workId or workData' };
      }

      // 复用现有的 updatePortfolioItem 函数
      const result = await updatePortfolioItem(workId, workData);
      console.log(`[localStorageAdapter] Updated work ${workId}`);
      return result;
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error updating work ${workId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 删除作品
   * @param {string} workId - 作品ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteWork: async workId => {
    try {
      if (!workId) {
        return { success: false, error: 'Missing workId' };
      }

      // 复用现有的 deletePortfolioItem 函数
      const result = await deletePortfolioItem(workId);
      console.log(`[localStorageAdapter] Deleted work ${workId}`);
      return result;
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error deleting work ${workId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取所有公开作品
   * @returns {Promise<Object>} 所有公开作品
   */
  getAllPublicWorks: async () => {
    try {
      // 复用现有的 getAllPublicPortfolios 函数
      const result = await getAllPublicPortfolios();

      if (result.success && result.data) {
        // 统一数据格式，为每个作品添加author字段
        const worksWithAuthor = result.data.map(work => ({
          ...work,
          author: {
            id: work.profiles?.id || work.userId || 'unknown',
            name: work.profiles?.full_name || 'Unknown Artist',
            role: work.category || '',
            avatar: work.profiles?.avatar_url || '',
          },
        }));

        console.log(
          '[localStorageAdapter] Retrieved all public works with unified author format'
        );
        return { success: true, data: worksWithAuthor };
      }

      return result;
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error getting all public works:`,
        error
      );
      return { success: false, error: error.message };
    }
  },
};
