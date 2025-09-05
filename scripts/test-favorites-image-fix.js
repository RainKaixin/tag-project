// test-favorites-image-fix.js - 測試收藏圖片顯示修復

console.log('🧪 開始測試收藏圖片顯示修復...');

// 測試收藏服務和圖片加載
async function testFavoritesImageFix() {
  try {
    console.log('📋 測試收藏服務和圖片加載...');

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
      console.log('📝 收藏項目詳情:', {
        id: favorite.id,
        item_type: favorite.item_type,
        item_id: favorite.item_id,
        created_at: favorite.created_at,
      });

      // 測試作品數據加載
      console.log('🔍 測試作品數據加載...');
      const { getAllPublicPortfolios, getPortfolioImageUrl } = await import(
        '../src/services/supabase/portfolio.js'
      );

      const portfolioResult = await getAllPublicPortfolios();
      console.log('✅ 作品數據結果:', portfolioResult);

      if (portfolioResult.success) {
        const work = portfolioResult.data.find(
          item => item.id === favorite.item_id
        );
        if (work) {
          console.log('📝 找到對應作品:', {
            id: work.id,
            title: work.title,
            thumbnailPath: work.thumbnailPath,
            imagePaths: work.imagePaths,
          });

          // 測試圖片URL轉換
          const imagePath =
            work.thumbnailPath || (work.imagePaths && work.imagePaths[0]);
          if (imagePath) {
            console.log('🔍 測試圖片URL轉換...');
            const imageResult = await getPortfolioImageUrl(imagePath);
            console.log('✅ 圖片URL結果:', imageResult);
          }
        } else {
          console.warn('⚠️ 未找到對應的作品數據');
        }
      }
    }
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }
}

// 測試草稿服務修復
async function testDraftServiceFix() {
  try {
    console.log('📋 測試草稿服務修復...');

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

  await testFavoritesImageFix();
  await testDraftServiceFix();

  console.log('✅ 所有測試完成！');
}

// 如果是在瀏覽器環境中運行
if (typeof window !== 'undefined') {
  runTests();
} else {
  console.log('⚠️ 此腳本需要在瀏覽器環境中運行');
}
