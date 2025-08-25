// userService/localStorage.js - 统一存储适配器

import { storage } from 'src/services/storage/index';

import { getCachedAvatar, cacheAvatar } from '../../utils/avatarCache.js';
import { getCurrentUserId } from '../../utils/currentUser.js';

/**
 * LocalStorage 用户数据适配器
 * 管理用户数据在本地存储中的读写操作
 */
export const localStorageAdapter = {
  /**
   * 获取当前用户信息
   * @returns {Promise<Object|null>} 当前用户数据
   */
  getCurrentUser: async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.warn('[localStorageAdapter] No current user ID found');
        return null;
      }

      // 从存储获取用户数据
      const userData = await storage.getItem(`user_${userId}`);
      if (!userData) {
        console.log(`[localStorageAdapter] No user data found for ${userId}`);
        return null;
      }

      const user = JSON.parse(userData);

      // 优先使用缓存的头像
      const cachedAvatar = getCachedAvatar(userId);
      if (cachedAvatar) {
        user.avatar = cachedAvatar;
      }

      // 如果有上传的头像，覆盖静态数据
      const avatarData = await storage.getItem(`tag.avatars.${userId}`);
      if (avatarData) {
        try {
          const parsedData = JSON.parse(avatarData);
          if (parsedData && parsedData.avatarUrl) {
            cacheAvatar(userId, parsedData.avatarUrl);
            user.avatar = parsedData.avatarUrl;
          }
        } catch (error) {
          console.warn(
            '[localStorageAdapter] Failed to parse avatar data:',
            error
          );
        }
      }

      console.log(`[localStorageAdapter] Retrieved user data for ${userId}`);
      return user;
    } catch (error) {
      console.error('[localStorageAdapter] Error getting current user:', error);
      return null;
    }
  },

  /**
   * 根据用户ID获取用户信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Object|null>} 用户数据
   */
  getUserById: async userId => {
    try {
      if (!userId) {
        console.warn('[localStorageAdapter] No user ID provided');
        return null;
      }

      // 从存储获取用户数据
      const userData = await storage.getItem(`user_${userId}`);
      if (!userData) {
        console.log(`[localStorageAdapter] No user data found for ${userId}`);
        return null;
      }

      const user = JSON.parse(userData);

      // 处理头像
      const cachedAvatar = getCachedAvatar(userId);
      if (cachedAvatar) {
        user.avatar = cachedAvatar;
      }

      const avatarData = await storage.getItem(`tag.avatars.${userId}`);
      if (avatarData) {
        try {
          const parsedData = JSON.parse(avatarData);
          if (parsedData && parsedData.avatarUrl) {
            cacheAvatar(userId, parsedData.avatarUrl);
            user.avatar = parsedData.avatarUrl;
          }
        } catch (error) {
          console.warn(
            '[localStorageAdapter] Failed to parse avatar data:',
            error
          );
        }
      }

      console.log(`[localStorageAdapter] Retrieved user data for ${userId}`);
      return user;
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error getting user ${userId}:`,
        error
      );
      return null;
    }
  },

  /**
   * 创建用户
   * @param {string} userId - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 创建结果
   */
  createUser: async (userId, userData) => {
    try {
      if (!userId || !userData) {
        return { success: false, error: 'Missing userId or userData' };
      }

      // 检查用户是否已存在
      const existingUser = await localStorageAdapter.getUserById(userId);
      if (existingUser) {
        console.log(`[localStorageAdapter] User ${userId} already exists`);
        return { success: true, data: existingUser };
      }

      // 创建用户记录
      const newUser = {
        id: userId,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await storage.setItem(`user_${userId}`, JSON.stringify(newUser));
      console.log(`[localStorageAdapter] Created user ${userId}`);

      return { success: true, data: newUser };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error creating user ${userId}:`,
        error
      );
      return { success: false, error: error.message };
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
      if (!userId || !userData) {
        return { success: false, error: 'Missing userId or userData' };
      }

      // 获取现有用户数据
      const existingUser = await localStorageAdapter.getUserById(userId);
      if (!existingUser) {
        console.warn(
          `[localStorageAdapter] User ${userId} not found for update`
        );
        return { success: false, error: 'User not found' };
      }

      // 合并数据
      const updatedUser = {
        ...existingUser,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      await storage.setItem(`user_${userId}`, JSON.stringify(updatedUser));
      console.log(`[localStorageAdapter] Updated user ${userId}`);

      return { success: true, data: updatedUser };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error updating user ${userId}:`,
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
      const users = [];

      // 获取所有存储键
      const keys = await storage.keys();

      // 遍历所有用户数据
      for (const key of keys) {
        if (key && key.startsWith('user_')) {
          try {
            const userData = await storage.getItem(key);
            if (userData) {
              const user = JSON.parse(userData);
              users.push(user);
            }
          } catch (error) {
            console.warn(
              `[localStorageAdapter] Failed to parse user data for key ${key}:`,
              error
            );
          }
        }
      }

      console.log(`[localStorageAdapter] Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      console.error('[localStorageAdapter] Error getting all users:', error);
      return [];
    }
  },

  /**
   * 删除用户
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteUser: async userId => {
    try {
      if (!userId) {
        return { success: false, error: 'Missing userId' };
      }

      await storage.removeItem(`user_${userId}`);
      await storage.removeItem(`tag.avatars.${userId}`);

      console.log(`[localStorageAdapter] Deleted user ${userId}`);
      return { success: true };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error deleting user ${userId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },
};
