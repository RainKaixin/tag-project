// 瀏覽量調試工具

const STORAGE_KEY = 'tag_artwork_views';

/**
 * 獲取存儲的瀏覽量數據
 */
const getStoredViewData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Failed to get stored view data:', error);
    return {};
  }
};

/**
 * 調試瀏覽量數據
 */
const debugViewCount = artworkId => {
  console.log('\n🔍 === 瀏覽量調試報告 ===');

  const viewData = getStoredViewData();
  console.log('📊 所有瀏覽量數據:', viewData);

  if (artworkId) {
    const artworkViews = viewData[artworkId];
    if (artworkViews) {
      console.log(`\n🎯 作品 ${artworkId} 的詳細數據:`);
      console.log('  總瀏覽量:', artworkViews.totalViews);
      console.log('  已登錄用戶:', artworkViews.userViews);
      console.log('  訪客指紋:', artworkViews.visitorViews);
      console.log('  用戶數量:', artworkViews.userViews.length);
      console.log('  訪客數量:', artworkViews.visitorViews.length);

      // 分析問題
      const totalUniqueViews =
        artworkViews.userViews.length + artworkViews.visitorViews.length;
      console.log('\n🔍 問題分析:');
      console.log('  唯一瀏覽者總數:', totalUniqueViews);
      console.log('  記錄的總瀏覽量:', artworkViews.totalViews);

      if (totalUniqueViews !== artworkViews.totalViews) {
        console.log('❌ 發現問題: 唯一瀏覽者數量與總瀏覽量不匹配!');
        console.log('   可能原因: 數據不一致或重複記錄');
      } else {
        console.log('✅ 數據一致性檢查通過');
      }

      // 檢查是否有重複的用戶ID
      const uniqueUserViews = [...new Set(artworkViews.userViews)];
      if (uniqueUserViews.length !== artworkViews.userViews.length) {
        console.log('❌ 發現重複用戶ID:', artworkViews.userViews);
        console.log('   去重後:', uniqueUserViews);
      }

      // 檢查是否有重複的訪客指紋
      const uniqueVisitorViews = [...new Set(artworkViews.visitorViews)];
      if (uniqueVisitorViews.length !== artworkViews.visitorViews.length) {
        console.log('❌ 發現重複訪客指紋:', artworkViews.visitorViews);
        console.log('   去重後:', uniqueVisitorViews);
      }
    } else {
      console.log(`❌ 未找到作品 ${artworkId} 的瀏覽量數據`);
    }
  }

  console.log('\n=== 調試報告結束 ===\n');
};

/**
 * 清除所有瀏覽量數據
 */
const clearAllViewData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ 已清除所有瀏覽量數據');
  } catch (error) {
    console.error('❌ 清除數據失敗:', error);
  }
};

/**
 * 重置特定作品的瀏覽量
 */
const resetArtworkViews = artworkId => {
  try {
    const viewData = getStoredViewData();
    if (viewData[artworkId]) {
      delete viewData[artworkId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewData));
      console.log(`✅ 已重置作品 ${artworkId} 的瀏覽量`);
    } else {
      console.log(`❌ 未找到作品 ${artworkId} 的數據`);
    }
  } catch (error) {
    console.error('❌ 重置失敗:', error);
  }
};

// 導出函數供瀏覽器控制台使用
window.debugViewCount = debugViewCount;
window.clearAllViewData = clearAllViewData;
window.resetArtworkViews = resetArtworkViews;

console.log('🔧 瀏覽量調試工具已加載');
console.log('使用方法:');
console.log('  debugViewCount("作品ID") - 調試特定作品的瀏覽量');
console.log('  clearAllViewData() - 清除所有瀏覽量數據');
console.log('  resetArtworkViews("作品ID") - 重置特定作品的瀏覽量');
