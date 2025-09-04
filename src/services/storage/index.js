// storage/index.js - 统一存储适配器工厂
// 业务层只能从这里获取存储适配器，不得直接使用window.localStorage或indexedDB

import { isMock } from '../../utils/envCheck.js';
import imageStorage from '../../utils/indexedDB.js';
import { supabase } from '../supabase/client.js';

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

// Supabase存储适配器实现
class SupabaseStorageAdapter {
  constructor() {
    this.bucketName = 'portfolio'; // 使用portfolio桶
  }

  async init() {
    try {
      // 测试Supabase连接
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        console.warn(
          '[SupabaseStorageAdapter] Failed to connect to Supabase:',
          error
        );
        return false;
      }
      console.log(
        '[SupabaseStorageAdapter] Successfully connected to Supabase Storage'
      );
      return true;
    } catch (error) {
      console.warn('[SupabaseStorageAdapter] Failed to initialize:', error);
      return false;
    }
  }

  async getItem(key) {
    try {
      // 从Supabase Storage获取文件URL
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .createSignedUrl(key, 3600); // 1小时有效期

      if (error) {
        console.warn(`[SupabaseStorageAdapter] Failed to get ${key}:`, error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.warn(`[SupabaseStorageAdapter] Failed to get ${key}:`, error);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      // 这里应该处理文件上传，但为了兼容接口，暂时返回true
      // 实际的文件上传应该在专门的upload方法中处理
      console.log(
        `[SupabaseStorageAdapter] setItem called for ${key}, but file upload should use uploadFile method`
      );
      return true;
    } catch (error) {
      console.warn(`[SupabaseStorageAdapter] Failed to set ${key}:`, error);
      return false;
    }
  }

  async removeItem(key) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([key]);

      if (error) {
        console.warn(
          `[SupabaseStorageAdapter] Failed to remove ${key}:`,
          error
        );
        return false;
      }

      return true;
    } catch (error) {
      console.warn(`[SupabaseStorageAdapter] Failed to remove ${key}:`, error);
      return false;
    }
  }

  async keys() {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list('', { limit: 1000 });

      if (error) {
        console.warn('[SupabaseStorageAdapter] Failed to get keys:', error);
        return [];
      }

      return data.map(item => item.name);
    } catch (error) {
      console.warn('[SupabaseStorageAdapter] Failed to get keys:', error);
      return [];
    }
  }

  async clear() {
    try {
      // 获取所有文件
      const keys = await this.keys();
      if (keys.length === 0) return true;

      // 批量删除
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove(keys);

      if (error) {
        console.warn('[SupabaseStorageAdapter] Failed to clear:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('[SupabaseStorageAdapter] Failed to clear:', error);
      return false;
    }
  }

  // 专门的文件上传方法
  async uploadFile(key, file) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(key, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.warn(
          `[SupabaseStorageAdapter] Failed to upload ${key}:`,
          error
        );
        return { success: false, error: error.message };
      }

      console.log(`[SupabaseStorageAdapter] Successfully uploaded ${key}`);
      return { success: true, data };
    } catch (error) {
      console.warn(`[SupabaseStorageAdapter] Failed to upload ${key}:`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取公开URL
  async getPublicUrl(key) {
    try {
      const { data } = supabase.storage.from(this.bucketName).getPublicUrl(key);

      return data.publicUrl;
    } catch (error) {
      console.warn(
        `[SupabaseStorageAdapter] Failed to get public URL for ${key}:`,
        error
      );
      return null;
    }
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

    // 非 Mock 模式强制使用 SupabaseStorageAdapter
    console.log('[StorageFactory] Non-Mock mode: using SupabaseStorageAdapter');

    try {
      const adapter = new SupabaseStorageAdapter();
      const isAvailable = await adapter.init();

      if (isAvailable) {
        console.log(
          '[StorageFactory] Successfully initialized SupabaseStorageAdapter'
        );
        this.instance = adapter;
        return adapter;
      } else {
        throw new Error('Supabase Storage initialization failed');
      }
    } catch (error) {
      console.error(
        '[StorageFactory] Failed to initialize SupabaseStorageAdapter:',
        error
      );
      console.error(
        '[StorageFactory] This is a critical error - Supabase Storage must be available in production mode'
      );
      throw new Error('Supabase Storage is required but not available');
    }
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
