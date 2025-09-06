// 存儲監控組件
// 實時顯示存儲使用情況，提供清理控制界面

import React, { useState, useEffect, useCallback } from 'react';

import smartDataCleaner from '../../utils/smartDataCleaner.js';

const StorageMonitor = ({
  showDetails = false,
  showControls = false,
  className = '',
}) => {
  const [storageStats, setStorageStats] = useState({
    totalKeys: 0,
    totalSize: 0,
    usagePercentage: 0,
    strategies: {},
  });
  const [isCleaning, setIsCleaning] = useState(false);
  const [lastCleanup, setLastCleanup] = useState(null);
  const [showFullStats, setShowFullStats] = useState(showDetails);

  // 更新存儲統計
  const updateStats = useCallback(async () => {
    try {
      const stats = await smartDataCleaner.getCleanupStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('[StorageMonitor] Failed to get storage stats:', error);
    }
  }, []);

  // 手動清理
  const handleManualCleanup = useCallback(
    async (types = []) => {
      if (isCleaning) return;

      setIsCleaning(true);
      try {
        const result = await smartDataCleaner.manualCleanup(types);
        if (result.success) {
          setLastCleanup({
            timestamp: new Date(),
            cleanedCount: result.cleanedCount,
            freedSpace: result.freedSpace,
          });
          await updateStats();
        }
      } catch (error) {
        console.error('[StorageMonitor] Manual cleanup failed:', error);
      } finally {
        setIsCleaning(false);
      }
    },
    [isCleaning, updateStats]
  );

  // 格式化文件大小
  const formatSize = bytes => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // 獲取使用率顏色
  const getUsageColor = percentage => {
    if (percentage < 0.5) return 'text-green-600';
    if (percentage < 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 獲取使用率背景色
  const getUsageBgColor = percentage => {
    if (percentage < 0.5) return 'bg-green-500';
    if (percentage < 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 監聽清理事件
  useEffect(() => {
    const handleCleanupEvent = event => {
      setLastCleanup({
        timestamp: new Date(),
        cleanedCount: event.detail.cleanedCount,
        freedSpace: event.detail.freedSpace,
      });
      updateStats();
    };

    window.addEventListener('smartDataCleanup', handleCleanupEvent);
    return () =>
      window.removeEventListener('smartDataCleanup', handleCleanupEvent);
  }, [updateStats]);

  // 定期更新統計
  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 10000); // 10秒更新一次
    return () => clearInterval(interval);
  }, [updateStats]);

  return (
    <div className={`storage-monitor ${className}`}>
      {/* 基本存儲信息 */}
      <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
        <div className='flex items-center space-x-3'>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
            <span className='text-sm font-medium text-gray-700'>Storage</span>
          </div>
          <div className='text-sm text-gray-600'>
            {storageStats.totalKeys} items •{' '}
            {formatSize(storageStats.totalSize)}
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='w-16 h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div
              className={`h-full transition-all duration-300 ${getUsageBgColor(
                storageStats.usagePercentage
              )}`}
              style={{
                width: `${Math.min(storageStats.usagePercentage * 100, 100)}%`,
              }}
            />
          </div>
          <span
            className={`text-xs font-medium ${getUsageColor(
              storageStats.usagePercentage
            )}`}
          >
            {Math.round(storageStats.usagePercentage * 100)}%
          </span>
        </div>
      </div>

      {/* 詳細統計 */}
      {showFullStats && (
        <div className='mt-3 p-3 bg-white border rounded-lg'>
          <div className='flex items-center justify-between mb-3'>
            <h4 className='text-sm font-medium text-gray-700'>
              Storage Details
            </h4>
            <button
              onClick={() => setShowFullStats(false)}
              className='text-xs text-gray-500 hover:text-gray-700'
            >
              Hide
            </button>
          </div>

          <div className='space-y-2'>
            {Object.entries(storageStats.strategies).map(([key, strategy]) => (
              <div
                key={key}
                className='flex items-center justify-between text-xs'
              >
                <span className='text-gray-600'>{strategy.description}</span>
                <span className='text-gray-500'>
                  {strategy.count} items • {formatSize(strategy.size)}
                </span>
              </div>
            ))}
          </div>

          {lastCleanup && (
            <div className='mt-3 pt-3 border-t border-gray-200'>
              <div className='text-xs text-gray-500'>
                Last cleanup: {lastCleanup.timestamp.toLocaleTimeString()}
                {lastCleanup.cleanedCount > 0 && (
                  <span className='ml-2'>
                    • {lastCleanup.cleanedCount} items •{' '}
                    {formatSize(lastCleanup.freedSpace)} freed
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 控制按鈕 */}
      {showControls && (
        <div className='mt-3 flex flex-wrap gap-2'>
          <button
            onClick={() => setShowFullStats(!showFullStats)}
            className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors'
          >
            {showFullStats ? 'Hide Details' : 'Show Details'}
          </button>

          <button
            onClick={() => handleManualCleanup(['avatarCache', 'tempImages'])}
            disabled={isCleaning}
            className='px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors'
          >
            {isCleaning ? 'Cleaning...' : 'Quick Clean'}
          </button>

          <button
            onClick={() =>
              handleManualCleanup([
                'avatarCache',
                'tempImages',
                'oldCollaborations',
                'draftData',
              ])
            }
            disabled={isCleaning}
            className='px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 disabled:opacity-50 transition-colors'
          >
            {isCleaning ? 'Cleaning...' : 'Deep Clean'}
          </button>

          <button
            onClick={() =>
              handleManualCleanup(Object.keys(storageStats.strategies))
            }
            disabled={isCleaning}
            className='px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition-colors'
          >
            {isCleaning ? 'Cleaning...' : 'Full Clean'}
          </button>
        </div>
      )}

      {/* 警告信息 */}
      {storageStats.usagePercentage > 0.9 && (
        <div className='mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700'>
          ⚠️ Storage usage is very high. Consider cleaning up data to prevent
          performance issues.
        </div>
      )}
    </div>
  );
};

export default StorageMonitor;
