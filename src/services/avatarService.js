// avatarService.js - 統一頭像服務
// 確保所有組件（右上角導航欄、個人檔案頁面）使用相同的數據源

import { clearAvatarCache } from '../utils/avatarCache';
import avatarStorage from '../utils/avatarStorage';
import { getCurrentUserId } from '../utils/currentUser';

/**
 * 验证头像URL是否有效
 * @param {string} url - 头像URL
 * @returns {boolean} 是否有效
 */
const isValidAvatarUrl = url => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // 检查是否是完整的URL
  if (url.startsWith('http')) {
    // 检查URL是否完整（至少包含域名和协议）
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.length > 0 && urlObj.protocol.startsWith('http');
    } catch {
      return false;
    }
  }

  // 检查Data URL格式
  if (url.startsWith('data:image/')) {
    return url.length > 100; // Data URL应该足够长
  }

  return false;
};

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
    console.log(`[avatarService] Getting unified avatar for user: ${userId}`);

    // 1. 優先從 localStorage 獲取（與右上角頭像使用相同邏輯）
    if (typeof window !== 'undefined') {
      const avatarData = window.localStorage.getItem(`tag.avatars.${userId}`);
      if (avatarData) {
        try {
          const parsedData = JSON.parse(avatarData);
          if (parsedData && parsedData.avatarUrl) {
            // 验证URL有效性
            const avatarUrl = parsedData.avatarUrl;
            if (isValidAvatarUrl(avatarUrl)) {
              console.log(
                `[avatarService] Found valid avatar in localStorage for ${userId}:`,
                avatarUrl?.substring(0, 30)
              );
              return avatarUrl;
            } else {
              console.warn(
                `[avatarService] Found invalid avatar URL in localStorage for ${userId}:`,
                avatarUrl?.substring(0, 30)
              );
              // 清除损坏的缓存
              window.localStorage.removeItem(`tag.avatars.${userId}`);
            }
          }
        } catch (parseError) {
          console.warn(
            `[avatarService] Failed to parse localStorage avatar data for ${userId}:`,
            parseError
          );
          // 清除损坏的缓存
          window.localStorage.removeItem(`tag.avatars.${userId}`);
        }
      }
    }

    // 2. 從 IndexedDB 獲取
    const avatarUrl = await avatarStorage.getAvatarUrl(userId);
    if (avatarUrl) {
      console.log(
        `[avatarService] Found avatar in IndexedDB for ${userId}:`,
        avatarUrl?.substring(0, 30)
      );
      return avatarUrl;
    }

    // 3. 從 profile 數據獲取（Supabase profile）
    try {
      const { getProfile } = await import('./supabase/userProfileService.js');
      const profileResult = await getProfile(userId);
      if (profileResult?.success && profileResult?.data?.avatar) {
        console.log(
          `[avatarService] Found avatar in Supabase profile for ${userId}:`,
          profileResult.data.avatar?.substring(0, 30)
        );
        return profileResult.data.avatar;
      }
    } catch (profileError) {
      console.warn(
        `[avatarService] Failed to get profile for ${userId}:`,
        profileError
      );
    }

    // 4. 回退到默認頭像（使用統一的默認頭像）
    console.log(
      `[avatarService] No avatar found for user ${userId}, using default`
    );
    return getDefaultAvatar();
  } catch (error) {
    console.error(
      `[avatarService] Error getting unified avatar for ${userId}:`,
      error
    );
    return getDefaultAvatar();
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
    const storageResult = await avatarStorage.storeAvatar(userId, avatarUrl);

    // 如果存储被跳过（比如HTTP URL下载失败），我们仍然继续流程
    if (storageResult.skipped) {
      console.log(
        '[avatarService] Avatar storage skipped, but continuing with update flow'
      );
    }

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
  const userId = await getCurrentUserId();
  return await getUnifiedAvatar(userId);
};

/**
 * 更新當前用戶的統一頭像
 * @param {string} avatarUrl - 新的頭像URL
 * @returns {Promise<boolean>} 是否成功
 */
export const updateCurrentUserAvatar = async avatarUrl => {
  const userId = await getCurrentUserId();
  return await updateUnifiedAvatar(userId, avatarUrl);
};

/**
 * 獲取默認頭像
 * @returns {string} 默認頭像的 Data URL
 */
const getDefaultAvatar = () => {
  // 使用統一的默認頭像 SVG
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIzMiIgeT0iMjQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOEM5Q0E2Ij4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+';
};
