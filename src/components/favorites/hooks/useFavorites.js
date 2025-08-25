import { useState, useEffect, useCallback } from 'react';

import { favoritesService } from '../../../services';
import { ITEM_TYPES } from '../../../services/favoritesService';

/**
 * 收藏数据管理Hook
 * @returns {Object} 收藏数据和状态
 */
export const useFavorites = () => {
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

        const params = {
          type: 'all', // 固定为all，显示所有收藏
          cursor: reset ? null : pagination.cursor,
          limit: 12,
        };

        console.log('[Favorites] Loading favorites with params:', params);

        const result = await favoritesService.getFavorites(params);

        if (result.success) {
          const newFavorites = result.data.items;
          console.log('[Favorites] Loaded favorites:', newFavorites);

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
        } else {
          setError('Failed to load favorites');
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError(err.message || 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    },
    [] // 移除pagination.cursor依赖，避免无限循环
  );

  // 初始加载
  useEffect(() => {
    loadFavorites(true);
  }, [loadFavorites]);

  // 移除筛选功能，不再需要

  // 加载更多
  const handleLoadMore = useCallback(() => {
    if (!loading && pagination.hasMore) {
      // 直接调用loadFavorites，不依赖pagination.cursor
      loadFavorites(false);
    }
  }, [loading, pagination.hasMore, loadFavorites]);

  // 移除收藏
  const handleRemoveFavorite = useCallback(favoriteId => {
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
