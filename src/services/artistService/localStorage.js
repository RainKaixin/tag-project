// artistService/localStorage.js - 统一存储适配器

import { storage } from 'src/services/storage/index';

/**
 * 统一存储艺术家数据适配器
 * 管理艺术家数据在存储中的读写操作
 */
export const localStorageAdapter = {
  /**
   * 获取公开艺术家列表
   * @returns {Promise<Object>} 艺术家列表
   */
  getPublicArtists: async () => {
    try {
      const artists = [];

      // 获取所有存储键
      const keys = await storage.keys();

      // 遍历所有艺术家数据
      for (const key of keys) {
        if (key && key.startsWith('artist_')) {
          try {
            const artistData = await storage.getItem(key);
            if (artistData) {
              const artist = JSON.parse(artistData);
              artists.push(artist);
            }
          } catch (error) {
            console.warn(
              `[localStorageAdapter] Failed to parse artist data for key ${key}:`,
              error
            );
          }
        }
      }

      console.log(`[localStorageAdapter] Retrieved ${artists.length} artists`);
      return { success: true, data: artists };
    } catch (error) {
      console.error(
        '[localStorageAdapter] Error getting public artists:',
        error
      );
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

      // 从存储获取艺术家数据
      const artistData = await storage.getItem(`artist_${artistId}`);
      if (!artistData) {
        console.log(
          `[localStorageAdapter] No artist data found for ${artistId}`
        );
        return { success: false, error: 'Artist not found' };
      }

      const artist = JSON.parse(artistData);
      console.log(
        `[localStorageAdapter] Retrieved artist profile for ${artistId}`
      );
      return { success: true, data: artist };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error getting artist profile ${artistId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 创建艺术家
   * @param {string} artistId - 艺术家ID
   * @param {Object} artistData - 艺术家数据
   * @returns {Promise<Object>} 创建结果
   */
  createArtist: async (artistId, artistData) => {
    try {
      if (!artistId || !artistData) {
        return { success: false, error: 'Missing artistId or artistData' };
      }

      // 检查艺术家是否已存在
      const existingArtist = await localStorageAdapter.getArtistProfile(
        artistId
      );
      if (existingArtist.success) {
        console.log(`[localStorageAdapter] Artist ${artistId} already exists`);
        return { success: true, data: existingArtist.data };
      }

      // 创建艺术家记录
      const newArtist = {
        id: artistId,
        ...artistData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await storage.setItem(`artist_${artistId}`, JSON.stringify(newArtist));
      console.log(`[localStorageAdapter] Created artist ${artistId}`);

      return { success: true, data: newArtist };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error creating artist ${artistId}:`,
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
      if (!artistId || !artistData) {
        return { success: false, error: 'Missing artistId or artistData' };
      }

      // 获取现有艺术家数据
      const existingArtist = await localStorageAdapter.getArtistProfile(
        artistId
      );
      if (!existingArtist.success) {
        console.warn(
          `[localStorageAdapter] Artist ${artistId} not found for update`
        );
        return { success: false, error: 'Artist not found' };
      }

      // 合并数据
      const updatedArtist = {
        ...existingArtist.data,
        ...artistData,
        updatedAt: new Date().toISOString(),
      };

      await storage.setItem(
        `artist_${artistId}`,
        JSON.stringify(updatedArtist)
      );
      console.log(`[localStorageAdapter] Updated artist ${artistId}`);

      return { success: true, data: updatedArtist };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error updating artist ${artistId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 保存艺术家索引
   * @param {Array} artists - 艺术家数组
   * @returns {Promise<Object>} 保存结果
   */
  saveArtistIndex: async artists => {
    try {
      if (!Array.isArray(artists)) {
        return { success: false, error: 'Artists must be an array' };
      }

      // 保存每个艺术家到存储
      for (const artist of artists) {
        if (artist.id) {
          await storage.setItem(`artist_${artist.id}`, JSON.stringify(artist));
        }
      }

      console.log(
        `[localStorageAdapter] Saved ${artists.length} artists to index`
      );
      return { success: true, data: artists };
    } catch (error) {
      console.error('[localStorageAdapter] Error saving artist index:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 删除艺术家
   * @param {string} artistId - 艺术家ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteArtist: async artistId => {
    try {
      if (!artistId) {
        return { success: false, error: 'Missing artistId' };
      }

      await storage.removeItem(`artist_${artistId}`);
      console.log(`[localStorageAdapter] Deleted artist ${artistId}`);
      return { success: true };
    } catch (error) {
      console.error(
        `[localStorageAdapter] Error deleting artist ${artistId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },
};
