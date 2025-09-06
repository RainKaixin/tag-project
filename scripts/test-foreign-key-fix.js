// test-foreign-key-fix v1: 測試外鍵關係修復

import {
  getTagStats,
  getWorksByTag,
} from '../src/services/tagService/index.js';

/**
 * 測試外鍵關係修復後的標籤聚合功能
 */
const testForeignKeyFix = async () => {
  console.log('🔧 測試外鍵關係修復後的標籤聚合功能...\n');

  try {
    // 測試1: 獲取標籤統計
    console.log('📊 測試1: 獲取標籤統計');
    console.log('----------------------------------------');

    const testTag = 'castle';

    try {
      const stats = await getTagStats(testTag);
      console.log(`✅ 標籤 "${testTag}" 統計:`, stats);

      if (stats.works > 0) {
        console.log(`🎉 成功找到 ${stats.works} 個作品！`);
      } else {
        console.log(`⚠️  沒有找到包含 "${testTag}" 標籤的作品`);
      }
    } catch (error) {
      console.log(`❌ 標籤 "${testTag}" 統計失敗:`, error.message);
    }

    console.log('\n');

    // 測試2: 根據標籤獲取作品
    console.log('🎨 測試2: 根據標籤獲取作品');
    console.log('----------------------------------------');

    try {
      const result = await getWorksByTag(testTag, { limit: 5 });
      console.log(`✅ 標籤 "${testTag}" 作品數量: ${result.items.length}`);

      if (result.items.length > 0) {
        console.log(`🎉 成功獲取作品列表！`);
        result.items.forEach((work, index) => {
          console.log(
            `   ${index + 1}. "${work.title}" by ${work.author.name}`
          );
          console.log(`      作者角色: ${work.author.role || 'N/A'}`);
          console.log(`      標籤: ${work.tags.join(', ')}`);
        });
      } else {
        console.log(`⚠️  沒有找到包含 "${testTag}" 標籤的作品`);
      }

      console.log(`   是否有更多: ${result.hasMore}`);
      console.log(`   下一個cursor: ${result.cursor || 'null'}`);
    } catch (error) {
      console.log(`❌ 標籤 "${testTag}" 作品獲取失敗:`, error.message);
      console.log(`   錯誤詳情:`, error);
    }

    console.log('\n');

    // 測試3: 測試其他標籤
    console.log('🏷️  測試3: 測試其他標籤');
    console.log('----------------------------------------');

    const otherTags = ['photoshop', 'unity', 'design'];

    for (const tag of otherTags) {
      try {
        const stats = await getTagStats(tag);
        const result = await getWorksByTag(tag, { limit: 3 });
        console.log(
          `✅ 標籤 "${tag}": ${stats.works} 個作品, 獲取到 ${result.items.length} 個`
        );

        if (result.items.length > 0) {
          console.log(
            `   第一個作品: "${result.items[0].title}" by ${result.items[0].author.name}`
          );
        }
      } catch (error) {
        console.log(`❌ 標籤 "${tag}" 測試失敗:`, error.message);
      }
    }

    console.log('\n🎉 外鍵關係修復測試完成！');
  } catch (error) {
    console.error('💥 測試過程中發生錯誤:', error);
  }
};

/**
 * 主函數
 */
const main = async () => {
  console.log('🚀 外鍵關係修復測試腳本啟動\n');

  // 執行測試
  await testForeignKeyFix();
};

// 執行測試
main().catch(console.error);
