// 智能數據清理器測試腳本
// 用於驗證清理機制是否正常工作

import smartDataCleaner from '../src/utils/smartDataCleaner.js';

console.log('🧪 開始測試智能數據清理器...');

// 測試數據生成
function generateTestData() {
  console.log('📝 生成測試數據...');

  // 生成各種類型的測試數據
  const testData = {
    avatarCache: {},
    tempImages: {},
    oldCollaborations: {},
    draftData: {},
    portfolioCache: {},
    notificationCache: {},
    generalCache: {},
  };

  // 生成頭像緩存數據
  for (let i = 0; i < 10; i++) {
    testData.avatarCache[`user_${i}.avatarCache`] =
      'data:image/jpeg;base64,' + 'x'.repeat(1000);
  }

  // 生成臨時圖片數據
  for (let i = 0; i < 15; i++) {
    testData.tempImages[`temp_image_${i}`] =
      'data:image/png;base64,' + 'y'.repeat(2000);
  }

  // 生成舊協作數據
  for (let i = 0; i < 5; i++) {
    testData.oldCollaborations[`collaboration_old_${i}`] = JSON.stringify({
      id: i,
      title: `Old Collaboration ${i}`,
      data: 'x'.repeat(5000),
    });
  }

  // 生成草稿數據
  for (let i = 0; i < 8; i++) {
    testData.draftData[`draft_${i}`] = JSON.stringify({
      id: i,
      content: 'x'.repeat(3000),
    });
  }

  // 生成作品集緩存
  testData.portfolioCache['portfolio_alice'] = JSON.stringify({
    user: 'alice',
    works: Array(20)
      .fill()
      .map((_, i) => ({
        id: i,
        image: 'data:image/jpeg;base64,' + 'z'.repeat(1000),
      })),
  });

  // 生成通知緩存
  testData.notificationCache['notification_cache'] = JSON.stringify({
    notifications: Array(50)
      .fill()
      .map((_, i) => ({
        id: i,
        message: `Notification ${i}`,
        timestamp: Date.now(),
      })),
  });

  // 生成通用緩存
  for (let i = 0; i < 12; i++) {
    testData.generalCache[`cache_${i}`] = 'x'.repeat(1000);
  }

  // 將測試數據存儲到 localStorage
  Object.entries(testData).forEach(([category, data]) => {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  });

  console.log('✅ 測試數據生成完成');
  return testData;
}

// 測試清理功能
async function testCleanup() {
  console.log('🧹 測試清理功能...');

  try {
    // 獲取清理前統計
    const beforeStats = await smartDataCleaner.getCleanupStats();
    console.log('📊 清理前統計:', {
      totalKeys: beforeStats.totalKeys,
      totalSize: `${(beforeStats.totalSize / 1024).toFixed(1)}KB`,
      usagePercentage: `${(beforeStats.usagePercentage * 100).toFixed(1)}%`,
    });

    // 執行清理
    const result = await smartDataCleaner.manualCleanup([
      'avatarCache',
      'tempImages',
      'oldCollaborations',
      'draftData',
    ]);

    if (result.success) {
      console.log('✅ 清理成功:', {
        cleanedCount: result.cleanedCount,
        freedSpace: `${(result.freedSpace / 1024).toFixed(1)}KB`,
      });
    } else {
      console.error('❌ 清理失敗:', result.error);
    }

    // 獲取清理後統計
    const afterStats = await smartDataCleaner.getCleanupStats();
    console.log('📊 清理後統計:', {
      totalKeys: afterStats.totalKeys,
      totalSize: `${(afterStats.totalSize / 1024).toFixed(1)}KB`,
      usagePercentage: `${(afterStats.usagePercentage * 100).toFixed(1)}%`,
    });

    // 計算清理效果
    const keysReduced = beforeStats.totalKeys - afterStats.totalKeys;
    const sizeReduced = beforeStats.totalSize - afterStats.totalSize;
    console.log('📈 清理效果:', {
      keysReduced,
      sizeReduced: `${(sizeReduced / 1024).toFixed(1)}KB`,
      reductionPercentage: `${(
        (sizeReduced / beforeStats.totalSize) *
        100
      ).toFixed(1)}%`,
    });
  } catch (error) {
    console.error('❌ 測試清理功能時出錯:', error);
  }
}

// 測試配額監控
async function testQuotaMonitoring() {
  console.log('📊 測試配額監控...');

  try {
    const usage = await smartDataCleaner.getStorageUsage();
    console.log('📊 存儲使用情況:', {
      used: `${(usage.used / 1024).toFixed(1)}KB`,
      quota: `${(usage.quota / 1024 / 1024).toFixed(1)}MB`,
      percentage: `${(usage.percentage * 100).toFixed(1)}%`,
      keys: usage.keys,
    });

    if (usage.percentage > 0.8) {
      console.log('⚠️ 存儲使用率超過80%，建議清理');
    } else {
      console.log('✅ 存儲使用率正常');
    }
  } catch (error) {
    console.error('❌ 測試配額監控時出錯:', error);
  }
}

// 測試自動清理
async function testAutoCleanup() {
  console.log('🤖 測試自動清理...');

  try {
    // 模擬高使用率情況
    const usage = await smartDataCleaner.getStorageUsage();
    console.log(`📊 當前使用率: ${(usage.percentage * 100).toFixed(1)}%`);

    if (usage.percentage >= smartDataCleaner.quotaThreshold) {
      console.log('🚨 觸發自動清理...');
      await smartDataCleaner.checkAndCleanup();
    } else {
      console.log('✅ 使用率正常，無需自動清理');
    }
  } catch (error) {
    console.error('❌ 測試自動清理時出錯:', error);
  }
}

// 主測試函數
async function runTests() {
  console.log('🚀 開始智能數據清理器測試...');

  try {
    // 生成測試數據
    generateTestData();

    // 等待一下讓數據寫入
    await new Promise(resolve => setTimeout(resolve, 100));

    // 測試配額監控
    await testQuotaMonitoring();

    // 測試清理功能
    await testCleanup();

    // 測試自動清理
    await testAutoCleanup();

    console.log('🎉 所有測試完成！');
  } catch (error) {
    console.error('❌ 測試過程中出錯:', error);
  }
}

// 執行測試
runTests();

// 導出測試函數供外部調用
export {
  runTests,
  generateTestData,
  testCleanup,
  testQuotaMonitoring,
  testAutoCleanup,
};
