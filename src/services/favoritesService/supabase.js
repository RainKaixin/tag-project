// favorites-service-supabase v1: Supabase适配器实现

import { supabase } from '../supabase/client.js';

/**
 * Supabase适配器
 * 使用 Supabase 数据库存储收藏数据
 */
const supabaseAdapter = {
  /**
   * 获取用户收藏列表
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 收藏列表和分页信息
   */
  async getFavorites(params) {
    console.log('[Favorites] Supabase getFavorites called:', params);

    const { userId, type = 'all', cursor, limit = 20 } = params;

    try {
      let query = supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // 类型筛选
      if (type !== 'all') {
        query = query.eq('item_type', type);
      }

      // 分页
      if (cursor) {
        query = query.lt('created_at', cursor);
      }

      query = query.limit(limit + 1); // 多取一个用于判断是否有更多

      const { data, error } = await query;

      if (error) {
        console.error('[Favorites] Supabase getFavorites error:', error);
        return { success: false, error: error.message };
      }

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, limit) : data;
      const nextCursor = hasMore ? items[items.length - 1]?.created_at : null;

      console.log('[Favorites] Supabase getFavorites success:', {
        count: items.length,
        hasMore,
      });

      return {
        success: true,
        data: {
          items,
          pagination: {
            cursor: nextCursor,
            hasMore,
            total: items.length, // 注意：这里没有获取总数，需要时可以单独查询
          },
        },
      };
    } catch (error) {
      console.error('[Favorites] Supabase getFavorites exception:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 添加收藏
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 添加结果
   */
  async addFavorite(params) {
    console.log('[Favorites] Supabase addFavorite called:', params);

    const { userId, itemType, itemId } = params;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
        })
        .select()
        .single();

      if (error) {
        // 如果是重复收藏，返回成功（幂等操作）
        if (error.code === '23505') {
          // unique_violation
          console.log('[Favorites] Supabase addFavorite: already favorited');
          return { success: true, data: { id: 'existing' } };
        }
        console.error('[Favorites] Supabase addFavorite error:', error);
        return { success: false, error: error.message };
      }

      console.log('[Favorites] Supabase addFavorite success:', data);
      return { success: true, data };
    } catch (error) {
      console.error('[Favorites] Supabase addFavorite exception:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 移除收藏
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 移除结果
   */
  async removeFavorite(params) {
    console.log('[Favorites] Supabase removeFavorite called:', params);

    const { userId, itemType, itemId } = params;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .select()
        .single();

      if (error) {
        console.error('[Favorites] Supabase removeFavorite error:', error);
        return { success: false, error: error.message };
      }

      console.log('[Favorites] Supabase removeFavorite success:', data);
      return { success: true, data };
    } catch (error) {
      console.error('[Favorites] Supabase removeFavorite exception:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 检查收藏状态
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 收藏状态
   */
  async checkFavoriteStatus(params) {
    console.log('[Favorites] Supabase checkFavoriteStatus called:', params);

    const { userId, itemType, itemId } = params;

    try {
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .limit(1);

      if (error) {
        console.error('[Favorites] Supabase checkFavoriteStatus error:', error);
        return { success: false, error: error.message };
      }

      const isFavorited = favorites && favorites.length > 0;
      const favoriteId = isFavorited ? favorites[0].id : null;

      console.log(
        '[Favorites] Supabase checkFavoriteStatus:',
        isFavorited ? 'favorited' : 'not favorited'
      );
      return {
        success: true,
        data: { isFavorited, favoriteId },
      };
    } catch (error) {
      console.error(
        '[Favorites] Supabase checkFavoriteStatus exception:',
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 获取收藏数量
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 收藏数量
   */
  async getFavoriteCount(params) {
    console.log('[Favorites] Supabase getFavoriteCount called:', params);

    const { itemType, itemId } = params;

    try {
      // 使用聚合視圖獲取收藏統計
      const { data, error } = await supabase
        .from('favorite_counts')
        .select('favorite_count')
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // no rows returned - 沒有收藏記錄
          console.log(
            '[Favorites] Supabase getFavoriteCount: no favorites found'
          );
          return { success: true, data: { count: 0 } };
        }
        console.error('[Favorites] Supabase getFavoriteCount error:', error);
        return { success: false, error: error.message };
      }

      console.log(
        '[Favorites] Supabase getFavoriteCount success:',
        data.favorite_count
      );
      return { success: true, data: { count: data.favorite_count || 0 } };
    } catch (error) {
      console.error('[Favorites] Supabase getFavoriteCount exception:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 批量检查收藏状态
   * @param {Array} items - 项目列表
   * @returns {Promise<Object>} 收藏状态映射
   */
  async batchCheckFavoriteStatus(items) {
    console.log('[Favorites] Supabase batchCheckFavoriteStatus called:', items);

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('item_type, item_id')
        .in(
          'item_type',
          items.map(item => item.item_type)
        )
        .in(
          'item_id',
          items.map(item => item.item_id)
        );

      if (error) {
        console.error(
          '[Favorites] Supabase batchCheckFavoriteStatus error:',
          error
        );
        return { success: false, error: error.message };
      }

      // 创建状态映射
      const statusMap = {};
      data.forEach(fav => {
        const key = `${fav.item_type}:${fav.item_id}`;
        statusMap[key] = true;
      });

      console.log(
        '[Favorites] Supabase batchCheckFavoriteStatus success:',
        statusMap
      );
      return { success: true, data: statusMap };
    } catch (error) {
      console.error(
        '[Favorites] Supabase batchCheckFavoriteStatus exception:',
        error
      );
      return { success: false, error: error.message };
    }
  },
};

export default supabaseAdapter;
