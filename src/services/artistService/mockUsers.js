// artistService/mockUsers.js - MockUsers 适配器 (fallback)

import {
  MOCK_USERS,
  getAllUsers as getMockUsers,
} from '../../utils/mockUsers.js';

/**
 * MockUsers 艺术家数据适配器
 * 作为 fallback 数据源，提供静态艺术家数据
 * @deprecated 仅作为 fallback 使用，不参与主渲染
 */
export const mockUsersAdapter = {
  /**
   * 获取公开艺术家列表
   * @returns {Promise<Object>} 艺术家列表
   */
  getPublicArtists: async () => {
    try {
      const users = getMockUsers();

      // 转换 MockUsers 的用户格式为艺术家格式
      const artists = users.map(user => ({
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
        roleIcon: user.roleIcon,
        bio: user.bio,
        school: user.school,
        pronouns: user.pronouns,
        majors: user.majors,
        skills: user.skills,
        socialLinks: user.socialLinks,
        works: user.portfolio
          ? user.portfolio.map(work => ({
              id: work.id,
              title: work.title,
              thumbnailPath: work.thumb,
              category: work.category,
            }))
          : [],
        followers: 0,
        following: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      console.log(
        `[mockUsersAdapter] Retrieved ${artists.length} artists (fallback)`
      );
      return { success: true, data: artists };
    } catch (error) {
      console.error('[mockUsersAdapter] Error getting public artists:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取艺术家详情
   * @param {string} artistId - 艺术家ID
   * @returns {Promise<Object>} 艺术家详情
   */
  getArtistProfile: async artistId => {
    try {
      if (!artistId) {
        return { success: false, error: 'Missing artistId' };
      }

      // 兼容性匹配：支持多种ID格式
      let user = MOCK_USERS[artistId];

      // 如果直接匹配失败，尝试其他匹配方式
      if (!user) {
        // 1. 尝试小写匹配
        user = MOCK_USERS[artistId.toLowerCase()];

        // 2. 尝试通过displayName匹配
        if (!user) {
          const users = Object.values(MOCK_USERS);
          user = users.find(
            u =>
              u.displayName?.toLowerCase() === artistId.toLowerCase() ||
              u.name?.toLowerCase() === artistId.toLowerCase()
          );
        }

        // 3. 如果仍然找不到，使用默认用户
        if (!user) {
          console.warn(
            `[mockUsersAdapter] No artist found for ${artistId}, using alice as fallback`
          );
          user = MOCK_USERS.alice;
        }
      }

      // 转换 MockUsers 的用户格式为艺术家格式
      const artist = {
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
        roleIcon: user.roleIcon,
        bio: user.bio,
        school: user.school,
        pronouns: user.pronouns,
        majors: user.majors,
        skills: user.skills,
        socialLinks: user.socialLinks,
        works: user.portfolio
          ? user.portfolio.map(work => ({
              id: work.id,
              title: work.title,
              thumbnailPath: work.thumb,
              category: work.category,
            }))
          : [],
        followers: 0,
        following: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log(
        `[mockUsersAdapter] Retrieved artist profile for ${artistId} (fallback)`
      );
      return { success: true, data: artist };
    } catch (error) {
      console.error(
        `[mockUsersAdapter] Error getting artist profile ${artistId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 更新艺术家信息 (MockUsers 不支持更新)
   * @param {string} artistId - 艺术家ID
   * @param {Object} artistData - 艺术家数据
   * @returns {Promise<Object>} 更新结果
   */
  updateArtist: async (artistId, artistData) => {
    console.warn(
      `[mockUsersAdapter] Update not supported for artist ${artistId} (fallback)`
    );
    return { success: false, error: 'MockUsers does not support updates' };
  },

  /**
   * 创建艺术家 (MockUsers 不支持创建)
   * @param {string} artistId - 艺术家ID
   * @param {Object} artistData - 艺术家数据
   * @returns {Promise<Object>} 创建结果
   */
  createArtist: async (artistId, artistData) => {
    console.warn(
      `[mockUsersAdapter] Create not supported for artist ${artistId} (fallback)`
    );
    return { success: false, error: 'MockUsers does not support creation' };
  },

  /**
   * 删除艺术家 (MockUsers 不支持删除)
   * @param {string} artistId - 艺术家ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteArtist: async artistId => {
    console.warn(
      `[mockUsersAdapter] Delete not supported for artist ${artistId} (fallback)`
    );
    return { success: false, error: 'MockUsers does not support deletion' };
  },

  /**
   * 保存艺术家索引 (MockUsers 不支持保存)
   * @param {Array} artists - 艺术家数组
   * @returns {Promise<Object>} 保存结果
   */
  saveArtistIndex: async artists => {
    console.warn(`[mockUsersAdapter] Save index not supported (fallback)`);
    return { success: false, error: 'MockUsers does not support saving' };
  },
};
