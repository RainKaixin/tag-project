// userService/index.js - 用户服务主接口

import { localStorageAdapter } from './localStorage.js';
import { mockUsersAdapter } from './mockUsers.js';
import { supabaseAdapter } from './supabase.js';

/**
 * 用户服务接口
 * 提供统一的用户数据访问，支持多数据源适配
 */
export const userService = {
  /**
   * 获取当前用户信息
   * @returns {Promise<Object>} 当前用户数据
   */
  getCurrentUser: async () => {
    try {
      // 优先级1: LocalStorage (MockAPI)
      const localStorageUser = await localStorageAdapter.getCurrentUser();
      if (localStorageUser) {
        console.log('[userService] Using LocalStorage user data');
        return localStorageUser;
      }

      // 优先级2: Supabase (预留)
      const supabaseUser = await supabaseAdapter.getCurrentUser();
      if (supabaseUser) {
        console.log('[userService] Using Supabase user data');
        return supabaseUser;
      }

      // 优先级3: MockUsers (fallback)
      console.log('[userService] Using MockUsers fallback');
      return await mockUsersAdapter.getCurrentUser();
    } catch (error) {
      console.error('[userService] Error getting current user:', error);
      return await mockUsersAdapter.getCurrentUser();
    }
  },

  /**
   * 根据用户ID获取用户信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 用户数据
   */
  getUserById: async userId => {
    try {
      // 优先级1: LocalStorage (MockAPI)
      const localStorageUser = await localStorageAdapter.getUserById(userId);
      if (localStorageUser) {
        console.log(`[userService] Using LocalStorage user data for ${userId}`);
        return localStorageUser;
      }

      // 优先级2: Supabase (预留)
      const supabaseUser = await supabaseAdapter.getUserById(userId);
      if (supabaseUser) {
        console.log(`[userService] Using Supabase user data for ${userId}`);
        return supabaseUser;
      }

      // 优先级3: MockUsers (fallback)
      console.log(`[userService] Using MockUsers fallback for ${userId}`);
      return await mockUsersAdapter.getUserById(userId);
    } catch (error) {
      console.error(`[userService] Error getting user ${userId}:`, error);
      return await mockUsersAdapter.getUserById(userId);
    }
  },

  /**
   * 更新用户信息
   * @param {string} userId - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 更新结果
   */
  updateUser: async (userId, userData) => {
    try {
      // 优先更新 LocalStorage
      const result = await localStorageAdapter.updateUser(userId, userData);
      if (result.success) {
        console.log(`[userService] Updated user ${userId} in LocalStorage`);
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.updateUser(userId, userData);
      if (supabaseResult.success) {
        console.log(`[userService] Updated user ${userId} in Supabase`);
        return supabaseResult;
      }

      console.warn(`[userService] Failed to update user ${userId}`);
      return { success: false, error: 'Failed to update user' };
    } catch (error) {
      console.error(`[userService] Error updating user ${userId}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 确保用户索引存在
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 索引结果
   */
  ensureUserIndexed: async userId => {
    try {
      // 检查用户是否已存在
      const existingUser = await userService.getUserById(userId);
      if (existingUser) {
        console.log(`[userService] User ${userId} already indexed`);
        return { success: true, data: existingUser };
      }

      // 从 MockUsers 获取基础数据并创建索引
      const baseUser = await mockUsersAdapter.getUserById(userId);
      if (baseUser) {
        const result = await localStorageAdapter.createUser(userId, baseUser);
        console.log(`[userService] Created user index for ${userId}`);
        return result;
      }

      console.warn(`[userService] No base data found for user ${userId}`);
      return { success: false, error: 'No base data found' };
    } catch (error) {
      console.error(
        `[userService] Error ensuring user indexed ${userId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取所有用户列表
   * @returns {Promise<Array>} 用户列表
   */
  getAllUsers: async () => {
    try {
      // 优先从 LocalStorage 获取
      const localStorageUsers = await localStorageAdapter.getAllUsers();
      if (localStorageUsers && localStorageUsers.length > 0) {
        console.log('[userService] Using LocalStorage users list');
        return localStorageUsers;
      }

      // 从 MockUsers 获取
      console.log('[userService] Using MockUsers users list');
      return await mockUsersAdapter.getAllUsers();
    } catch (error) {
      console.error('[userService] Error getting all users:', error);
      return await mockUsersAdapter.getAllUsers();
    }
  },
};

export default userService;
