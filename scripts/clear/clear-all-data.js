// 彻底清理所有数据脚本
// 用于功能测试阶段，清除所有浏览器缓存和本地存储
// 集成智能清理策略，优先清理非关键数据

import smartDataCleaner from '../../src/utils/smartDataCleaner.js';

console.log('🧹 开始清理所有浏览器数据...');

// 清理 localStorage
function clearLocalStorage() {
  console.log('📦 清理 localStorage...');
  const keys = Object.keys(localStorage);
  let clearedCount = 0;

  keys.forEach(key => {
    if (
      key.startsWith('tag.') ||
      key.startsWith('portfolio_') ||
      key.includes('avatar') ||
      key.includes('profile') ||
      key.includes('work') ||
      key.includes('collaboration') ||
      key.includes('favorite')
    ) {
      localStorage.removeItem(key);
      clearedCount++;
    }
  });

  console.log(`✅ 清理了 ${clearedCount} 个 localStorage 项目`);
}

// 清理 IndexedDB
async function clearIndexedDB() {
  console.log('🗄️ 清理 IndexedDB...');

  try {
    // 清理图片存储
    const imageDB = indexedDB.deleteDatabase('ImageStorage');
    imageDB.onsuccess = () => console.log('✅ 清理了 ImageStorage 数据库');
    imageDB.onerror = () => console.log('❌ 清理 ImageStorage 失败');

    // 清理头像存储
    const avatarDB = indexedDB.deleteDatabase('AvatarStorage');
    avatarDB.onsuccess = () => console.log('✅ 清理了 AvatarStorage 数据库');
    avatarDB.onerror = () => console.log('❌ 清理 AvatarStorage 失败');

    // 清理其他可能的数据库
    const otherDBs = ['TAGDatabase', 'PortfolioDB', 'UserDB'];
    otherDBs.forEach(dbName => {
      const db = indexedDB.deleteDatabase(dbName);
      db.onsuccess = () => console.log(`✅ 清理了 ${dbName} 数据库`);
      db.onerror = () => console.log(`❌ 清理 ${dbName} 失败`);
    });
  } catch (error) {
    console.error('❌ 清理 IndexedDB 时出错:', error);
  }
}

// 清理 sessionStorage
function clearSessionStorage() {
  console.log('💾 清理 sessionStorage...');
  sessionStorage.clear();
  console.log('✅ 清理了 sessionStorage');
}

// 清理 cookies
function clearCookies() {
  console.log('🍪 清理 cookies...');
  const cookies = document.cookie.split(';');

  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (
      name.startsWith('tag_') ||
      name.includes('auth') ||
      name.includes('user')
    ) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });

  console.log('✅ 清理了相关 cookies');
}

// 清理缓存
async function clearCache() {
  console.log('🗑️ 清理缓存...');

  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.includes('tag') || cacheName.includes('image')) {
            return caches.delete(cacheName);
          }
        })
      );
      console.log('✅ 清理了相关缓存');
    }
  } catch (error) {
    console.error('❌ 清理缓存时出错:', error);
  }
}

// 智能清理函数 - 使用智能清理策略
async function smartCleanup() {
  console.log('🧠 开始智能数据清理...');

  try {
    // 获取清理前的统计
    const beforeStats = await smartDataCleaner.getCleanupStats();
    console.log(
      `📊 清理前: ${beforeStats.totalKeys} items, ${(
        beforeStats.totalSize / 1024
      ).toFixed(1)}KB`
    );

    // 执行智能清理
    const result = await smartDataCleaner.manualCleanup([
      'avatarCache',
      'tempImages',
      'oldCollaborations',
      'draftData',
      'portfolioCache',
      'notificationCache',
      'generalCache',
    ]);

    if (result.success) {
      console.log(
        `✅ 智能清理完成: ${result.cleanedCount} items, ${(
          result.freedSpace / 1024
        ).toFixed(1)}KB freed`
      );
    } else {
      console.error('❌ 智能清理失败:', result.error);
    }

    // 获取清理后的统计
    const afterStats = await smartDataCleaner.getCleanupStats();
    console.log(
      `📊 清理后: ${afterStats.totalKeys} items, ${(
        afterStats.totalSize / 1024
      ).toFixed(1)}KB`
    );
  } catch (error) {
    console.error('❌ 智能清理出错:', error);
  }
}

// 主清理函数
async function clearAllData() {
  console.log('🚀 开始全面数据清理...');

  // 首先尝试智能清理
  await smartCleanup();

  // 然后执行传统清理
  clearLocalStorage();
  clearSessionStorage();
  clearCookies();
  await clearCache();
  await clearIndexedDB();

  console.log('🎉 数据清理完成！');
  console.log('💡 建议：刷新页面以确保所有更改生效');

  // 显示清理结果
  setTimeout(() => {
    console.log('\n📊 清理结果检查:');
    console.log(`localStorage 项目数: ${Object.keys(localStorage).length}`);
    console.log(`sessionStorage 项目数: ${Object.keys(sessionStorage).length}`);
    console.log(
      `cookies 数量: ${document.cookie.split(';').filter(c => c.trim()).length}`
    );
  }, 1000);
}

// 执行清理
clearAllData();

// 导出函数供外部调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clearAllData, clearLocalStorage, clearIndexedDB };
}
