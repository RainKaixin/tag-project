import { useState, useEffect, useCallback } from 'react';

import { favoritesService } from '../../../services';
import { ITEM_TYPES } from '../../../services/favoritesService';
import { getCurrentUser } from '../../../utils/currentUser';

/**
 * 收藏数据管理Hook
 * @param {string} viewedUserId - 被查看用户的ID，如果提供则获取该用户的收藏，否则获取当前用户的收藏
 * @returns {Object} 收藏数据和状态
 */
export const useFavorites = (viewedUserId = null) => {
  // 状态管理
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    cursor: null,
    hasMore: false,
    total: 0,
  });

  // 加载收藏列表
  const loadFavorites = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);

        // 确定要获取收藏的用户ID
        let targetUserId = viewedUserId;

        if (!targetUserId) {
          // 如果没有提供viewedUserId，则使用当前登录用户
          const currentUser = getCurrentUser();
          console.log('[useFavorites] 当前用户:', currentUser);

          if (!currentUser?.id) {
            console.warn('[useFavorites] 用户未登录，无法加载收藏');
            setFavorites([]);
            setPagination({
              cursor: null,
              hasMore: false,
              total: 0,
            });
            return;
          }
          targetUserId = currentUser.id;
        }

        console.log('[useFavorites] 获取收藏的用户ID:', targetUserId);

        const params = {
          userId: targetUserId, // 指定要获取收藏的用户ID
          type: 'all', // 固定为all，显示所有收藏
          cursor: reset ? null : pagination.cursor,
          limit: 12,
        };

        console.log('[useFavorites] 加载收藏，参数:', params);

        const result = await favoritesService.getFavorites(params);

        if (result.success) {
          const newFavorites = result.data.items;
          console.log('[useFavorites] 加载到的收藏:', newFavorites);
          console.log(
            '[useFavorites] 收藏类型统计:',
            newFavorites.reduce((acc, fav) => {
              acc[fav.item_type] = (acc[fav.item_type] || 0) + 1;
              return acc;
            }, {})
          );

          if (reset) {
            setFavorites(newFavorites);
          } else {
            setFavorites(prev => [...prev, ...newFavorites]);
          }

          setPagination({
            cursor: result.data.pagination.cursor,
            hasMore: result.data.pagination.hasMore,
            total: result.data.pagination.total,
          });

          console.log('[useFavorites] 分页信息:', result.data.pagination);
        } else {
          console.error('[useFavorites] 加载收藏失败:', result.error);
          setError('Failed to load favorites');
        }
      } catch (err) {
        console.error('[useFavorites] 加载收藏时出错:', err);
        setError(err.message || 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    },
    [] // 移除pagination.cursor依赖，避免无限循环
  );

  // 初始加载
  useEffect(() => {
    console.log('[useFavorites] 初始化加载收藏...');
    loadFavorites(true);
  }, [loadFavorites, viewedUserId]);

  // 移除筛选功能，不再需要

  // 加载更多
  const handleLoadMore = useCallback(() => {
    if (!loading && pagination.hasMore) {
      console.log('[useFavorites] 加载更多收藏...');
      // 直接调用loadFavorites，不依赖pagination.cursor
      loadFavorites(false);
    }
  }, [loading, pagination.hasMore, loadFavorites]);

  // 移除收藏
  const handleRemoveFavorite = useCallback(favoriteId => {
    console.log('[useFavorites] 移除收藏:', favoriteId);
    setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    setPagination(prev => ({
      ...prev,
      total: Math.max(0, prev.total - 1),
    }));
  }, []);

  return {
    // 数据
    favorites,
    loading,
    error,
    pagination,

    // 操作
    handleLoadMore,
    handleRemoveFavorite,
    refresh: () => loadFavorites(true),
  };
};
