// likeService/localStorage.js - LocalStorage點讚適配器

import {
  toggleArtworkLike,
  checkUserLikeStatus,
  getArtworkLikeCount,
} from '../mock/likeService.js';

/**
 * LocalStorage點讚適配器
 * 包裝Mock點讚服務以提供統一的接口
 */
export const localStorageAdapter = {
  /**
   * 切換作品點讚狀態
   * @param {string} artworkId - 作品ID
   * @param {string} userId - 用戶ID
   * @returns {Promise<Object>} 點讚結果
   */
  toggleArtworkLike: async (artworkId, userId) => {
    try {
      const result = await toggleArtworkLike(artworkId, userId);
      console.log(
        `[localStorageAdapter] Toggled like for artwork ${artworkId}`
      );
      return result;
    } catch (error) {
      console.error(`[localStorageAdapter] Error toggling like:`, error);
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
      const result = await checkUserLikeStatus(artworkId, userId);
      console.log(
        `[localStorageAdapter] Checked like status for artwork ${artworkId}`
      );
      return result;
    } catch (error) {
      console.error(`[localStorageAdapter] Error checking like status:`, error);
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
      const result = await getArtworkLikeCount(artworkId);
      console.log(
        `[localStorageAdapter] Got like count for artwork ${artworkId}`
      );
      return result;
    } catch (error) {
      console.error(`[localStorageAdapter] Error getting like count:`, error);
      return { success: false, error: error.message };
    }
  },
};
