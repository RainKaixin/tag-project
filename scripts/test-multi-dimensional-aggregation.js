// test-multi-dimensional-aggregation.js: 測試多維度聚合功能

import {
  getAggregationStats,
  getAggregationWorks,
  parseAggregationParams,
  generateAggregationTitle,
  generateAggregationDescription,
  AGGREGATION_TYPES,
} from '../src/services/aggregationService/index.js';

/**
 * 測試多維度聚合功能
 */
const testMultiDimensionalAggregation = async () => {
  console.log('🧪 測試多維度聚合功能...\n');

  try {
    // 測試1: 標籤聚合
    console.log('1️⃣ 測試標籤聚合...');
    console.log('----------------------------------------');

    try {
      const tagStats = await getAggregationStats(
        AGGREGATION_TYPES.TAG,
        'castle'
      );
      const tagWorks = await getAggregationWorks(
        AGGREGATION_TYPES.TAG,
        'castle',
        { limit: 3 }
      );

      console.log(`✅ 標籤聚合統計:`, tagStats);
      console.log(`✅ 標籤聚合作品: ${tagWorks.items.length} 個`);

      if (tagWorks.items.length > 0) {
        console.log(
          `   第一個作品: "${tagWorks.items[0].title}" by ${tagWorks.items[0].author.name}`
        );
      }
    } catch (error) {
      console.log(`❌ 標籤聚合測試失敗:`, error.message);
    }

    console.log('\n');

    // 測試2: 軟件聚合
    console.log('2️⃣ 測試軟件聚合...');
    console.log('----------------------------------------');

    try {
      const softwareStats = await getAggregationStats(
        AGGREGATION_TYPES.SOFTWARE,
        'photoshop'
      );
      const softwareWorks = await getAggregationWorks(
        AGGREGATION_TYPES.SOFTWARE,
        'photoshop',
        { limit: 3 }
      );

      console.log(`✅ 軟件聚合統計:`, softwareStats);
      console.log(`✅ 軟件聚合作品: ${softwareWorks.items.length} 個`);

      if (softwareWorks.items.length > 0) {
        console.log(
          `   第一個作品: "${softwareWorks.items[0].title}" by ${softwareWorks.items[0].author.name}`
        );
      }
    } catch (error) {
      console.log(`❌ 軟件聚合測試失敗:`, error.message);
    }

    console.log('\n');

    // 測試3: 專業聚合
    console.log('3️⃣ 測試專業聚合...');
    console.log('----------------------------------------');

    try {
      const majorStats = await getAggregationStats(
        AGGREGATION_TYPES.MAJOR,
        'animation'
      );
      const majorWorks = await getAggregationWorks(
        AGGREGATION_TYPES.MAJOR,
        'animation',
        { limit: 3 }
      );

      console.log(`✅ 專業聚合統計:`, majorStats);
      console.log(`✅ 專業聚合作品: ${majorWorks.items.length} 個`);

      if (majorWorks.items.length > 0) {
        console.log(
          `   第一個作品: "${majorWorks.items[0].title}" by ${majorWorks.items[0].author.name}`
        );
      }
    } catch (error) {
      console.log(`❌ 專業聚合測試失敗:`, error.message);
    }

    console.log('\n');

    // 測試4: 組合聚合
    console.log('4️⃣ 測試組合聚合...');
    console.log('----------------------------------------');

    try {
      const filters = {
        major: 'animation',
        software: ['photoshop'],
        tags: ['castle'],
      };

      const combinedStats = await getAggregationStats(
        AGGREGATION_TYPES.COMBINED,
        'combined',
        filters
      );
      const combinedWorks = await getAggregationWorks(
        AGGREGATION_TYPES.COMBINED,
        'combined',
        { limit: 3 },
        filters
      );

      console.log(`✅ 組合聚合統計:`, combinedStats);
      console.log(`✅ 組合聚合作品: ${combinedWorks.items.length} 個`);

      if (combinedWorks.items.length > 0) {
        console.log(
          `   第一個作品: "${combinedWorks.items[0].title}" by ${combinedWorks.items[0].author.name}`
        );
      }
    } catch (error) {
      console.log(`❌ 組合聚合測試失敗:`, error.message);
    }

    console.log('\n');

    // 測試5: 參數解析
    console.log('5️⃣ 測試參數解析...');
    console.log('----------------------------------------');

    const testParams = [
      { type: 'tag', value: 'castle' },
      { type: 'major', value: 'animation' },
      { type: 'software', value: 'photoshop' },
      { major: 'animation', software: ['photoshop'], tags: ['castle'] },
    ];

    testParams.forEach((params, index) => {
      try {
        const config = parseAggregationParams(params);
        const title = generateAggregationTitle(config);
        const description = generateAggregationDescription(config, {
          works: 5,
          users: 3,
        });

        console.log(`✅ 測試 ${index + 1}:`);
        console.log(`   參數:`, params);
        console.log(`   配置:`, config);
        console.log(`   標題: ${title}`);
        console.log(`   描述: ${description}`);
      } catch (error) {
        console.log(`❌ 參數解析測試 ${index + 1} 失敗:`, error.message);
      }
    });

    console.log('\n🎉 多維度聚合功能測試完成！');
  } catch (error) {
    console.error('💥 測試過程中發生錯誤:', error);
  }
};

/**
 * 主函數
 */
const main = async () => {
  console.log('🚀 多維度聚合功能測試腳本啟動\n');

  // 執行測試
  await testMultiDimensionalAggregation();
};

// 執行測試
main().catch(console.error);
