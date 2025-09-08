// userService/mockUsers.js - MockUsers 适配器 (fallback)

import { getCurrentUserId } from '../../utils/currentUser.js';
import {
  getUserInfo,
  MOCK_USERS,
  getAllUsers as getMockUsers,
} from '../../utils/mockUsers.js';

/**
 * MockUsers 适配器
 * 作为 fallback 数据源，提供静态用户数据
 * @deprecated 仅作为 fallback 使用，不参与主渲染
 */
export const mockUsersAdapter = {
  /**
   * 获取当前用户信息
   * @returns {Promise<Object>} 当前用户数据
   */
  getCurrentUser: async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.warn('[mockUsersAdapter] No current user ID found');
        return null;
      }

      const user = getUserInfo(userId);
      console.log(
        `[mockUsersAdapter] Retrieved current user ${userId} (fallback)`
      );
      return user;
    } catch (error) {
      console.error('[mockUsersAdapter] Error getting current user:', error);
      return null;
    }
  },

  /**
   * 根据用户ID获取用户信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 用户数据
   */
  getUserById: async userId => {
    try {
      if (!userId) {
        console.warn('[mockUsersAdapter] No user ID provided');
        return null;
      }

      const user = getUserInfo(userId);
      console.log(`[mockUsersAdapter] Retrieved user ${userId} (fallback)`);
      return user;
    } catch (error) {
      console.error(`[mockUsersAdapter] Error getting user ${userId}:`, error);
      return null;
    }
  },

  /**
   * 获取所有用户列表
   * @returns {Promise<Array>} 用户列表
   */
  getAllUsers: async () => {
    try {
      const users = getMockUsers();
      console.log(
        `[mockUsersAdapter] Retrieved ${users.length} users (fallback)`
      );
      return users;
    } catch (error) {
      console.error('[mockUsersAdapter] Error getting all users:', error);
      return [];
    }
  },

  /**
   * 更新用户信息 (MockUsers 不支持更新)
   * @param {string} userId - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 更新结果
   */
  updateUser: async (userId, userData) => {
    console.warn(
      `[mockUsersAdapter] Update not supported for user ${userId} (fallback)`
    );
    return { success: false, error: 'MockUsers does not support updates' };
  },

  /**
   * 创建用户 (MockUsers 不支持创建)
   * @param {string} userId - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 创建结果
   */
  createUser: async (userId, userData) => {
    console.warn(
      `[mockUsersAdapter] Create not supported for user ${userId} (fallback)`
    );
    return { success: false, error: 'MockUsers does not support creation' };
  },

  /**
   * 删除用户 (MockUsers 不支持删除)
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteUser: async userId => {
    console.warn(
      `[mockUsersAdapter] Delete not supported for user ${userId} (fallback)`
    );
    return { success: false, error: 'MockUsers does not support deletion' };
  },

  /**
   * 获取 MockUsers 原始数据 (用于迁移)
   * @returns {Object} MockUsers 原始数据
   */
  getMockUsersData: () => {
    return MOCK_USERS;
  },
};
