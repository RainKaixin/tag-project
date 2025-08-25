// resetData.js - 数据重置工具
// 用于清除所有浏览器数据并重新初始化，确保Firefox和Chrome数据一致

import { storage } from '../services/storage/index';

/**
 * 清除所有TAG相关的存储数据
 */
export const clearAllTAGData = async () => {
  try {
    console.log('[ResetData] Starting data reset...');

    // 获取所有存储键
    const allKeys = await storage.keys();
    console.log('[ResetData] Found keys:', allKeys);

    // 清除所有TAG相关的键
    const tagKeys = allKeys.filter(
      key =>
        key.startsWith('tag.') ||
        key.startsWith('user_') ||
        key.startsWith('artist_') ||
        key.startsWith('portfolio_') ||
        key.startsWith('tag_favorites') ||
        key.startsWith('tag_follows') ||
        key.startsWith('tag_service_data') ||
        key.includes('comment') ||
        key.includes('notification') ||
        key.includes('view') ||
        key.includes('like') ||
        key.includes('review') ||
        key.includes('collaboration') ||
        key.includes('avatar')
    );

    console.log('[ResetData] Clearing TAG keys:', tagKeys);

    // 逐个删除TAG相关的键
    for (const key of tagKeys) {
      await storage.removeItem(key);
      console.log(`[ResetData] Removed key: ${key}`);
    }

    // 清除localStorage中的相关数据（兼容性）
    if (typeof window !== 'undefined') {
      const localStorageKeys = Object.keys(localStorage);
      const localStorageTagKeys = localStorageKeys.filter(
        key =>
          key.startsWith('tag.') ||
          key.startsWith('user_') ||
          key.startsWith('artist_') ||
          key.startsWith('portfolio_') ||
          key.startsWith('tag_favorites') ||
          key.startsWith('tag_follows') ||
          key.startsWith('tag_service_data') ||
          key.includes('comment') ||
          key.includes('notification') ||
          key.includes('view') ||
          key.includes('like') ||
          key.includes('review') ||
          key.includes('collaboration') ||
          key.includes('avatar')
      );

      console.log(
        '[ResetData] Clearing localStorage TAG keys:',
        localStorageTagKeys
      );

      for (const key of localStorageTagKeys) {
        localStorage.removeItem(key);
        console.log(`[ResetData] Removed localStorage key: ${key}`);
      }
    }

    console.log('[ResetData] Data reset completed successfully');
    return { success: true, message: 'Data reset completed' };
  } catch (error) {
    console.error('[ResetData] Error during data reset:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 重置当前用户ID为alice
 */
export const resetCurrentUser = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tag.currentUserId', 'alice');
      console.log('[ResetData] Reset current user to alice');
    }
  } catch (error) {
    console.error('[ResetData] Error resetting current user:', error);
  }
};

/**
 * 强制重新初始化所有数据
 */
export const forceReinitialize = async () => {
  try {
    console.log('[ResetData] Force reinitializing all data...');

    // 1. 清除所有数据
    await clearAllTAGData();

    // 2. 重置当前用户
    resetCurrentUser();

    // 3. 重新加载页面以触发重新初始化
    if (typeof window !== 'undefined') {
      console.log('[ResetData] Reloading page to reinitialize...');
      window.location.reload();
    }

    return { success: true, message: 'Reinitialization triggered' };
  } catch (error) {
    console.error('[ResetData] Error during reinitialization:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 开发工具：在控制台添加重置函数
 */
export const addResetToConsole = () => {
  if (typeof window !== 'undefined') {
    window.resetTAGData = clearAllTAGData;
    window.resetTAGUser = resetCurrentUser;
    window.forceTAGReinit = forceReinitialize;
    console.log('[ResetData] Reset functions added to console:');
    console.log('- window.resetTAGData() - 清除所有TAG数据');
    console.log('- window.resetTAGUser() - 重置当前用户');
    console.log('- window.forceTAGReinit() - 强制重新初始化');
  }
};

// 自动添加重置函数到控制台
addResetToConsole();
