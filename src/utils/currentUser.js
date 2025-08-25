import { storage } from '../services/storage/index';

import { getCachedAvatar, cacheAvatar } from './avatarCache.js';
import { getUserInfo } from './mockUsers.js';

const KEY = 'tag.currentUserId';

async function read() {
  try {
    if (typeof window === 'undefined') return null;
    return await storage.getItem(KEY);
  } catch {
    return null;
  }
}
async function write(v) {
  try {
    if (typeof window === 'undefined') return;
    await storage.setItem(KEY, v);
  } catch (error) {
    console.warn('Failed to write current user ID:', error);
  }
}
async function remove() {
  try {
    if (typeof window === 'undefined') return;
    await storage.removeItem(KEY);
  } catch (error) {
    console.warn('Failed to remove current user ID:', error);
  }
}

export const getCurrentUserId = () => {
  // 同步版本，用于兼容现有代码
  try {
    if (typeof window === 'undefined') return 'alice';

    // 检查新的统一键名
    let stored = window.localStorage.getItem(KEY);

    // 如果新键名没有值，检查旧键名并迁移
    if (!stored) {
      const oldKeys = [
        'tag_current_user_id',
        'currentUserId',
        'user_id',
        'tag.userId',
      ];

      for (const oldKey of oldKeys) {
        const oldValue = window.localStorage.getItem(oldKey);
        if (oldValue) {
          console.log(
            `[currentUser] Migrating from old key: ${oldKey} = ${oldValue}`
          );
          stored = oldValue;
          // 迁移到新键名
          window.localStorage.setItem(KEY, oldValue);
          // 删除旧键名
          window.localStorage.removeItem(oldKey);
          break;
        }
      }
    }

    // 如果仍然没有值，设置默认值
    if (!stored) {
      console.log('[currentUser] Setting default user ID: alice');
      window.localStorage.setItem(KEY, 'alice');
      stored = 'alice';
    }

    return stored;
  } catch (error) {
    console.warn('Failed to get current user ID:', error);
    return 'alice';
  }
};

export const getCurrentUser = () => {
  const userId = getCurrentUserId();
  const user = getUserInfo(userId);

  // 优先从 localStorage 获取最新的头像数据
  if (typeof window !== 'undefined') {
    try {
      const avatarData = window.localStorage.getItem(`tag.avatars.${userId}`);
      if (avatarData) {
        const parsedData = JSON.parse(avatarData);
        if (parsedData && parsedData.avatarUrl) {
          console.log(
            '[getCurrentUser] Found avatar in localStorage:',
            parsedData.avatarUrl?.substring(0, 30)
          );
          return {
            ...user,
            avatar: parsedData.avatarUrl,
          };
        }
      }
    } catch (error) {
      console.warn('[getCurrentUser] Failed to read avatar data:', error);
    }
  }

  // 回退到缓存的头像
  const cachedAvatar = getCachedAvatar(userId);
  if (cachedAvatar) {
    console.log(
      '[getCurrentUser] Using cached avatar:',
      cachedAvatar?.substring(0, 30)
    );
    return {
      ...user,
      avatar: cachedAvatar,
    };
  }

  // 缓存默认头像
  if (user.avatar) {
    cacheAvatar(userId, user.avatar);
  }

  console.log(
    '[getCurrentUser] Using default avatar:',
    user.avatar?.substring(0, 30)
  );
  return user;
};

export const setCurrentUserId = async userId => {
  await write(userId);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('user:changed', { detail: { userId } })
    );
  }
};

export const clearCurrentUserId = () => {
  remove();
};

export const getCurrentUserAvatar = () => {
  const user = getCurrentUser();
  return (
    user?.avatar || null // 移除默认头像
  );
};
