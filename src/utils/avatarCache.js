// 头像缓存工具
import { isMock } from './envCheck.js';

// 获取用户命名空间前缀
const getUserNamespace = userId => {
  // 如果没有 userId，返回 null（不再使用默认用户）
  if (!userId) {
    return null;
  }
  return `u.${userId}`;
};

const getAvatarCacheKey = userId => {
  const namespace = getUserNamespace(userId);
  return `${namespace}.avatarCache`;
};

const getAvatarStorageKey = userId => {
  const namespace = getUserNamespace(userId);
  return `${namespace}.avatar`;
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

// 获取缓存的头像
export const getCachedAvatar = userId => {
  try {
    if (typeof window === 'undefined' || !userId) return null;

    const cacheKey = getAvatarCacheKey(userId);
    if (!cacheKey) return null; // 如果无法生成缓存键，返回 null

    const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    const cached = cache[userId];

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.url;
    }

    return null;
  } catch (error) {
    console.warn('Error reading avatar cache:', error);
    return null;
  }
};

// 缓存头像
export const cacheAvatar = (userId, url) => {
  try {
    if (typeof window === 'undefined' || !userId) return;

    const cacheKey = getAvatarCacheKey(userId);
    if (!cacheKey) return; // 如果无法生成缓存键，直接返回

    const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    cache[userId] = {
      url,
      timestamp: Date.now(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(cache));
  } catch (error) {
    console.warn('Error caching avatar:', error);
  }
};

// 清除头像缓存
export const clearAvatarCache = (userId = null) => {
  try {
    if (typeof window === 'undefined') return;

    if (userId) {
      // 清理头像缓存
      const cacheKey = getAvatarCacheKey(userId);
      const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
      delete cache[userId];
      localStorage.setItem(cacheKey, JSON.stringify(cache));

      // 清理头像存储数据
      const avatarStorageKey = getAvatarStorageKey(userId);
      localStorage.removeItem(avatarStorageKey);

      console.log(`[clearAvatarCache] Cleared avatar data for user: ${userId}`);
    } else {
      // 清理所有头像相关数据
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('.avatarCache') || key.includes('.avatar')) {
          localStorage.removeItem(key);
        }
      });

      console.log('[clearAvatarCache] Cleared all avatar data');
    }
  } catch (error) {
    console.warn('Error clearing avatar cache:', error);
  }
};

// 预加载头像
export const preloadAvatar = url => {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(null);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error('Failed to load avatar'));
    img.src = url;
  });
};

// 检查 localStorage 状态
export const checkLocalStorageStatus = () => {
  try {
    if (typeof window === 'undefined') {
      return { available: false, reason: 'Server-side rendering' };
    }

    // 检查 localStorage 是否可用
    const testKey = 'tag.storage.test';
    const testValue = 'test';

    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    if (retrieved !== testValue) {
      return { available: false, reason: 'Read/write test failed' };
    }

    // 检查存储配额
    const quotaTestKey = 'tag.quota.test';
    const largeData = 'x'.repeat(1024 * 1024); // 1MB 测试数据

    try {
      localStorage.setItem(quotaTestKey, largeData);
      localStorage.removeItem(quotaTestKey);
      return { available: true, quota: 'OK' };
    } catch (quotaError) {
      return {
        available: false,
        reason: 'Quota exceeded',
        error: quotaError.message,
      };
    }
  } catch (error) {
    return {
      available: false,
      reason: 'localStorage not available',
      error: error.message,
    };
  }
};
