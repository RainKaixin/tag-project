// test-tag-aggregation v1: 標籤聚合功能測試腳本

import {
  getTagStats,
  getWorksByTag,
  getPopularTags,
  searchTags,
} from '../src/services/tagService/index.js';

/**
 * 測試標籤聚合功能
 */
const testTagAggregation = async () => {
  console.log('🧪 開始測試標籤聚合功能...\n');

  try {
    // 測試1: 獲取標籤統計
    console.log('📊 測試1: 獲取標籤統計');
    console.log('----------------------------------------');

    const testTags = ['castle', 'photoshop', 'unity', 'design'];

    for (const tag of testTags) {
      try {
        const stats = await getTagStats(tag);
        console.log(`✅ 標籤 "${tag}" 統計:`, stats);
      } catch (error) {
        console.log(`❌ 標籤 "${tag}" 統計失敗:`, error.message);
      }
    }

    console.log('\n');

    // 測試2: 根據標籤獲取作品
    console.log('🎨 測試2: 根據標籤獲取作品');
    console.log('----------------------------------------');

    for (const tag of testTags) {
      try {
        const result = await getWorksByTag(tag, { limit: 5 });
        console.log(`✅ 標籤 "${tag}" 作品數量: ${result.items.length}`);
        if (result.items.length > 0) {
          console.log(`   第一個作品: ${result.items[0].title}`);
          console.log(`   作者: ${result.items[0].author.name}`);
        }
        console.log(`   是否有更多: ${result.hasMore}`);
        console.log(`   下一個cursor: ${result.cursor || 'null'}`);
      } catch (error) {
        console.log(`❌ 標籤 "${tag}" 作品獲取失敗:`, error.message);
      }
      console.log('');
    }

    // 測試3: 獲取熱門標籤
    console.log('🔥 測試3: 獲取熱門標籤');
    console.log('----------------------------------------');

    try {
      const popularTags = await getPopularTags(10);
      console.log(`✅ 獲取到 ${popularTags.length} 個熱門標籤:`);
      popularTags.forEach((tag, index) => {
        console.log(`   ${index + 1}. ${tag.name} (${tag.count} 次使用)`);
      });
    } catch (error) {
      console.log(`❌ 獲取熱門標籤失敗:`, error.message);
    }

    console.log('\n');

    // 測試4: 搜索標籤
    console.log('🔍 測試4: 搜索標籤');
    console.log('----------------------------------------');

    const searchQueries = ['photo', 'design', '3d', 'ui'];

    for (const query of searchQueries) {
      try {
        const searchResults = await searchTags(query, 5);
        console.log(
          `✅ 搜索 "${query}" 結果: ${searchResults.length} 個匹配標籤`
        );
        searchResults.forEach((tag, index) => {
          console.log(`   ${index + 1}. ${tag.name} (${tag.count} 次使用)`);
        });
      } catch (error) {
        console.log(`❌ 搜索 "${query}" 失敗:`, error.message);
      }
      console.log('');
    }

    console.log('🎉 標籤聚合功能測試完成！');
  } catch (error) {
    console.error('💥 測試過程中發生錯誤:', error);
  }
};

/**
 * 測試數據庫連接
 */
const testDatabaseConnection = async () => {
  console.log('🔗 測試數據庫連接...');

  try {
    // 嘗試執行一個簡單的查詢
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase環境變量未設置');
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('portfolio')
      .select('count', { count: 'exact' })
      .limit(1);

    if (error) {
      console.log('❌ 數據庫連接失敗:', error.message);
      return false;
    }

    console.log('✅ 數據庫連接成功');
    return true;
  } catch (error) {
    console.log('❌ 數據庫連接測試失敗:', error.message);
    return false;
  }
};

/**
 * 主函數
 */
const main = async () => {
  console.log('🚀 標籤聚合功能測試腳本啟動\n');

  // 測試數據庫連接
  const dbConnected = await testDatabaseConnection();

  if (!dbConnected) {
    console.log('\n❌ 數據庫連接失敗，無法繼續測試');
    return;
  }

  console.log('');

  // 執行標籤聚合功能測試
  await testTagAggregation();
};

// 執行測試
main().catch(console.error);
