// favorites-service v1: 收藏服务主接口

import { getCurrentUser } from '../../utils/currentUser';

// 导入适配器实现
import { ITEM_TYPES, isValidItemType } from './constants';
import localStorageAdapter from './localStorage';

/**
 * 收藏服务适配器接口
 * 提供统一的收藏功能，支持Works和Collaborations
 */
class FavoritesService {
  constructor() {
    this.adapter = localStorageAdapter;
  }

  /**
   * 获取用户收藏列表
   * @param {Object} params - 查询参数
   * @param {string} params.userId - 用户ID
   * @param {string} params.type - 筛选类型 ('all' | 'work' | 'collaboration')
   * @param {string} params.cursor - 分页游标
   * @param {number} params.limit - 每页数量
   * @returns {Promise<Object>} 收藏列表和分页信息
   */
  async getFavorites(params = {}) {
    const currentUser = getCurrentUser();
    const userId = params.userId || currentUser?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.adapter.getFavorites({
      userId,
      type: params.type || 'all',
      cursor: params.cursor,
      limit: params.limit || 20,
    });
  }

  /**
   * 添加收藏
   * @param {string} itemType - 项目类型 ('work' | 'collaboration')
   * @param {string} itemId - 项目ID
   * @returns {Promise<Object>} 收藏结果
   */
  async addFavorite(itemType, itemId) {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    if (!itemType || !itemId) {
      throw new Error('Item type and ID are required');
    }

    if (!isValidItemType(itemType)) {
      throw new Error(
        `Invalid item type. Must be "${ITEM_TYPES.WORK}" or "${ITEM_TYPES.COLLABORATION}"`
      );
    }

    return this.adapter.addFavorite({
      userId: currentUser.id,
      itemType,
      itemId,
    });
  }

  /**
   * 取消收藏（通过itemType和itemId）
   * @param {string} itemType - 项目类型 ('work' | 'collaboration')
   * @param {string} itemId - 项目ID
   * @returns {Promise<Object>} 取消收藏结果
   */
  async removeFavorite(itemType, itemId) {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    if (!itemType || !itemId) {
      throw new Error('Item type and ID are required');
    }

    return this.adapter.removeFavorite({
      userId: currentUser.id,
      itemType,
      itemId,
    });
  }

  /**
   * 移除收藏（通过favoriteId）
   * @param {string} favoriteId - 收藏记录ID
   * @returns {Promise<Object>} 移除结果
   */
  async removeFavoriteById(favoriteId) {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    if (!favoriteId) {
      throw new Error('Favorite ID is required');
    }

    // 先获取收藏记录以获取itemType和itemId
    const favoritesResult = await this.getFavorites({ userId: currentUser.id });
    if (!favoritesResult.success) {
      throw new Error('Failed to get favorites');
    }

    const favorite = favoritesResult.data.items.find(
      fav => fav.id === favoriteId
    );
    if (!favorite) {
      throw new Error('Favorite not found');
    }

    return this.adapter.removeFavorite({
      userId: currentUser.id,
      itemType: favorite.itemType,
      itemId: favorite.itemId,
    });
  }

  /**
   * 切换收藏状态
   * @param {string} itemType - 项目类型 ('work' | 'collaboration')
   * @param {string} itemId - 项目ID
   * @param {boolean} shouldFavorite - 是否要收藏
   * @returns {Promise<Object>} 操作结果
   */
  async toggleFavorite(itemType, itemId, shouldFavorite) {
    if (shouldFavorite) {
      return this.addFavorite(itemType, itemId);
    } else {
      return this.removeFavorite(itemType, itemId);
    }
  }

  /**
   * 检查收藏状态
   * @param {string} itemType - 项目类型 ('work' | 'collaboration')
   * @param {string} itemId - 项目ID
   * @returns {Promise<Object>} 收藏状态信息
   */
  async checkFavoriteStatus(itemType, itemId) {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      return {
        success: true,
        data: { isFavorited: false, favoriteId: null },
      };
    }

    if (!itemType || !itemId) {
      throw new Error('Item type and ID are required');
    }

    return this.adapter.checkFavoriteStatus({
      userId: currentUser.id,
      itemType,
      itemId,
    });
  }

  /**
   * 获取收藏计数
   * @param {string} itemType - 项目类型 ('work' | 'collaboration')
   * @param {string} itemId - 项目ID
   * @returns {Promise<Object>} 收藏计数
   */
  async getFavoriteCount(itemType, itemId) {
    if (!itemType || !itemId) {
      throw new Error('Item type and ID are required');
    }

    return this.adapter.getFavoriteCount({
      itemType,
      itemId,
    });
  }

  /**
   * 批量检查收藏状态
   * @param {Array} items - 要检查的项目列表
   * @returns {Promise<Object>} 批量收藏状态
   */
  async batchCheckFavoriteStatus(items) {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      // 用户未登录，返回所有项目都未收藏
      return items.reduce((acc, item) => {
        acc[`${item.itemType}_${item.itemId}`] = false;
        return acc;
      }, {});
    }

    return this.adapter.batchCheckFavoriteStatus({
      userId: currentUser.id,
      items,
    });
  }
}

// 创建单例实例
const favoritesService = new FavoritesService();

// 导出常量和实例
export { ITEM_TYPES };
export default favoritesService;
