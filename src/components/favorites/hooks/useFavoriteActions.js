import { useCallback } from 'react';

import { favoritesService } from '../../../services';

/**
 * 收藏操作逻辑Hook
 * @returns {Object} 操作函数
 */
export const useFavoriteActions = () => {
  // 移除收藏处理
  const handleRemoveFavorite = useCallback(async favoriteId => {
    try {
      // 调用服务移除收藏
      const result = await favoritesService.removeFavoriteById(favoriteId);

      if (result.success) {
        // 可以在这里添加成功提示
        console.log('Favorite removed successfully');
        return true;
      } else {
        console.error('Failed to remove favorite:', result.error);
        // 可以在这里添加错误提示
        return false;
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      // 可以在这里添加错误提示
      return false;
    }
  }, []);

  // 批量检查收藏状态
  const batchCheckFavoriteStatus = useCallback(async items => {
    try {
      const itemIds = items.map(item => ({
        itemType: item.type,
        itemId: item.id,
      }));

      const result = await favoritesService.batchCheckFavoriteStatus(itemIds);

      if (result.success) {
        return result.data;
      } else {
        console.error('Failed to check favorite status:', result.error);
        return {};
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return {};
    }
  }, []);

  return {
    handleRemoveFavorite,
    batchCheckFavoriteStatus,
  };
};
