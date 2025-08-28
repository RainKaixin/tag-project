// avatarService.js - 統一頭像服務
// 確保所有組件（右上角導航欄、個人檔案頁面）使用相同的數據源

import { clearAvatarCache } from '../utils/avatarCache';
import avatarStorage from '../utils/avatarStorage';
import { getCurrentUserId } from '../utils/currentUser';

/**
 * 統一的頭像數據獲取函數
 * 優先級：localStorage → IndexedDB → profile → mockUser
 * @param {string} userId - 用戶ID
 * @returns {Promise<string|null>} 頭像URL或null
 */
export const getUnifiedAvatar = async userId => {
  if (!userId) {
    console.warn('[avatarService] No userId provided');
    return null;
  }

  try {
    // 1. 優先從 localStorage 獲取（與右上角頭像使用相同邏輯）
    if (typeof window !== 'undefined') {
      const avatarData = window.localStorage.getItem(`tag.avatars.${userId}`);
      if (avatarData) {
        const parsedData = JSON.parse(avatarData);
        if (parsedData && parsedData.avatarUrl) {
          console.log(
            '[avatarService] Using avatar from localStorage:',
            parsedData.avatarUrl?.substring(0, 30)
          );
          return parsedData.avatarUrl;
        }
      }
    }

    // 2. 從 IndexedDB 獲取
    const avatarUrl = await avatarStorage.getAvatarUrl(userId);
    if (avatarUrl) {
      console.log(
        '[avatarService] Using avatar from IndexedDB:',
        avatarUrl?.substring(0, 30)
      );
      return avatarUrl;
    }

    // 3. 從 profile 數據獲取（如果需要）
    // 這裡可以添加從 profile 服務獲取的邏輯

    // 4. 回退到 mockUser 的默認頭像
    console.log('[avatarService] No avatar found, using default');
    return null;
  } catch (error) {
    console.error('[avatarService] Error getting unified avatar:', error);
    return null;
  }
};

/**
 * 統一的頭像更新函數
 * 同時更新所有存儲位置並觸發事件
 * @param {string} userId - 用戶ID
 * @param {string} avatarUrl - 新的頭像URL
 * @returns {Promise<boolean>} 是否成功
 */
export const updateUnifiedAvatar = async (userId, avatarUrl) => {
  if (!userId || !avatarUrl) {
    console.warn('[avatarService] Invalid parameters for avatar update');
    return false;
  }

  try {
    // 1. 清除舊的緩存
    clearAvatarCache(userId);

    // 2. 存儲到 IndexedDB
    await avatarStorage.storeAvatar(userId, avatarUrl);

    // 3. 存儲到 localStorage（確保右上角頭像能立即更新）
    if (typeof window !== 'undefined') {
      const avatarData = {
        avatarUrl,
        timestamp: Date.now(),
      };
      window.localStorage.setItem(
        `tag.avatars.${userId}`,
        JSON.stringify(avatarData)
      );
    }

    // 4. 觸發統一的事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('avatar:updated', {
          detail: {
            userId,
            avatarUrl,
            avatarUpdatedAt: new Date().toISOString(),
          },
        })
      );
    }

    console.log(
      '[avatarService] Successfully updated unified avatar for user:',
      userId
    );
    return true;
  } catch (error) {
    console.error('[avatarService] Error updating unified avatar:', error);
    return false;
  }
};

/**
 * 獲取當前用戶的統一頭像
 * @returns {Promise<string|null>} 頭像URL或null
 */
export const getCurrentUserAvatar = async () => {
  const userId = getCurrentUserId();
  return await getUnifiedAvatar(userId);
};

/**
 * 更新當前用戶的統一頭像
 * @param {string} avatarUrl - 新的頭像URL
 * @returns {Promise<boolean>} 是否成功
 */
export const updateCurrentUserAvatar = async avatarUrl => {
  const userId = getCurrentUserId();
  return await updateUnifiedAvatar(userId, avatarUrl);
};
