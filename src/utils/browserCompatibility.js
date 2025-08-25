// browserCompatibility.js - 浏览器兼容性检测和降级方案

/**
 * 浏览器兼容性检测器
 */
export class BrowserCompatibilityChecker {
  constructor() {
    this.capabilities = this.detectCapabilities();
  }

  /**
   * 检测浏览器能力
   */
  detectCapabilities() {
    const capabilities = {
      localStorage: this.testLocalStorage(),
      indexedDB: this.testIndexedDB(),
      fetch: this.testFetch(),
      cors: this.testCORS(),
      privateMode: this.detectPrivateMode(),
    };

    console.log('[BrowserCompatibility] Detected capabilities:', capabilities);
    return capabilities;
  }

  /**
   * 测试localStorage可用性
   */
  testLocalStorage() {
    try {
      const testKey = '__test_localStorage__';
      localStorage.setItem(testKey, 'test');
      const result = localStorage.getItem(testKey) === 'test';
      localStorage.removeItem(testKey);
      return result;
    } catch (error) {
      console.warn('[BrowserCompatibility] localStorage not available:', error);
      return false;
    }
  }

  /**
   * 测试IndexedDB可用性
   */
  testIndexedDB() {
    try {
      return 'indexedDB' in window && indexedDB !== null;
    } catch (error) {
      console.warn('[BrowserCompatibility] IndexedDB not available:', error);
      return false;
    }
  }

  /**
   * 测试fetch可用性
   */
  testFetch() {
    try {
      return 'fetch' in window && typeof fetch === 'function';
    } catch (error) {
      console.warn('[BrowserCompatibility] fetch not available:', error);
      return false;
    }
  }

  /**
   * 测试CORS支持
   */
  testCORS() {
    try {
      // 简单的CORS测试
      return 'cors' in new Request('https://example.com');
    } catch (error) {
      console.warn('[BrowserCompatibility] CORS test failed:', error);
      return false;
    }
  }

  /**
   * 检测隐私模式
   */
  detectPrivateMode() {
    try {
      // 尝试写入localStorage，如果失败可能是隐私模式
      const testKey = '__private_mode_test__';
      localStorage.setItem(testKey, 'test');
      const result = localStorage.getItem(testKey) === 'test';
      localStorage.removeItem(testKey);
      return !result;
    } catch (error) {
      return true; // 如果出错，假设是隐私模式
    }
  }

  /**
   * 获取兼容性状态
   */
  getCompatibilityStatus() {
    const { localStorage, indexedDB, fetch, cors, privateMode } = this.capabilities;
    
    if (privateMode) {
      return {
        level: 'warning',
        message: 'Private browsing mode detected. Some features may be limited.',
        recommendations: ['Use normal browsing mode for full functionality']
      };
    }

    if (!localStorage || !indexedDB) {
      return {
        level: 'error',
        message: 'Storage not available. Core features will not work.',
        recommendations: ['Enable cookies and storage', 'Use a supported browser']
      };
    }

    if (!fetch || !cors) {
      return {
        level: 'warning',
        message: 'Limited network capabilities. Some images may not load.',
        recommendations: ['Check network settings', 'Disable strict CORS policies']
      };
    }

    return {
      level: 'success',
      message: 'All features supported.',
      recommendations: []
    };
  }
}

/**
 * 数据降级管理器
 */
export class DataFallbackManager {
  constructor() {
    this.checker = new BrowserCompatibilityChecker();
  }

  /**
   * 获取安全的存储接口
   */
  getStorageInterface() {
    const { localStorage: lsAvailable, indexedDB: idbAvailable } = this.checker.capabilities;

    if (lsAvailable && idbAvailable) {
      return {
        type: 'full',
        localStorage: this.createSafeLocalStorage(),
        indexedDB: this.createSafeIndexedDB()
      };
    }

    if (lsAvailable) {
      return {
        type: 'localStorage_only',
        localStorage: this.createSafeLocalStorage(),
        indexedDB: this.createMockIndexedDB()
      };
    }

    return {
      type: 'memory_only',
      localStorage: this.createMemoryStorage(),
      indexedDB: this.createMockIndexedDB()
    };
  }

  /**
   * 创建安全的localStorage接口
   */
  createSafeLocalStorage() {
    return {
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.warn(`[SafeStorage] Failed to get ${key}:`, error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (error) {
          console.warn(`[SafeStorage] Failed to set ${key}:`, error);
          return false;
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
          return true;
        } catch (error) {
          console.warn(`[SafeStorage] Failed to remove ${key}:`, error);
          return false;
        }
      }
    };
  }

  /**
   * 创建安全的IndexedDB接口
   */
  createSafeIndexedDB() {
    return {
      getImageUrl: async (filePath) => {
        try {
          // 原有的IndexedDB逻辑
          const imageStorage = await import('./indexedDB.js');
          return await imageStorage.default.getImageUrl(filePath);
        } catch (error) {
          console.warn(`[SafeStorage] Failed to get image ${filePath}:`, error);
          return null;
        }
      }
    };
  }

  /**
   * 创建内存存储接口（降级方案）
   */
  createMemoryStorage() {
    const memory = new Map();
    
    return {
      getItem: (key) => {
        return memory.get(key) || null;
      },
      setItem: (key, value) => {
        memory.set(key, value);
        return true;
      },
      removeItem: (key) => {
        memory.delete(key);
        return true;
      }
    };
  }

  /**
   * 创建Mock IndexedDB接口
   */
  createMockIndexedDB() {
    return {
      getImageUrl: async (filePath) => {
        // 返回默认占位图片
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
      }
    };
  }
}

/**
 * 图片加载降级管理器
 */
export class ImageFallbackManager {
  constructor() {
    this.checker = new BrowserCompatibilityChecker();
  }

  /**
   * 安全的图片URL获取
   */
  async getSafeImageUrl(originalUrl, fallbackUrl = null) {
    if (!originalUrl) {
      return this.getDefaultPlaceholder();
    }

    // 如果是data URL，直接返回
    if (originalUrl.startsWith('data:')) {
      return originalUrl;
    }

    // 如果是相对路径，尝试从IndexedDB获取
    if (!originalUrl.startsWith('http')) {
      try {
        const imageStorage = await import('./indexedDB.js');
        const url = await imageStorage.default.getImageUrl(originalUrl);
        if (url) return url;
      } catch (error) {
        console.warn('[ImageFallback] Failed to get image from IndexedDB:', error);
      }
    }

    // 如果是外部URL，检查CORS支持
    if (originalUrl.startsWith('http') && this.checker.capabilities.cors) {
      try {
        const response = await fetch(originalUrl, { method: 'HEAD' });
        if (response.ok) {
          return originalUrl;
        }
      } catch (error) {
        console.warn('[ImageFallback] CORS check failed:', error);
      }
    }

    // 返回降级方案
    return fallbackUrl || this.getDefaultPlaceholder();
  }

  /**
   * 获取默认占位图片
   */
  getDefaultPlaceholder() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
  }
}

// 创建全局实例
export const browserChecker = new BrowserCompatibilityChecker();
export const fallbackManager = new DataFallbackManager();
export const imageFallbackManager = new ImageFallbackManager();

export default {
  BrowserCompatibilityChecker,
  DataFallbackManager,
  ImageFallbackManager,
  browserChecker,
  fallbackManager,
  imageFallbackManager
};
