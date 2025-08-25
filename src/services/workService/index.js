// workService/index.js - 作品服务主接口

import { localStorageAdapter } from './localStorage.js';
import { mockUsersAdapter } from './mockUsers.js';
import { supabaseAdapter } from './supabase.js';

/**
 * 作品服务接口
 * 提供统一的作品数据访问，支持多数据源适配
 */
export const workService = {
  /**
   * 获取用户作品列表
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 作品列表
   */
  getUserWorks: async userId => {
    try {
      // 优先级1: LocalStorage (MockAPI)
      const localStorageWorks = await localStorageAdapter.getUserWorks(userId);
      if (
        localStorageWorks &&
        localStorageWorks.data &&
        localStorageWorks.data.length > 0
      ) {
        console.log(
          `[workService] Using LocalStorage works for user ${userId}`
        );
        return localStorageWorks;
      }

      // 优先级2: Supabase (预留)
      const supabaseWorks = await supabaseAdapter.getUserWorks(userId);
      if (
        supabaseWorks &&
        supabaseWorks.data &&
        supabaseWorks.data.length > 0
      ) {
        console.log(`[workService] Using Supabase works for user ${userId}`);
        return supabaseWorks;
      }

      // 优先级3: MockUsers (fallback)
      console.log(`[workService] Using MockUsers fallback for user ${userId}`);
      return await mockUsersAdapter.getUserWorks(userId);
    } catch (error) {
      console.error(
        `[workService] Error getting works for user ${userId}:`,
        error
      );
      return await mockUsersAdapter.getUserWorks(userId);
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
      // 优先级1: LocalStorage (MockAPI)
      const localStorageWork = await localStorageAdapter.getWorkById(
        workId,
        userId
      );
      if (localStorageWork && localStorageWork.data) {
        console.log(`[workService] Using LocalStorage work data for ${workId}`);
        return localStorageWork;
      }

      // 优先级2: Supabase (预留)
      const supabaseWork = await supabaseAdapter.getWorkById(workId, userId);
      if (supabaseWork && supabaseWork.data) {
        console.log(`[workService] Using Supabase work data for ${workId}`);
        return supabaseWork;
      }

      // 优先级3: MockUsers (fallback)
      console.log(`[workService] Using MockUsers fallback for work ${workId}`);
      return await mockUsersAdapter.getWorkById(workId, userId);
    } catch (error) {
      console.error(`[workService] Error getting work ${workId}:`, error);
      return await mockUsersAdapter.getWorkById(workId, userId);
    }
  },

  /**
   * 创建作品
   * @param {Object} workData - 作品数据
   * @returns {Promise<Object>} 创建结果
   */
  createWork: async workData => {
    try {
      // 优先保存到 LocalStorage
      const result = await localStorageAdapter.createWork(workData);
      if (result.success) {
        console.log(`[workService] Created work in LocalStorage`);
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.createWork(workData);
      if (supabaseResult.success) {
        console.log(`[workService] Created work in Supabase`);
        return supabaseResult;
      }

      console.warn(`[workService] Failed to create work`);
      return { success: false, error: 'Failed to create work' };
    } catch (error) {
      console.error(`[workService] Error creating work:`, error);
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
      // 优先更新 LocalStorage
      const result = await localStorageAdapter.updateWork(workId, workData);
      if (result.success) {
        console.log(`[workService] Updated work ${workId} in LocalStorage`);
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.updateWork(workId, workData);
      if (supabaseResult.success) {
        console.log(`[workService] Updated work ${workId} in Supabase`);
        return supabaseResult;
      }

      console.warn(`[workService] Failed to update work ${workId}`);
      return { success: false, error: 'Failed to update work' };
    } catch (error) {
      console.error(`[workService] Error updating work ${workId}:`, error);
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
      // 优先删除 LocalStorage
      const result = await localStorageAdapter.deleteWork(workId);
      if (result.success) {
        console.log(`[workService] Deleted work ${workId} from LocalStorage`);
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.deleteWork(workId);
      if (supabaseResult.success) {
        console.log(`[workService] Deleted work ${workId} from Supabase`);
        return supabaseResult;
      }

      console.warn(`[workService] Failed to delete work ${workId}`);
      return { success: false, error: 'Failed to delete work' };
    } catch (error) {
      console.error(`[workService] Error deleting work ${workId}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取所有公开作品
   * @returns {Promise<Object>} 所有公开作品
   */
  getAllPublicWorks: async () => {
    try {
      // 优先级1: LocalStorage (MockAPI)
      const localStorageWorks = await localStorageAdapter.getAllPublicWorks();
      if (
        localStorageWorks &&
        localStorageWorks.data &&
        localStorageWorks.data.length > 0
      ) {
        console.log(`[workService] Using LocalStorage public works`);
        return localStorageWorks;
      }

      // 优先级2: Supabase (预留)
      const supabaseWorks = await supabaseAdapter.getAllPublicWorks();
      if (
        supabaseWorks &&
        supabaseWorks.data &&
        supabaseWorks.data.length > 0
      ) {
        console.log(`[workService] Using Supabase public works`);
        return supabaseWorks;
      }

      // 优先级3: MockUsers (fallback)
      console.log(`[workService] Using MockUsers fallback for public works`);
      return await mockUsersAdapter.getAllPublicWorks();
    } catch (error) {
      console.error(`[workService] Error getting all public works:`, error);
      return await mockUsersAdapter.getAllPublicWorks();
    }
  },
};

export default workService;
