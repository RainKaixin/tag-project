// workService/mockUsers.js - MockUsers 适配器 (fallback)

import { MOCK_USERS } from '../../utils/mockUsers.js';

/**
 * MockUsers 作品数据适配器
 * 作为 fallback 数据源，提供静态作品数据
 * @deprecated 仅作为 fallback 使用，不参与主渲染
 */
export const mockUsersAdapter = {
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

      const user = MOCK_USERS[userId];
      if (!user || !user.portfolio) {
        console.log(`[mockUsersAdapter] No portfolio found for user ${userId}`);
        return { success: true, data: [] };
      }

      // 转换 MockUsers 的作品格式为统一格式
      const works = user.portfolio.map(work => ({
        id: work.id,
        title: work.title,
        description: '',
        category: work.category,
        tags: work.tags,
        imagePaths: [work.thumb],
        thumbnailPath: work.thumb,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: userId,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        },
      }));

      console.log(
        `[mockUsersAdapter] Retrieved ${works.length} works for user ${userId} (fallback)`
      );
      return { success: true, data: works };
    } catch (error) {
      console.error(
        `[mockUsersAdapter] Error getting works for user ${userId}:`,
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

      // 如果没有提供 userId，需要从所有用户中查找
      if (!userId) {
        for (const [uid, user] of Object.entries(MOCK_USERS)) {
          if (user.portfolio) {
            const work = user.portfolio.find(w => w.id === workId);
            if (work) {
              const workData = {
                id: work.id,
                title: work.title,
                description: '',
                category: work.category,
                tags: work.tags,
                imagePaths: [work.thumb],
                thumbnailPath: work.thumb,
                isPublic: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: {
                  id: uid,
                  name: user.name,
                  avatar: user.avatar,
                  role: user.role,
                },
              };
              console.log(
                `[mockUsersAdapter] Found work ${workId} for user ${uid} (fallback)`
              );
              return { success: true, data: workData };
            }
          }
        }
      } else {
        // 从指定用户的作品中查找
        const user = MOCK_USERS[userId];
        if (user && user.portfolio) {
          const work = user.portfolio.find(w => w.id === workId);
          if (work) {
            const workData = {
              id: work.id,
              title: work.title,
              description: '',
              category: work.category,
              tags: work.tags,
              imagePaths: [work.thumb],
              thumbnailPath: work.thumb,
              isPublic: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              author: {
                id: userId,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
              },
            };
            console.log(
              `[mockUsersAdapter] Found work ${workId} for user ${userId} (fallback)`
            );
            return { success: true, data: workData };
          }
        }
      }

      console.log(`[mockUsersAdapter] Work ${workId} not found (fallback)`);
      return { success: false, error: 'Work not found' };
    } catch (error) {
      console.error(`[mockUsersAdapter] Error getting work ${workId}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取所有公开作品
   * @returns {Promise<Object>} 所有公开作品
   */
  getAllPublicWorks: async () => {
    try {
      const allWorks = [];

      // 遍历所有用户的作品
      for (const [userId, user] of Object.entries(MOCK_USERS)) {
        if (user.portfolio) {
          const works = user.portfolio.map(work => ({
            id: work.id,
            title: work.title,
            description: '',
            category: work.category,
            tags: work.tags,
            imagePaths: [work.thumb],
            thumbnailPath: work.thumb,
            isPublic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
              id: userId,
              name: user.name,
              avatar: user.avatar,
              role: user.role,
            },
          }));
          allWorks.push(...works);
        }
      }

      console.log(
        `[mockUsersAdapter] Retrieved ${allWorks.length} public works (fallback)`
      );
      return { success: true, data: allWorks };
    } catch (error) {
      console.error(
        `[mockUsersAdapter] Error getting all public works:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 创建作品 (MockUsers 不支持创建)
   * @param {Object} workData - 作品数据
   * @returns {Promise<Object>} 创建结果
   */
  createWork: async workData => {
    console.warn(`[mockUsersAdapter] Create not supported (fallback)`);
    return { success: false, error: 'MockUsers does not support creation' };
  },

  /**
   * 更新作品 (MockUsers 不支持更新)
   * @param {string} workId - 作品ID
   * @param {Object} workData - 作品数据
   * @returns {Promise<Object>} 更新结果
   */
  updateWork: async (workId, workData) => {
    console.warn(
      `[mockUsersAdapter] Update not supported for work ${workId} (fallback)`
    );
    return { success: false, error: 'MockUsers does not support updates' };
  },

  /**
   * 删除作品 (MockUsers 不支持删除)
   * @param {string} workId - 作品ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteWork: async workId => {
    console.warn(
      `[mockUsersAdapter] Delete not supported for work ${workId} (fallback)`
    );
    return { success: false, error: 'MockUsers does not support deletion' };
  },
};
