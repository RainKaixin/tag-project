// likeService/supabase.js - Supabase點讚適配器

import { supabase } from '../supabase/client.js';

/**
 * Supabase點讚適配器
 * 提供統一的點讚接口，包裝Supabase點讚功能
 */
export const supabaseAdapter = {
  /**
   * 切換作品點讚狀態
   * @param {string} artworkId - 作品ID
   * @param {string} userId - 用戶ID
   * @returns {Promise<Object>} 點讚結果
   */
  toggleArtworkLike: async (artworkId, userId) => {
    try {
      // 先檢查是否已點讚
      const { data: existingLikes, error: checkError } = await supabase
        .from('artwork_likes')
        .select('id')
        .eq('artwork_id', artworkId)
        .eq('user_id', userId)
        .limit(1);

      const existingLike = existingLikes?.[0] || null;

      // 如果表不存在，回退到LocalStorage
      if (checkError && checkError.code === 'PGRST205') {
        console.warn(
          '[SupabaseLike] artwork_likes table not found, falling back to LocalStorage'
        );
        const { localStorageAdapter } = await import('./localStorage.js');
        return await localStorageAdapter.toggleArtworkLike(artworkId, userId);
      }

      if (checkError) {
        console.error(
          '[SupabaseLike] Error checking existing like:',
          checkError
        );
        return { success: false, error: checkError.message };
      }

      let isLiked = false;
      let totalLikes = 0;

      if (existingLike) {
        // 已點讚，取消點讚
        const { error: deleteError } = await supabase
          .from('artwork_likes')
          .delete()
          .eq('artwork_id', artworkId)
          .eq('user_id', userId);

        if (deleteError) {
          console.error('[SupabaseLike] Error deleting like:', deleteError);
          return { success: false, error: deleteError.message };
        }

        isLiked = false;
        console.log(
          `[SupabaseLike] User ${userId} unliked artwork ${artworkId}`
        );
      } else {
        // 未點讚，添加點讚
        console.log('[DEBUG] Using INSERT method instead of upsert for like');
        const { data, error: insertError } = await supabase
          .from('artwork_likes')
          .insert({
            user_id: userId,
            artwork_id: artworkId,
          });

        if (insertError) {
          // 检查是否是重复键错误（已经点赞了）
          if (insertError.code === '23505') {
            console.log(
              `[SupabaseLike] User ${userId} already liked artwork ${artworkId}`
            );
            isLiked = true;
          } else {
            console.error('[SupabaseLike] Error inserting like:', insertError);
            return { success: false, error: insertError.message };
          }
        } else {
          isLiked = true;
          console.log(
            `[SupabaseLike] User ${userId} liked artwork ${artworkId}`
          );
        }
      }

      // 獲取總點讚數
      const { count, error: countError } = await supabase
        .from('artwork_likes')
        .select('*', { count: 'exact', head: true })
        .eq('artwork_id', artworkId);

      if (countError) {
        console.error('[SupabaseLike] Error getting like count:', countError);
        totalLikes = 0;
      } else {
        totalLikes = count || 0;
      }

      console.log(
        `[SupabaseLike] Artwork ${artworkId} total likes: ${totalLikes}`
      );

      return {
        success: true,
        data: {
          liked: isLiked,
          likes: totalLikes,
        },
      };
    } catch (error) {
      console.error('[SupabaseLike] Error toggling like:', error);
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
      // 檢查是否已點讚
      const { data: likes, error } = await supabase
        .from('artwork_likes')
        .select('id')
        .eq('artwork_id', artworkId)
        .eq('user_id', userId)
        .limit(1);

      const isLiked = likes && likes.length > 0;

      // 如果表不存在，回退到LocalStorage
      if (error && error.code === 'PGRST205') {
        console.warn(
          '[SupabaseLike] artwork_likes table not found, falling back to LocalStorage'
        );
        const { localStorageAdapter } = await import('./localStorage.js');
        return await localStorageAdapter.checkUserLikeStatus(artworkId, userId);
      }

      if (error) {
        console.error('[SupabaseLike] Error checking like status:', error);
        return { success: false, error: error.message };
      }

      // 獲取總點讚數
      const { count, error: countError } = await supabase
        .from('artwork_likes')
        .select('*', { count: 'exact', head: true })
        .eq('artwork_id', artworkId);

      if (countError) {
        console.error('[SupabaseLike] Error getting like count:', countError);
        return { success: false, error: countError.message };
      }

      const totalLikes = count || 0;

      console.log(
        `[SupabaseLike] User ${userId} like status for artwork ${artworkId}: ${
          isLiked ? 'Liked' : 'Not liked'
        }, Total: ${totalLikes}`
      );

      return {
        success: true,
        data: {
          liked: isLiked,
          likes: totalLikes,
        },
      };
    } catch (error) {
      console.error('[SupabaseLike] Error checking like status:', error);
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
      const { count, error } = await supabase
        .from('artwork_likes')
        .select('*', { count: 'exact', head: true })
        .eq('artwork_id', artworkId);

      // 如果表不存在，回退到LocalStorage
      if (error && error.code === 'PGRST205') {
        console.warn(
          '[SupabaseLike] artwork_likes table not found, falling back to LocalStorage'
        );
        const { localStorageAdapter } = await import('./localStorage.js');
        return await localStorageAdapter.getArtworkLikeCount(artworkId);
      }

      if (error) {
        console.error('[SupabaseLike] Error getting like count:', error);
        return { success: false, error: error.message };
      }

      const totalLikes = count || 0;
      console.log(
        `[SupabaseLike] Artwork ${artworkId} total likes: ${totalLikes}`
      );

      return {
        success: true,
        data: {
          likes: totalLikes,
        },
      };
    } catch (error) {
      console.error('[SupabaseLike] Error getting like count:', error);
      return { success: false, error: error.message };
    }
  },
};
