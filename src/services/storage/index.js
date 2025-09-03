// storage/index.js - 统一存储适配器工厂
// 业务层只能从这里获取存储适配器，不得直接使用window.localStorage或indexedDB

import { isMock } from '../../utils/envCheck.js';
import imageStorage from '../../utils/indexedDB.js';

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

    // Mock 模式使用 LocalStorageAdapter
    if (isMock()) {
      console.log('[StorageFactory] Mock mode: using LocalStorageAdapter');
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

    // 非 Mock 模式使用 Supabase（这里应该返回 SupabaseStorageAdapter）
    // TODO: 实现 SupabaseStorageAdapter
    console.log(
      '[StorageFactory] Non-Mock mode: should use SupabaseStorageAdapter'
    );

    // 临时降级到内存存储，直到 SupabaseStorageAdapter 实现
    console.log('[StorageFactory] Temporarily using MemoryStorageAdapter');
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

// 统一图片存储接口 - 重定向到 utils/indexedDB.js
// 确保所有地方都通过统一的 imageStore.getImageUrl(key) 获取图片地址

export { imageStorage };

export default {
  getStorageAdapter,
  storage,
  imageStorage,
};
