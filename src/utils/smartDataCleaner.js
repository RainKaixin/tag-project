// 智能數據清理管理器
// 自動監控存儲配額，預防性清理過期數據，避免系統卡死

class SmartDataCleaner {
  constructor() {
    this.quotaThreshold = 0.8; // 80% 配額時開始清理
    this.cleanupInterval = 30000; // 30秒檢查一次
    this.maxRetries = 3;
    this.isCleaning = false;
    this.cleanupStrategies = {
      // 清理優先級：數字越小優先級越高
      avatarCache: {
        priority: 1,
        pattern: /\.avatarCache|\.avatar/,
        description: 'Avatar Cache',
      },
      tempImages: {
        priority: 2,
        pattern: /temp_|_temp/,
        description: 'Temporary Images',
      },
      oldCollaborations: {
        priority: 3,
        pattern: /collaboration_old|old_collaboration/,
        description: 'Old Collaborations',
      },
      draftData: {
        priority: 4,
        pattern: /draft_|_draft/,
        description: 'Draft Data',
      },
      portfolioCache: {
        priority: 5,
        pattern: /portfolio_cache|portfolio_alice|portfolio_bryan/,
        description: 'Portfolio Cache',
      },
      notificationCache: {
        priority: 6,
        pattern: /notification_cache|notifications_old/,
        description: 'Notification Cache',
      },
      generalCache: {
        priority: 7,
        pattern: /cache_|_cache/,
        description: 'General Cache',
      },
    };
  }

  // 初始化清理器
  async init() {
    console.log('[SmartDataCleaner] Initializing...');

    // 檢查瀏覽器支持
    if (!this.isStorageSupported()) {
      console.warn(
        '[SmartDataCleaner] Storage not supported, skipping initialization'
      );
      return false;
    }

    // 開始定期檢查
    this.startMonitoring();

    // 立即檢查一次
    await this.checkAndCleanup();

    console.log('[SmartDataCleaner] Initialized successfully');
    return true;
  }

  // 檢查存儲支持
  isStorageSupported() {
    try {
      return typeof Storage !== 'undefined' && localStorage !== null;
    } catch (error) {
      return false;
    }
  }

