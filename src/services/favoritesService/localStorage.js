// favorites-service-localStorage v1: 统一存储适配器

import { storage } from '../storage/index';

/**
 * 统一存储适配器
 * 使用统一存储接口模拟收藏功能
 */
const localStorageAdapter = {
  // 存储键名
  STORAGE_KEY: 'tag_favorites',
  COUNTERS_KEY: 'tag_favorite_counters',

  /**
   * 获取存储的收藏数据
   * @returns {Promise<Object>} 收藏数据
   */
  async _getStorage() {
    try {
      const data = await storage.getItem(this.STORAGE_KEY);
      const parsedData = data ? JSON.parse(data) : {};

      // 如果没有数据，初始化默认收藏数据
      if (Object.keys(parsedData).length === 0) {
        const defaultData = this._getDefaultFavorites();
        await this._setStorage(defaultData);
        return defaultData;
      }

      return parsedData;
    } catch (error) {
      console.error('Failed to get favorites from storage:', error);
      return {};
    }
  },

  /**
   * 获取默认收藏数据
   * @returns {Object} 默认收藏数据
   */
  _getDefaultFavorites() {
    // 完全移除默认收藏数据，让用户从空白开始
    // 这样就不会显示任何未收藏的内容
    return {};
  },

  /**
   * 保存收藏数据到存储
   * @param {Object} data - 收藏数据
   */
  async _setStorage(data) {
    try {
      await storage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save favorites to storage:', error);
    }
  },

  /**
   * 获取收藏计数数据
   * @returns {Promise<Object>} 计数数据
   */
  async _getCounters() {
    try {
      const data = await storage.getItem(this.COUNTERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to get favorite counters from storage:', error);
      return {};
    }
  },

  /**
   * 保存收藏计数数据
   * @param {Object} data - 计数数据
   */
  async _setCounters(data) {
    try {
      await storage.setItem(this.COUNTERS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save favorite counters to storage:', error);
    }
  },

  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * 获取用户收藏列表
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 收藏列表
   */
  async getFavorites(params) {
    const { userId, type = 'all', cursor, limit = 20 } = params;
    const storage = await this._getStorage();
    const userFavorites = storage[userId] || [];

    // 筛选类型
    let filteredFavorites = userFavorites;
    if (type !== 'all') {
      filteredFavorites = userFavorites.filter(fav => fav.itemType === type);
    }

    // 排序（按收藏时间倒序）
    filteredFavorites.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // 分页处理
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = filteredFavorites.findIndex(fav => fav.id === cursor);
      startIndex = cursorIndex + 1;
    }

    const endIndex = startIndex + limit;
    const items = filteredFavorites.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredFavorites.length;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    // 模拟网络延迟（减少延迟，让切换更流畅）
    await new Promise(resolve => setTimeout(resolve, 30));

    return {
      success: true,
      data: {
        items,
        pagination: {
          cursor: nextCursor,
          hasMore,
          total: filteredFavorites.length,
        },
      },
    };
  },

  /**
   * 添加收藏
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 添加结果
   */
  async addFavorite(params) {
    const { userId, itemType, itemId } = params;
    const storage = await this._getStorage();
    const counters = await this._getCounters();

    // 检查是否已收藏
    const userFavorites = storage[userId] || [];
    const existingIndex = userFavorites.findIndex(
      fav => fav.itemType === itemType && fav.itemId === itemId
    );

    if (existingIndex !== -1) {
      // 已收藏，幂等操作，返回成功
      return {
        success: true,
        data: userFavorites[existingIndex],
      };
    }

    // 创建新的收藏记录
    const newFavorite = {
      id: this._generateId(),
      userId,
      itemType,
      itemId,
      createdAt: new Date().toISOString(),
    };

    // 保存到存储
    userFavorites.push(newFavorite);
    storage[userId] = userFavorites;
    await this._setStorage(storage);

    // 更新计数
    const counterKey = `${itemType}_${itemId}`;
    counters[counterKey] = (counters[counterKey] || 0) + 1;
    await this._setCounters(counters);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
      data: newFavorite,
    };
  },

  /**
   * 取消收藏
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 取消结果
   */
  async removeFavorite(params) {
    const { userId, itemType, itemId } = params;
    const storage = await this._getStorage();
    const counters = await this._getCounters();

    const userFavorites = storage[userId] || [];
    const existingIndex = userFavorites.findIndex(
      fav => fav.itemType === itemType && fav.itemId === itemId
    );

    if (existingIndex === -1) {
      // 未收藏，幂等操作，返回成功
      return {
        success: true,
        data: null,
      };
    }

    // 移除收藏
    const removedFavorite = userFavorites.splice(existingIndex, 1)[0];
    storage[userId] = userFavorites;
    await this._setStorage(storage);

    // 更新计数
    const counterKey = `${itemType}_${itemId}`;
    counters[counterKey] = Math.max(0, (counters[counterKey] || 1) - 1);
    await this._setCounters(counters);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
      data: removedFavorite,
    };
  },

  /**
   * 检查收藏状态
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 收藏状态
   */
  async checkFavoriteStatus(params) {
    const { userId, itemType, itemId } = params;
    const storage = await this._getStorage();
    const userFavorites = storage[userId] || [];

    const favorite = userFavorites.find(
      fav => fav.itemType === itemType && fav.itemId === itemId
    );

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 50));

    return {
      success: true,
      data: {
        isFavorited: !!favorite,
        favoriteId: favorite?.id || null,
      },
    };
  },

  /**
   * 获取收藏计数
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 收藏计数
   */
  async getFavoriteCount(params) {
    const { itemType, itemId } = params;
    const counters = await this._getCounters();
    const counterKey = `${itemType}_${itemId}`;

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 50));

    return {
      success: true,
      data: {
        count: counters[counterKey] || 0,
      },
    };
  },

  /**
   * 批量检查收藏状态
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 批量收藏状态
   */
  async batchCheckFavoriteStatus(params) {
    const { userId, items } = params;
    const storage = await this._getStorage();
    const userFavorites = storage[userId] || [];

    const result = {};

    items.forEach(item => {
      const key = `${item.itemType}_${item.itemId}`;
      const favorite = userFavorites.find(
        fav => fav.itemType === item.itemType && fav.itemId === item.itemId
      );
      result[key] = !!favorite;
    });

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      data: result,
    };
  },

  /**
   * 清除用户所有收藏（用于测试）
   * @param {string} userId - 用户ID
   */
  async clearUserFavorites(userId) {
    const storage = await this._getStorage();
    delete storage[userId];
    await this._setStorage(storage);
  },

  /**
   * 获取所有收藏数据（用于调试）
   * @returns {Promise<Object>} 所有收藏数据
   */
  async getAllFavorites() {
    return await this._getStorage();
  },
};

export default localStorageAdapter;
