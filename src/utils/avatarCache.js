// 头像缓存工具
const AVATAR_CACHE_KEY = 'tag.avatarCache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

// 获取缓存的头像
export const getCachedAvatar = userId => {
  try {
    if (typeof window === 'undefined') return null;

    const cache = JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY) || '{}');
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
    if (typeof window === 'undefined') return;

    const cache = JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY) || '{}');
    cache[userId] = {
      url,
      timestamp: Date.now(),
    };

    localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(cache));
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
      const cache = JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY) || '{}');
      delete cache[userId];
      localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(cache));

      // 清理头像存储数据
      localStorage.removeItem(`tag.avatars.${userId}`);

      console.log(`[clearAvatarCache] Cleared avatar data for user: ${userId}`);
    } else {
      // 清理所有头像相关数据
      localStorage.removeItem(AVATAR_CACHE_KEY);

      // 清理所有 tag.avatars.* 数据
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('tag.avatars.')) {
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
