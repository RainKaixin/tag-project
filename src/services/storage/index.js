// storage/index.js - 统一存储适配器工厂
// 业务层只能从这里获取存储适配器，不得直接使用window.localStorage或indexedDB

// localStorage适配器实现
class LocalStorageAdapter {
  async getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to get ${key}:`, error);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to set ${key}:`, error);
      return false;
    }
  }

  async removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to remove ${key}:`, error);
      return false;
    }
  }

  async keys() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
      }
      return keys;
    } catch (error) {
      console.warn('[LocalStorageAdapter] Failed to get keys:', error);
      return [];
    }
  }

  async clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('[LocalStorageAdapter] Failed to clear:', error);
      return false;
    }
  }

  async init() {
    try {
      // 测试localStorage是否可用
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      const result = localStorage.getItem(testKey) === 'test';
      localStorage.removeItem(testKey);
      return result;
    } catch (error) {
      console.warn('[LocalStorageAdapter] Failed to initialize:', error);
      return false;
    }
  }
}

// 内存适配器实现（降级方案）
class MemoryStorageAdapter {
  constructor() {
    this.storage = new Map();
  }

  async getItem(key) {
    return this.storage.get(key) || null;
  }

  async setItem(key, value) {
    try {
      this.storage.set(key, value);
      return true;
    } catch (error) {
      console.warn(`[MemoryStorageAdapter] Failed to set ${key}:`, error);
      return false;
    }
  }

  async removeItem(key) {
    try {
      return this.storage.delete(key);
    } catch (error) {
      console.warn(`[MemoryStorageAdapter] Failed to remove ${key}:`, error);
      return false;
    }
  }

  async keys() {
    return Array.from(this.storage.keys());
  }

  async clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.warn('[MemoryStorageAdapter] Failed to clear:', error);
      return false;
    }
  }

  async init() {
    return true; // 内存存储总是可用的
  }
}

// 存储适配器工厂
class StorageAdapterFactory {
  static instance = null;

  static async getAdapter() {
    if (this.instance) {
      return this.instance;
    }

    // 环境切换规则：NODE_ENV !== 'production' ⇒ localStorageAdapter
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (isDevelopment) {
      console.log(
        '[StorageFactory] Development mode: using LocalStorageAdapter'
      );
      const adapter = new LocalStorageAdapter();

      // 测试localStorage是否可用
      const isAvailable = await adapter.init();
      if (isAvailable) {
        this.instance = adapter;
        return adapter;
      } else {
        console.warn(
          '[StorageFactory] LocalStorage not available, falling back to MemoryStorageAdapter'
        );
      }
    }

    // 降级到内存存储
    console.log('[StorageFactory] Using MemoryStorageAdapter');
    this.instance = new MemoryStorageAdapter();
    return this.instance;
  }

  static reset() {
    this.instance = null;
  }
}

// 导出统一的存储适配器
export const getStorageAdapter = StorageAdapterFactory.getAdapter.bind(
  StorageAdapterFactory
);

// 导出便捷方法
export const storage = {
  async getItem(key) {
    const adapter = await getStorageAdapter();
    return adapter.getItem(key);
  },

  async setItem(key, value) {
    const adapter = await getStorageAdapter();
    return adapter.setItem(key, value);
  },

  async removeItem(key) {
    const adapter = await getStorageAdapter();
    return adapter.removeItem(key);
  },

  async keys() {
    const adapter = await getStorageAdapter();
    return adapter.keys();
  },

  async clear() {
    const adapter = await getStorageAdapter();
    return adapter.clear();
  },

  async init() {
    const adapter = await getStorageAdapter();
    return adapter.init();
  },
};

// 图片存储策略：只存URL，不持久化二进制
class ImageStorage {
  constructor() {
    this.cache = new Map();
  }

  // 存储图片URL
  async storeImageUrl(key, url) {
    try {
      this.cache.set(key, url);
      return true;
    } catch (error) {
      console.warn(
        `[ImageStorage] Failed to store image URL for ${key}:`,
        error
      );
      return false;
    }
  }

  // 获取图片URL
  async getImageUrl(key) {
    try {
      return this.cache.get(key) || null;
    } catch (error) {
      console.warn(`[ImageStorage] Failed to get image URL for ${key}:`, error);
      return null;
    }
  }

  // 删除图片URL
  async removeImageUrl(key) {
    try {
      return this.cache.delete(key);
    } catch (error) {
      console.warn(
        `[ImageStorage] Failed to remove image URL for ${key}:`,
        error
      );
      return false;
    }
  }

  // 清空图片缓存
  async clearCache() {
    try {
      this.cache.clear();
      return true;
    } catch (error) {
      console.warn('[ImageStorage] Failed to clear cache:', error);
      return false;
    }
  }
}

export const imageStorage = new ImageStorage();

export default {
  getStorageAdapter,
  storage,
  imageStorage,
};
