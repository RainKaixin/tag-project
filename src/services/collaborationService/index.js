// collaboration-service v1: 協作項目服務主入口
// 整合所有 Mock API 功能，提供統一的服務接口

import {
  allMockCollaborations,
  getCollaborationsByUser,
  getCollaborationsStats,
} from './mockData';
import {
  MOCK_STORAGE_KEYS,
  collaborationQueryOptions,
  apiResponseFormat,
} from './types';
import {
  formatFormDataForAPI,
  formatAPIDataForDetail,
  formatAPIDataForList,
  validateCollaborationData,
  sanitizeCollaborationData,
  generateCollaborationId,
} from './utils';

/**
 * 從 localStorage 獲取協作項目數據
 * @returns {Array} 協作項目列表
 */
const getCollaborationsFromStorage = () => {
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_KEYS.COLLABORATIONS);
    const parsed = stored ? JSON.parse(stored) : allMockCollaborations;

    // 调试：检查检索的数据
    console.log(
      '[getCollaborationsFromStorage] Retrieved collaborations:',
      parsed
    );
    if (parsed && parsed.length > 0) {
      console.log(
        '[getCollaborationsFromStorage] First collaboration roles:',
        parsed[0]?.roles
      );
    }

    return parsed;
  } catch (error) {
    console.error('Error reading collaborations from storage:', error);
    return allMockCollaborations;
  }
};

/**
 * 保存協作項目數據到 localStorage
 * @param {Array} collaborations - 協作項目列表
 */
const saveCollaborationsToStorage = collaborations => {
  try {
    localStorage.setItem(
      MOCK_STORAGE_KEYS.COLLABORATIONS,
      JSON.stringify(collaborations)
    );
  } catch (error) {
    console.error('Error saving collaborations to storage:', error);
  }
};

/**
 * 創建新的協作項目
 * @param {Object} formData - 表單數據
 * @returns {Object} API 響應
 */
export const createCollaboration = async formData => {
  try {
    // 驗證數據
    const validation = validateCollaborationData(formData);
    if (!validation.isValid) {
      return {
        ...apiResponseFormat,
        success: false,
        error: 'Validation failed',
        data: validation.errors,
      };
    }

    // 格式化數據
    const collaborationData = await formatFormDataForAPI(formData);
    collaborationData.id = generateCollaborationId();

    // 處理圖片：確保只保存圖片 key，不保存 blob URL
    if (formData.poster && formData.poster instanceof File) {
      // 生成圖片 key
      const imageKey = `collaboration_${collaborationData.id}_poster`;

      // 使用統一的圖片存儲服務
      try {
        const imageStorage = await import('../../utils/indexedDB.js');
        await imageStorage.default.storeImage(imageKey, formData.poster);

        // 只保存圖片 key，不保存 blob URL
        collaborationData.heroImage = imageKey;
        collaborationData.posterPreview = imageKey; // 添加 posterPreview 字段
        collaborationData.posterKey = imageKey;

        console.log(`[Collaboration] Stored image with key: ${imageKey}`);
      } catch (error) {
        console.error('[Collaboration] Failed to store image:', error);
        // 圖片存儲失敗不影響協作項目創建
      }
    }

    // 獲取現有數據
    const existingCollaborations = getCollaborationsFromStorage();

    // 添加新項目
    const updatedCollaborations = [
      collaborationData,
      ...existingCollaborations,
    ];

    // 调试：检查存储的数据
    console.log(
      '[createCollaboration] collaborationData to store:',
      collaborationData
    );
    console.log(
      '[createCollaboration] collaborationData.roles:',
      collaborationData.roles
    );

    // 保存到存儲
    saveCollaborationsToStorage(updatedCollaborations);

    return {
      ...apiResponseFormat,
      success: true,
      data: collaborationData,
      message: 'Collaboration created successfully',
    };
  } catch (error) {
    console.error('Error creating collaboration:', error);
    return {
      ...apiResponseFormat,
      success: false,
      error: error.message || 'Failed to create collaboration',
    };
  }
};

/**
 * 獲取協作項目列表
 * @param {Object} options - 查詢選項
 * @returns {Object} API 響應
 */
