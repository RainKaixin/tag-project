// draft-service v1: 草稿服務主接口

import { getCurrentUser } from '../../utils/currentUser';

import localStorageAdapter from './localStorage';

/**
 * 草稿服務適配器接口
 * 提供統一的草稿功能，支持 Collaboration 草稿管理
 */
class DraftService {
  constructor() {
    this.adapter = localStorageAdapter;
  }

  /**
   * 獲取用戶草稿列表
   * @param {Object} params - 查詢參數
   * @param {string} params.userId - 用戶ID
   * @param {string} params.type - 草稿類型 ('collaboration' | 'all')
   * @param {string} params.cursor - 分頁游標
   * @param {number} params.limit - 每頁數量
   * @returns {Promise<Object>} 草稿列表和分頁信息
   */
  async getDrafts(params = {}) {
    const currentUser = await getCurrentUser();
    const userId = params.userId || currentUser?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // 暫時返回空草稿列表，避免 Storage 錯誤
    console.log(
      '[DraftService] getDrafts: returning empty list to avoid storage errors'
    );
    return {
      success: true,
      data: {
        items: [],
        pagination: {
          cursor: null,
          hasMore: false,
          total: 0,
        },
      },
    };
  }

  /**
   * 保存草稿
   * @param {string} draftType - 草稿類型 ('collaboration')
   * @param {Object} draftData - 草稿數據
   * @returns {Promise<Object>} 保存結果
   */
  async saveDraft(draftType, draftData) {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    if (!draftType || !draftData) {
      throw new Error('Draft type and data are required');
    }

    return this.adapter.saveDraft({
      userId: currentUser.id,
      draftType,
      draftData,
    });
  }

  /**
   * 更新草稿
   * @param {string} draftId - 草稿ID
   * @param {Object} draftData - 更新的草稿數據
   * @returns {Promise<Object>} 更新結果
   */
  async updateDraft(draftId, draftData) {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    if (!draftId || !draftData) {
      throw new Error('Draft ID and data are required');
    }

    return this.adapter.updateDraft({
      userId: currentUser.id,
      draftId,
      draftData,
    });
  }

  /**
   * 刪除草稿
   * @param {string} draftId - 草稿ID
   * @returns {Promise<Object>} 刪除結果
   */
  async deleteDraft(draftId) {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    if (!draftId) {
      throw new Error('Draft ID is required');
    }

    return this.adapter.deleteDraft({
      userId: currentUser.id,
      draftId,
    });
  }

  /**
   * 獲取草稿詳情
   * @param {string} draftId - 草稿ID
   * @returns {Promise<Object>} 草稿詳情
   */
  async getDraftById(draftId) {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    if (!draftId) {
      throw new Error('Draft ID is required');
    }

    return this.adapter.getDraftById({
      userId: currentUser.id,
      draftId,
    });
  }

  /**
   * 發布草稿（轉換為正式內容）
   * @param {string} draftId - 草稿ID
   * @returns {Promise<Object>} 發布結果
   */
  async publishDraft(draftId) {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    if (!draftId) {
      throw new Error('Draft ID is required');
    }

    return this.adapter.publishDraft({
      userId: currentUser.id,
      draftId,
    });
  }
}

// 創建單例實例
const draftService = new DraftService();

export default draftService;
