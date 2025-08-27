// draft-service-localStorage v1: 草稿服務 localStorage 適配器

import { storage } from '../storage/index';

/**
 * 草稿服務 localStorage 適配器
 * 使用 localStorage 模擬草稿功能
 */
const localStorageAdapter = {
  // 存儲鍵名
  STORAGE_KEY: 'tag_collaboration_drafts',

  /**
   * 獲取存儲的草稿數據
   * @returns {Promise<Object>} 草稿數據
   */
  async _getStorage() {
    try {
      const data = await storage.getItem(this.STORAGE_KEY);
      const parsedData = data ? JSON.parse(data) : {};
      return parsedData;
    } catch (error) {
      console.error('Failed to get drafts from storage:', error);
      return {};
    }
  },

  /**
   * 保存草稿數據到存儲
   * @param {Object} data - 草稿數據
   */
  async _setStorage(data) {
    try {
      await storage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save drafts to storage:', error);
    }
  },

  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  _generateId() {
    return (
      'draft_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
  },

  /**
   * 獲取用戶草稿列表
   * @param {Object} params - 查詢參數
   * @returns {Promise<Object>} 草稿列表
   */
  async getDrafts(params) {
    const { userId, type = 'all', cursor, limit = 20 } = params;
    const storage = await this._getStorage();
    const userDrafts = storage[userId] || [];

    // 篩選類型
    let filteredDrafts = userDrafts;
    if (type !== 'all') {
      filteredDrafts = userDrafts.filter(draft => draft.draftType === type);
    }

    // 排序（按更新時間倒序）
    filteredDrafts.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // 分頁處理
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = filteredDrafts.findIndex(
        draft => draft.id === cursor
      );
      startIndex = cursorIndex + 1;
    }

    const endIndex = startIndex + limit;
    const items = filteredDrafts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredDrafts.length;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      data: {
        items,
        pagination: {
          cursor: nextCursor,
          hasMore,
          total: filteredDrafts.length,
        },
      },
    };
  },

  /**
   * 保存草稿
   * @param {Object} params - 參數
   * @returns {Promise<Object>} 保存結果
   */
  async saveDraft(params) {
    const { userId, draftType, draftData } = params;
    const storage = await this._getStorage();
    const userDrafts = storage[userId] || [];

    // 創建新的草稿記錄
    const newDraft = {
      id: this._generateId(),
      userId,
      draftType,
      ...draftData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 保存到存儲
    userDrafts.push(newDraft);
    storage[userId] = userDrafts;
    await this._setStorage(storage);

    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
      data: newDraft,
    };
  },

  /**
   * 更新草稿
   * @param {Object} params - 參數
   * @returns {Promise<Object>} 更新結果
   */
  async updateDraft(params) {
    const { userId, draftId, draftData } = params;
    const storage = await this._getStorage();
    const userDrafts = storage[userId] || [];

    const draftIndex = userDrafts.findIndex(draft => draft.id === draftId);
    if (draftIndex === -1) {
      throw new Error('Draft not found');
    }

    // 更新草稿數據
    const updatedDraft = {
      ...userDrafts[draftIndex],
      ...draftData,
      updatedAt: new Date().toISOString(),
    };

    userDrafts[draftIndex] = updatedDraft;
    storage[userId] = userDrafts;
    await this._setStorage(storage);

    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
      data: updatedDraft,
    };
  },

  /**
   * 刪除草稿
   * @param {Object} params - 參數
   * @returns {Promise<Object>} 刪除結果
   */
  async deleteDraft(params) {
    const { userId, draftId } = params;
    const storage = await this._getStorage();
    const userDrafts = storage[userId] || [];

    const draftIndex = userDrafts.findIndex(draft => draft.id === draftId);
    if (draftIndex === -1) {
      throw new Error('Draft not found');
    }

    // 刪除草稿
    const deletedDraft = userDrafts.splice(draftIndex, 1)[0];
    storage[userId] = userDrafts;
    await this._setStorage(storage);

    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
      data: deletedDraft,
    };
  },

  /**
   * 獲取草稿詳情
   * @param {Object} params - 參數
   * @returns {Promise<Object>} 草稿詳情
   */
  async getDraftById(params) {
    const { userId, draftId } = params;
    const storage = await this._getStorage();
    const userDrafts = storage[userId] || [];

    const draft = userDrafts.find(draft => draft.id === draftId);
    if (!draft) {
      throw new Error('Draft not found');
    }

    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      data: draft,
    };
  },

  /**
   * 發布草稿（轉換為正式內容）
   * @param {Object} params - 參數
   * @returns {Promise<Object>} 發布結果
   */
  async publishDraft(params) {
    const { userId, draftId } = params;
    const storage = await this._getStorage();
    const userDrafts = storage[userId] || [];

    const draftIndex = userDrafts.findIndex(draft => draft.id === draftId);
    if (draftIndex === -1) {
      throw new Error('Draft not found');
    }

    // 獲取草稿數據
    const draft = userDrafts[draftIndex];

    // 這裡可以添加發布到正式內容的邏輯
    // 例如：保存到 collaborationService 等

    // 刪除草稿（因為已經發布）
    const publishedDraft = userDrafts.splice(draftIndex, 1)[0];
    storage[userId] = userDrafts;
    await this._setStorage(storage);

    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      data: {
        ...publishedDraft,
        publishedAt: new Date().toISOString(),
      },
    };
  },

  /**
   * 清除用戶所有草稿（用於測試）
   * @param {string} userId - 用戶ID
   */
  async clearUserDrafts(userId) {
    const storage = await this._getStorage();
    delete storage[userId];
    await this._setStorage(storage);
  },

  /**
   * 獲取所有草稿數據（用於調試）
   * @returns {Promise<Object>} 所有草稿數據
   */
  async getAllDrafts() {
    return await this._getStorage();
  },
};

export default localStorageAdapter;