export const getCollaborations = async (options = {}) => {
  try {
    const queryOptions = { ...collaborationQueryOptions, ...options };
    let collaborations = getCollaborationsFromStorage();

    // 篩選邏輯
    if (queryOptions.authorId) {
      collaborations = collaborations.filter(
        c => c.author.id === queryOptions.authorId
      );
    }

    if (queryOptions.status) {
      collaborations = collaborations.filter(
        c => c.status === queryOptions.status
      );
    }

    if (queryOptions.searchTerm) {
      const searchTerm = queryOptions.searchTerm.toLowerCase();
      collaborations = collaborations.filter(
        c =>
          c.title.toLowerCase().includes(searchTerm) ||
          c.description.toLowerCase().includes(searchTerm) ||
          c.projectVision.toLowerCase().includes(searchTerm)
      );
    }

    // 排序邏輯
    collaborations.sort((a, b) => {
      const aValue = a[queryOptions.sortBy];
      const bValue = b[queryOptions.sortBy];

      if (queryOptions.sortOrder === 'desc') {
        return new Date(bValue) - new Date(aValue);
      } else {
        return new Date(aValue) - new Date(bValue);
      }
    });

    // 分頁邏輯
    const total = collaborations.length;
    const totalPages = Math.ceil(total / queryOptions.limit);
    const startIndex = (queryOptions.page - 1) * queryOptions.limit;
    const endIndex = startIndex + queryOptions.limit;
    const paginatedCollaborations = collaborations.slice(startIndex, endIndex);

    // 格式化為列表格式
    const formattedCollaborations = formatAPIDataForList(
      paginatedCollaborations
    );

    return {
      ...apiResponseFormat,
      success: true,
      data: formattedCollaborations,
      pagination: {
        page: queryOptions.page,
        limit: queryOptions.limit,
        total,
        totalPages,
        hasNext: queryOptions.page < totalPages,
        hasPrev: queryOptions.page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return {
      ...apiResponseFormat,
      success: false,
      error: error.message || 'Failed to fetch collaborations',
    };
  }
};

/**
 * 獲取協作項目詳情
 * @param {string} id - 協作項目ID
 * @returns {Object} API 響應
 */
export const getCollaborationById = async id => {
  try {
    const collaborations = getCollaborationsFromStorage();
    const collaboration = collaborations.find(c => c.id === id);

    if (!collaboration) {
      return {
        ...apiResponseFormat,
        success: false,
        error: 'Collaboration not found',
      };
    }

    // 增加瀏覽量
    collaboration.views = (collaboration.views || 0) + 1;
    saveCollaborationsToStorage(collaborations);

    // 格式化為詳情格式
    const formattedCollaboration = formatAPIDataForDetail(collaboration);

    return {
      ...apiResponseFormat,
      success: true,
      data: formattedCollaboration,
    };
  } catch (error) {
    console.error('Error fetching collaboration details:', error);
    return {
      ...apiResponseFormat,
      success: false,
      error: error.message || 'Failed to fetch collaboration details',
    };
  }
};

/**
 * 更新協作項目
 * @param {string} id - 協作項目ID
 * @param {Object} updateData - 更新數據
 * @returns {Object} API 響應
 */
export const updateCollaboration = async (id, updateData) => {
  try {
    const collaborations = getCollaborationsFromStorage();
    const index = collaborations.findIndex(c => c.id === id);

    if (index === -1) {
      return {
        ...apiResponseFormat,
        success: false,
        error: 'Collaboration not found',
      };
    }

    // 驗證數據
    const validation = validateCollaborationData(updateData);
    if (!validation.isValid) {
      return {
        ...apiResponseFormat,
        success: false,
        error: 'Validation failed',
        data: validation.errors,
      };
    }

    // 更新數據
    const sanitizedData = sanitizeCollaborationData(updateData);
    collaborations[index] = {
      ...collaborations[index],
      ...sanitizedData,
      updatedAt: new Date().toISOString(),
    };

    saveCollaborationsToStorage(collaborations);

    return {
      ...apiResponseFormat,
      success: true,
      data: collaborations[index],
      message: 'Collaboration updated successfully',
    };
  } catch (error) {
    console.error('Error updating collaboration:', error);
    return {
      ...apiResponseFormat,
      success: false,
      error: error.message || 'Failed to update collaboration',
    };
  }
};

/**
 * 刪除協作項目
 * @param {string} id - 協作項目ID
 * @returns {Object} API 響應
 */
export const deleteCollaboration = async id => {
  try {
    const collaborations = getCollaborationsFromStorage();
    const filteredCollaborations = collaborations.filter(c => c.id !== id);

    if (filteredCollaborations.length === collaborations.length) {
      return {
        ...apiResponseFormat,
        success: false,
        error: 'Collaboration not found',
      };
    }

    saveCollaborationsToStorage(filteredCollaborations);

    return {
      ...apiResponseFormat,
      success: true,
      message: 'Collaboration deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting collaboration:', error);
    return {
      ...apiResponseFormat,
      success: false,
      error: error.message || 'Failed to delete collaboration',
    };
  }
};

/**
 * 點讚協作項目
 * @param {string} id - 協作項目ID
 * @returns {Object} API 響應
 */
export const likeCollaboration = async id => {
  try {
    const collaborations = getCollaborationsFromStorage();
    const collaboration = collaborations.find(c => c.id === id);

    if (!collaboration) {
      return {
        ...apiResponseFormat,
        success: false,
        error: 'Collaboration not found',
      };
    }

    collaboration.likes = (collaboration.likes || 0) + 1;
    saveCollaborationsToStorage(collaborations);

    return {
      ...apiResponseFormat,
      success: true,
      data: { likes: collaboration.likes },
      message: 'Collaboration liked successfully',
    };
  } catch (error) {
    console.error('Error liking collaboration:', error);
    return {
      ...apiResponseFormat,
      success: false,
      error: error.message || 'Failed to like collaboration',
    };
  }
};

/**
 * 獲取協作項目統計信息
 * @returns {Object} API 響應
 */
export const getCollaborationStats = async () => {
  try {
    const stats = getCollaborationsStats();
    return {
      ...apiResponseFormat,
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Error fetching collaboration stats:', error);
    return {
      ...apiResponseFormat,
      success: false,
      error: error.message || 'Failed to fetch collaboration stats',
    };
  }
};

/**
 * 重置 Mock 數據
 * @returns {Object} API 響應
 */
export const resetMockData = async () => {
  try {
    saveCollaborationsToStorage(allMockCollaborations);
    return {
      ...apiResponseFormat,
      success: true,
      message: 'Mock data reset successfully',
    };
  } catch (error) {
    console.error('Error resetting mock data:', error);
    return {
      ...apiResponseFormat,
      success: false,
      error: error.message || 'Failed to reset mock data',
    };
  }
};
