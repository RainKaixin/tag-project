// likeService/index.js - 點讚服務主接口

import { localStorageAdapter } from './localStorage.js';
import { supabaseAdapter } from './supabase.js';

/**
 * 點讚服務接口
 * 提供統一的點讚數據訪問，支持多數據源適配
 */
export const likeService = {
  /**
   * 切換作品點讚狀態
   * @param {string} artworkId - 作品ID
   * @param {string} userId - 用戶ID
   * @returns {Promise<Object>} 點讚結果
   */
  toggleArtworkLike: async (artworkId, userId) => {
    try {
      // 檢查是否為Mock模式
      const { isMock } = await import('../../utils/envCheck.js');
      const isMockMode = isMock();

      if (!isMockMode) {
        // 非Mock模式：使用Supabase
        try {
          const result = await supabaseAdapter.toggleArtworkLike(
            artworkId,
            userId
          );
          console.log(
            `[likeService] Using Supabase like toggle for artwork ${artworkId}`
          );
          return result;
        } catch (supabaseError) {
          console.error(
            `[likeService] Supabase failed for artwork ${artworkId}:`,
            supabaseError
          );
          throw supabaseError;
        }
      }

      // Mock模式：使用LocalStorage
      console.log(
        `[likeService] Mock mode: Using LocalStorage like toggle for artwork ${artworkId}`
      );
      return await localStorageAdapter.toggleArtworkLike(artworkId, userId);
    } catch (error) {
      console.error(
        `[likeService] Error toggling like for artwork ${artworkId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 檢查用戶是否已點讚作品
   * @param {string} artworkId - 作品ID
   * @param {string} userId - 用戶ID
   * @returns {Promise<Object>} 點讚狀態
   */
  checkUserLikeStatus: async (artworkId, userId) => {
    try {
      // 檢查是否為Mock模式
      const { isMock } = await import('../../utils/envCheck.js');
      const isMockMode = isMock();

      if (!isMockMode) {
        // 非Mock模式：使用Supabase
        try {
          const result = await supabaseAdapter.checkUserLikeStatus(
            artworkId,
            userId
          );
          console.log(
            `[likeService] Using Supabase like status check for artwork ${artworkId}`
          );
          return result;
        } catch (supabaseError) {
          console.error(
            `[likeService] Supabase failed for artwork ${artworkId}:`,
            supabaseError
          );
          throw supabaseError;
        }
      }

      // Mock模式：使用LocalStorage
      console.log(
        `[likeService] Mock mode: Using LocalStorage like status check for artwork ${artworkId}`
      );
      return await localStorageAdapter.checkUserLikeStatus(artworkId, userId);
    } catch (error) {
      console.error(
        `[likeService] Error checking like status for artwork ${artworkId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 獲取作品總點讚數
   * @param {string} artworkId - 作品ID
   * @returns {Promise<Object>} 點讚數
   */
  getArtworkLikeCount: async artworkId => {
    try {
      // 檢查是否為Mock模式
      const { isMock } = await import('../../utils/envCheck.js');
      const isMockMode = isMock();

      if (!isMockMode) {
        // 非Mock模式：使用Supabase
        try {
          const result = await supabaseAdapter.getArtworkLikeCount(artworkId);
          console.log(
            `[likeService] Using Supabase like count for artwork ${artworkId}`
          );
          return result;
        } catch (supabaseError) {
          console.error(
            `[likeService] Supabase failed for artwork ${artworkId}:`,
            supabaseError
          );
          throw supabaseError;
        }
      }

      // Mock模式：使用LocalStorage
      console.log(
        `[likeService] Mock mode: Using LocalStorage like count for artwork ${artworkId}`
      );
      return await localStorageAdapter.getArtworkLikeCount(artworkId);
    } catch (error) {
      console.error(
        `[likeService] Error getting like count for artwork ${artworkId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },
};