  // 開始監控
  startMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(async () => {
      await this.checkAndCleanup();
    }, this.cleanupInterval);
  }

  // 停止監控
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  // 檢查並清理
  async checkAndCleanup() {
    if (this.isCleaning) {
      return; // 避免重複清理
    }

    try {
      const usage = await this.getStorageUsage();
      console.log(
        `[SmartDataCleaner] Storage usage: ${(usage.percentage * 100).toFixed(
          1
        )}%`
      );

      if (usage.percentage >= this.quotaThreshold) {
        console.warn(
          `[SmartDataCleaner] Storage quota exceeded threshold (${
            this.quotaThreshold * 100
          }%), starting cleanup...`
        );
        await this.performCleanup();
      }
    } catch (error) {
      console.error('[SmartDataCleaner] Error during cleanup check:', error);
    }
  }

  // 獲取存儲使用情況
  async getStorageUsage() {
    try {
      // 估算 localStorage 使用量
      let totalSize = 0;
      const keys = Object.keys(localStorage);

      for (const key of keys) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }

      // 估算配額（通常為 5-10MB）
      const estimatedQuota = 5 * 1024 * 1024; // 5MB
      const percentage = totalSize / estimatedQuota;

      return {
        used: totalSize,
        quota: estimatedQuota,
        percentage: Math.min(percentage, 1),
        keys: keys.length,
      };
    } catch (error) {
      console.error(
        '[SmartDataCleaner] Error calculating storage usage:',
        error
      );
      return { used: 0, quota: 0, percentage: 0, keys: 0 };
    }
  }

  // 執行清理
  async performCleanup() {
    if (this.isCleaning) {
      return;
    }

    this.isCleaning = true;
    console.log('[SmartDataCleaner] Starting cleanup process...');

    try {
      const initialUsage = await this.getStorageUsage();
      let cleanedCount = 0;
      let freedSpace = 0;

      // 按優先級清理
      const sortedStrategies = Object.entries(this.cleanupStrategies).sort(
        ([, a], [, b]) => a.priority - b.priority
      );

      for (const [, strategy] of sortedStrategies) {
        const result = await this.cleanupByStrategy(strategy);
        cleanedCount += result.count;
        freedSpace += result.freedSpace;

        console.log(
          `[SmartDataCleaner] ${strategy.description}: cleaned ${
            result.count
          } items, freed ${(result.freedSpace / 1024).toFixed(1)}KB`
        );

        // 檢查是否已經足夠
        const currentUsage = await this.getStorageUsage();
        if (currentUsage.percentage < this.quotaThreshold * 0.7) {
          console.log(
            '[SmartDataCleaner] Cleanup target reached, stopping early'
          );
          break;
        }
      }

      const finalUsage = await this.getStorageUsage();
      const totalFreed = initialUsage.used - finalUsage.used;

      console.log(
        `[SmartDataCleaner] Cleanup completed: ${cleanedCount} items cleaned, ${(
          totalFreed / 1024
        ).toFixed(1)}KB freed`
      );
      console.log(
        `[SmartDataCleaner] Storage usage: ${(
          initialUsage.percentage * 100
        ).toFixed(1)}% → ${(finalUsage.percentage * 100).toFixed(1)}%`
      );

      // 觸發清理完成事件
      this.dispatchCleanupEvent({
        cleanedCount,
        freedSpace: totalFreed,
        initialUsage: initialUsage.percentage,
        finalUsage: finalUsage.percentage,
      });
    } catch (error) {
      console.error('[SmartDataCleaner] Error during cleanup:', error);
    } finally {
      this.isCleaning = false;
    }
  }

  // 按策略清理
  async cleanupByStrategy(strategy) {
    let cleanedCount = 0;
    let freedSpace = 0;

    try {
      const keys = Object.keys(localStorage);

      for (const key of keys) {
        if (strategy.pattern.test(key)) {
          const value = localStorage.getItem(key);
          if (value) {
            freedSpace += key.length + value.length;
            localStorage.removeItem(key);
            cleanedCount++;
          }
        }
      }
    } catch (error) {
      console.error(
        `[SmartDataCleaner] Error cleaning ${strategy.description}:`,
        error
      );
    }

    return { count: cleanedCount, freedSpace };
  }

  // 手動清理指定類型
  async manualCleanup(types = []) {
    console.log('[SmartDataCleaner] Manual cleanup requested for:', types);

    if (this.isCleaning) {
      console.warn('[SmartDataCleaner] Cleanup already in progress');
      return;
    }

    this.isCleaning = true;

    try {
      let totalCleaned = 0;
      let totalFreed = 0;

      for (const type of types) {
        if (this.cleanupStrategies[type]) {
          const result = await this.cleanupByStrategy(
            this.cleanupStrategies[type]
          );
          totalCleaned += result.count;
          totalFreed += result.freedSpace;
        }
      }

      console.log(
        `[SmartDataCleaner] Manual cleanup completed: ${totalCleaned} items, ${(
          totalFreed / 1024
        ).toFixed(1)}KB freed`
      );

      return {
        success: true,
        cleanedCount: totalCleaned,
        freedSpace: totalFreed,
      };
    } catch (error) {
      console.error('[SmartDataCleaner] Manual cleanup failed:', error);
      return {
        success: false,
        error: error.message,
      };
    } finally {
      this.isCleaning = false;
    }
  }

  // 獲取清理統計
  async getCleanupStats() {
    const usage = await this.getStorageUsage();
    const keys = Object.keys(localStorage);

    const stats = {
      totalKeys: keys.length,
      totalSize: usage.used,
      usagePercentage: usage.percentage,
      strategies: {},
    };

    // 統計各策略的數據量
    for (const [strategyName, strategy] of Object.entries(
      this.cleanupStrategies
    )) {
      let count = 0;
      let size = 0;

      for (const key of keys) {
        if (strategy.pattern.test(key)) {
          const value = localStorage.getItem(key);
          if (value) {
            count++;
            size += key.length + value.length;
          }
        }
      }

      stats.strategies[strategyName] = {
        count,
        size,
        description: strategy.description,
      };
    }

    return stats;
  }

  // 觸發清理事件
  dispatchCleanupEvent(details) {
    const event = new CustomEvent('smartDataCleanup', {
      detail: {
        timestamp: new Date().toISOString(),
        ...details,
      },
    });
    window.dispatchEvent(event);
  }

  // 銷毀清理器
  destroy() {
    this.stopMonitoring();
    this.isCleaning = false;
    console.log('[SmartDataCleaner] Destroyed');
  }
}

// 創建單例實例
const smartDataCleaner = new SmartDataCleaner();

// 自動初始化
if (typeof window !== 'undefined') {
  smartDataCleaner.init().catch(error => {
    console.error('[SmartDataCleaner] Failed to initialize:', error);
  });
}

export default smartDataCleaner;
