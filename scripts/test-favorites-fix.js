// test-favorites-fix.js - 測試收藏功能修復

console.log('🧪 開始測試收藏功能修復...');

// 測試收藏服務
async function testFavoritesService() {
  try {
    console.log('📋 測試收藏服務...');

    // 導入收藏服務
    const { favoritesService } = await import(
      '../src/services/favoritesService/index.js'
    );

    // 測試獲取收藏列表
    console.log('🔍 測試獲取收藏列表...');
    const result = await favoritesService.getFavorites({
      userId: '9da7c012-2b80-4597-b138-4f5c0c7fdcd1',
      type: 'all',
      limit: 10,
    });

    console.log('✅ 收藏列表結果:', result);

    if (result.success && result.data.items.length > 0) {
      const favorite = result.data.items[0];
      console.log('📝 第一個收藏項目:', {
        id: favorite.id,
        item_type: favorite.item_type,
        item_id: favorite.item_id,
        created_at: favorite.created_at,
      });

      // 測試檢查收藏狀態
      console.log('🔍 測試檢查收藏狀態...');
      const statusResult = await favoritesService.checkFavoriteStatus(
        favorite.item_type,
        favorite.item_id
      );

      console.log('✅ 收藏狀態結果:', statusResult);
    }
  } catch (error) {
    console.error('❌ 收藏服務測試失敗:', error);
  }
}

// 測試草稿服務
async function testDraftService() {
  try {
    console.log('📋 測試草稿服務...');

    // 導入草稿服務
    const { default: draftService } = await import(
      '../src/services/draftService/index.js'
    );

    // 測試獲取草稿列表
    console.log('🔍 測試獲取草稿列表...');
    const result = await draftService.getDrafts({
      type: 'collaboration',
      limit: 10,
    });

    console.log('✅ 草稿列表結果:', result);
  } catch (error) {
    console.error('❌ 草稿服務測試失敗:', error);
  }
}

// 執行測試
async function runTests() {
  console.log('🚀 開始執行測試...');

  await testFavoritesService();
  await testDraftService();

  console.log('✅ 所有測試完成！');
}

// 如果是在瀏覽器環境中運行
if (typeof window !== 'undefined') {
  runTests();
} else {
  console.log('⚠️ 此腳本需要在瀏覽器環境中運行');
}
