// storage/index.ts - 统一存储适配器工厂
// 业务层只能从这里获取存储适配器，不得直接使用window.localStorage或indexedDB

// 存储适配器接口
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<boolean>;
  removeItem(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
  clear(): Promise<boolean>;
  init(): Promise<boolean>;
}

// localStorage适配器实现
class LocalStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to get ${key}:`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<boolean> {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to set ${key}:`, error);
      return false;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to remove ${key}:`, error);
      return false;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
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

  async clear(): Promise<boolean> {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('[LocalStorageAdapter] Failed to clear:', error);
      return false;
    }
  }

  async init(): Promise<boolean> {
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
class MemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<boolean> {
    try {
      this.storage.set(key, value);
      return true;
    } catch (error) {
      console.warn(`[MemoryStorageAdapter] Failed to set ${key}:`, error);
      return false;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      return this.storage.delete(key);
    } catch (error) {
      console.warn(`[MemoryStorageAdapter] Failed to remove ${key}:`, error);
      return false;
    }
  }

  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async clear(): Promise<boolean> {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.warn('[MemoryStorageAdapter] Failed to clear:', error);
      return false;
    }
  }

  async init(): Promise<boolean> {
    return true; // 内存存储总是可用的
  }
}

// 存储适配器工厂
class StorageAdapterFactory {
  private static instance: StorageAdapter | null = null;

  static async getAdapter(): Promise<StorageAdapter> {
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

  static reset(): void {
    this.instance = null;
  }
}

// 导出统一的存储适配器
export const getStorageAdapter = StorageAdapterFactory.getAdapter.bind(
  StorageAdapterFactory
);

// 导出便捷方法
export const storage = {
  async getItem(key: string): Promise<string | null> {
    const adapter = await getStorageAdapter();
    return adapter.getItem(key);
  },

  async setItem(key: string, value: string): Promise<boolean> {
    const adapter = await getStorageAdapter();
    return adapter.setItem(key, value);
  },

  async removeItem(key: string): Promise<boolean> {
    const adapter = await getStorageAdapter();
    return adapter.removeItem(key);
  },

  async keys(): Promise<string[]> {
    const adapter = await getStorageAdapter();
    return adapter.keys();
  },

  async clear(): Promise<boolean> {
    const adapter = await getStorageAdapter();
    return adapter.clear();
  },

  async init(): Promise<boolean> {
    const adapter = await getStorageAdapter();
    return adapter.init();
  },
};

// 图片存储策略：只存URL，不持久化二进制
class ImageStorage {
  private cache = new Map<string, string>();

  // 存储图片URL
  async storeImageUrl(key: string, url: string): Promise<boolean> {
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
  async getImageUrl(key: string): Promise<string | null> {
    try {
      return this.cache.get(key) || null;
    } catch (error) {
      console.warn(`[ImageStorage] Failed to get image URL for ${key}:`, error);
      return null;
    }
  }

  // 删除图片URL
  async removeImageUrl(key: string): Promise<boolean> {
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
  async clearCache(): Promise<boolean> {
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
