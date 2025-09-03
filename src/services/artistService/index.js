// artistService/index.js - 艺术家服务主接口

import { workService } from '../workService/index.js';

import { localStorageAdapter } from './localStorage.js';
import { mockUsersAdapter } from './mockUsers.js';
import { supabaseAdapter } from './supabase.js';

/**
 * 艺术家服务接口
 * 提供统一的艺术家数据访问，支持多数据源适配
 */
export const artistService = {
  /**
   * 获取公开艺术家列表
   * @returns {Promise<Object>} 艺术家列表
   */
  getPublicArtists: async () => {
    try {
      console.log('[artistService] Getting all registered artists');

      // 从用户档案服务获取所有注册用户
      const { getProfile } = await import('../mock/userProfileService.js');
      const { storage } = await import('../storage/index.js');

      // 获取所有存储键
      const keys = await storage.keys();

      // 筛选出用户档案相关的键
      const profileKeys = keys.filter(
        key => key && key.startsWith('tag.userProfile.')
      );

      const artists = [];

      // 遍历所有用户档案
      for (const key of profileKeys) {
        try {
          const userId = key.replace('tag.userProfile.', '');

          // 获取用户档案数据
          const profileResult = await getProfile(userId);
          if (!profileResult.success || !profileResult.data) {
            console.warn(`[artistService] Failed to get profile for ${userId}`);
            continue;
          }

          const profile = profileResult.data;

          // 跳过没有姓名的用户（未完成注册）
          if (!profile.fullName || !profile.fullName.trim()) {
            console.log(
              `[artistService] Skipping user ${userId} - no fullName`
            );
            continue;
          }

          // 获取用户的作品数据
          const portfolioKey = `portfolio_${userId}`;
          const portfolioData = await storage.getItem(portfolioKey);
          let worksCount = 0;

          if (portfolioData) {
            try {
              const portfolio = JSON.parse(portfolioData);
              if (Array.isArray(portfolio)) {
                // 只计算公开的作品
                worksCount = portfolio.filter(
                  item => item.isPublic !== false
                ).length;
              }
            } catch (parseError) {
              console.warn(
                `[artistService] Failed to parse portfolio for ${userId}:`,
                parseError
              );
            }
          }

          // 获取关注统计数据
          const { getFollowersCount, getFollowingList } = await import(
            '../mock/followService.js'
          );

          let followersCount = 0;
          let followingCount = 0;

          try {
            const followersResult = await getFollowersCount(userId);
            if (followersResult.success) {
              followersCount = followersResult.data.followersCount;
            }

            const followingResult = await getFollowingList(userId);
            if (followingResult.success) {
              followingCount = followingResult.data.followingCount;
            }
          } catch (followError) {
            console.warn(
              `[artistService] Failed to get follow stats for ${userId}:`,
              followError
            );
          }

          // 构建艺术家数据
          const artist = {
            id: userId,
            name: profile.fullName,
            title: profile.title || 'Artist',
            school: profile.school || '',
            majors: profile.majors || [],
            minors: profile.minors || [],
            avatar: profile.avatar || null,
            worksCount: worksCount,
            followers: followersCount,
            following: followingCount,
            createdAt: profile.updatedAt || new Date().toISOString(),
            updatedAt: profile.updatedAt || new Date().toISOString(),
          };

          artists.push(artist);
        } catch (error) {
          console.warn(
            `[artistService] Error processing user profile ${key}:`,
            error
          );
        }
      }

      // 按注册时间排序（最新的在前）
      artists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      console.log(`[artistService] Found ${artists.length} registered artists`);

      return {
        success: true,
        data: artists,
      };
    } catch (error) {
      console.error('[artistService] Error getting public artists:', error);

      // 如果出错，返回错误信息（不再回退到MockUsers）
      console.error(
        '[artistService] Error getting public artists, not falling back to MockUsers'
      );
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 获取艺术家详情
   * @param {string} artistId - 艺术家ID
   * @returns {Promise<Object>} 艺术家详情
   */
  getArtistProfile: async artistId => {
    try {
      // 优先级1: LocalStorage (MockAPI)
      const localStorageArtist = await localStorageAdapter.getArtistProfile(
        artistId
      );
      if (localStorageArtist && localStorageArtist.data) {
        console.log(
          `[artistService] Using LocalStorage artist profile for ${artistId}`
        );
        return localStorageArtist;
      }

      // 优先级2: Supabase (预留)
      const supabaseArtist = await supabaseAdapter.getArtistProfile(artistId);
      if (supabaseArtist && supabaseArtist.data) {
        console.log(
          `[artistService] Using Supabase artist profile for ${artistId}`
        );
        return supabaseArtist;
      }

      // 不再使用 MockUsers 作为回退
      console.log(
        `[artistService] No artist profile found for ${artistId}, returning null`
      );
      return {
        success: false,
        error: 'Artist profile not found',
      };
    } catch (error) {
      console.error(
        `[artistService] Error getting artist profile ${artistId}:`,
        error
      );
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 从作品数据引导艺术家索引
   * @returns {Promise<Object>} 引导结果
   */
  bootstrapFromPortfolios: async () => {
    try {
      console.log(`[artistService] Starting bootstrap from portfolios`);

      // 获取所有公开作品
      const allWorks = await workService.getAllPublicWorks();
      if (!allWorks.success) {
        console.warn(`[artistService] Failed to get all works for bootstrap`);
        return { success: false, error: 'Failed to get works' };
      }

      const artists = new Map();

      // 从作品中提取艺术家信息
      for (const work of allWorks.data) {
        if (work.author && work.author.id) {
          const artistId = work.author.id;

          if (!artists.has(artistId)) {
            // 创建艺术家记录
            const artistData = {
              id: artistId,
              name: work.author.name || 'Unknown Artist',
              avatar: work.author.avatar || '',
              role: work.author.role || 'Artist',
              bio: '',
              school: '',
              pronouns: '',
              majors: [],
              skills: [],
              socialLinks: {},
              works: [],
              followers: 0,
              following: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            artists.set(artistId, artistData);
          }

          // 添加作品到艺术家的作品列表
          const artist = artists.get(artistId);
          if (!artist.works.find(w => w.id === work.id)) {
            artist.works.push({
              id: work.id,
              title: work.title,
              thumbnailPath: work.thumbnailPath,
              category: work.category,
            });
          }
        }
      }

      // 保存艺术家索引到 LocalStorage
      const artistsArray = Array.from(artists.values());
      const result = await localStorageAdapter.saveArtistIndex(artistsArray);

      console.log(
        `[artistService] Bootstraped ${artistsArray.length} artists from portfolios`
      );
      return result;
    } catch (error) {
      console.error(
        `[artistService] Error bootstrapping from portfolios:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 确保艺术家被索引
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 索引结果
   */
  ensureArtistIndexed: async userId => {
    try {
      if (!userId) {
        return { success: false, error: 'Missing userId' };
      }

      // 检查艺术家是否已存在
      const existingArtist = await artistService.getArtistProfile(userId);
      if (existingArtist && existingArtist.success) {
        console.log(`[artistService] Artist ${userId} already indexed`);
        return { success: true, data: existingArtist.data };
      }

      // 从用户服务获取基础数据
      const { userService } = await import('../userService/index.js');
      const userData = await userService.getUserById(userId);

      if (userData) {
        // 获取用户的作品数据
        const portfolioKey = `portfolio_${userId}`;
        const portfolioData = await localStorageAdapter.getItem(portfolioKey);
        let worksCount = 0;
        let works = [];

        if (portfolioData) {
          try {
            const portfolio = JSON.parse(portfolioData);
            if (Array.isArray(portfolio)) {
              // 只计算公开的作品
              const publicWorks = portfolio.filter(
                item => item.isPublic !== false
              );
              worksCount = publicWorks.length;
              works = publicWorks;
            }
          } catch (parseError) {
            console.warn(
              `[artistService] Failed to parse portfolio for ${userId}:`,
              parseError
            );
          }
        }

        // 构建艺术家数据
        const artist = {
          id: userId,
          name: userData.name || userData.displayName || 'Unknown Artist',
          avatar: userData.avatar || '',
          role: userData.role || 'Artist',
          bio: userData.bio || '',
          school: userData.school || '',
          pronouns: userData.pronouns || '',
          majors: userData.majors || [],
          skills: userData.skills || [],
          socialLinks: userData.socialLinks || {},
          works: works, // 添加实际作品数据
          worksCount: worksCount,
          followers: 0, // TODO: 从关注服务获取真实数据
          following: 0, // TODO: 从关注服务获取真实数据
          createdAt: userData.updatedAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString(),
        };

        const result = await localStorageAdapter.createArtist(userId, artist);
        console.log(`[artistService] Created artist index for ${userId}`);
        return result;
      }

      console.warn(`[artistService] No user data found for ${userId}`);
      return { success: false, error: 'No user data found' };
    } catch (error) {
      console.error(
        `[artistService] Error ensuring artist indexed ${userId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 更新艺术家信息
   * @param {string} artistId - 艺术家ID
   * @param {Object} artistData - 艺术家数据
   * @returns {Promise<Object>} 更新结果
   */
  updateArtist: async (artistId, artistData) => {
    try {
      // 优先更新 LocalStorage
      const result = await localStorageAdapter.updateArtist(
        artistId,
        artistData
      );
      if (result.success) {
        console.log(
          `[artistService] Updated artist ${artistId} in LocalStorage`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.updateArtist(
        artistId,
        artistData
      );
      if (supabaseResult.success) {
        console.log(`[artistService] Updated artist ${artistId} in Supabase`);
        return supabaseResult;
      }

      console.warn(`[artistService] Failed to update artist ${artistId}`);
      return { success: false, error: 'Failed to update artist' };
    } catch (error) {
      console.error(
        `[artistService] Error updating artist ${artistId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },
};

export default artistService;
