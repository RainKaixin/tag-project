// test-data-migration.js: 測試數據遷移結果

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ooaicpvsjmmxuccqlzuh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsImtpZCI6ImhSV2RQM3BNNzdYdUdCMFoiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL29vYWljcHZzam1teHVjY3FsenVoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5ZGE3YzAxMi0yYjgwLTQ1OTctYjEzOC00ZjVjMGM3ZmRjZDEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU3MTgzMTUwLCJpYXQiOjE3NTcxNzk1NTAsImVtYWlsIjoidGFnQHJhaW53YW5nLmFydCIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzU2OTQwMDM1fV0sInNlc3Npb25faWQiOiJhYTllZDY1Ni1lMmM5LTQyZDEtYTJlYS03NjlkNDNhYTQ4NTciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.dXqHD3lvsndutMxtQw1atvE-BMj6zIIboHyi4_IhIoU';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 測試數據遷移結果
 */
const testDataMigration = async () => {
  console.log('🧪 測試數據遷移結果...\n');

  try {
    // 1. 檢查software字段是否存在
    console.log('1️⃣ 檢查software字段...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('portfolio')
      .select('software')
      .limit(1);

    if (schemaError) {
      console.log(`❌ software字段不存在: ${schemaError.message}`);
      return;
    }
    console.log('✅ software字段存在');

    // 2. 檢查數據遷移結果
    console.log('\n2️⃣ 檢查數據遷移結果...');
    const { data: migrationData, error: migrationError } = await supabase
      .from('portfolio')
      .select('id, title, tags, software')
      .limit(10);

    if (migrationError) {
      console.log(`❌ 數據查詢失敗: ${migrationError.message}`);
      return;
    }

    console.log(`✅ 找到 ${migrationData?.length || 0} 個作品`);
    migrationData?.forEach((item, index) => {
      console.log(`   ${index + 1}. "${item.title}"`);
      console.log(`      標籤: [${item.tags?.join(', ') || '無'}]`);
      console.log(`      軟件: [${item.software?.join(', ') || '無'}]`);
      console.log('');
    });

    // 3. 測試軟件查詢
    console.log('3️⃣ 測試軟件查詢...');
    const { data: softwareData, error: softwareError } = await supabase
      .from('portfolio')
      .select('id, title, software')
      .contains('software', ['photoshop']);

    if (softwareError) {
      console.log(`❌ 軟件查詢失敗: ${softwareError.message}`);
    } else {
      console.log(`✅ 找到 ${softwareData?.length || 0} 個使用Photoshop的作品`);
      softwareData?.forEach((item, index) => {
        console.log(
          `   ${index + 1}. "${item.title}" - 軟件: [${item.software?.join(
            ', '
          )}]`
        );
      });
    }

    // 4. 測試標籤查詢
    console.log('\n4️⃣ 測試標籤查詢...');
    const { data: tagData, error: tagError } = await supabase
      .from('portfolio')
      .select('id, title, tags')
      .contains('tags', ['castle']);

    if (tagError) {
      console.log(`❌ 標籤查詢失敗: ${tagError.message}`);
    } else {
      console.log(`✅ 找到 ${tagData?.length || 0} 個包含castle標籤的作品`);
      tagData?.forEach((item, index) => {
        console.log(
          `   ${index + 1}. "${item.title}" - 標籤: [${item.tags?.join(', ')}]`
        );
      });
    }

    // 5. 測試組合查詢
    console.log('\n5️⃣ 測試組合查詢...');
    const { data: combinedData, error: combinedError } = await supabase
      .from('portfolio')
      .select('id, title, tags, software')
      .contains('software', ['photoshop'])
      .contains('tags', ['castle']);

    if (combinedError) {
      console.log(`❌ 組合查詢失敗: ${combinedError.message}`);
    } else {
      console.log(
        `✅ 找到 ${
          combinedData?.length || 0
        } 個同時使用Photoshop和castle標籤的作品`
      );
      combinedData?.forEach((item, index) => {
        console.log(`   ${index + 1}. "${item.title}"`);
        console.log(`      標籤: [${item.tags?.join(', ')}]`);
        console.log(`      軟件: [${item.software?.join(', ')}]`);
      });
    }

    // 6. 檢查profiles表的專業字段
    console.log('\n6️⃣ 檢查profiles表專業字段...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, majors, minors')
      .limit(5);

    if (profilesError) {
      console.log(`❌ profiles查詢失敗: ${profilesError.message}`);
    } else {
      console.log(`✅ profiles表有 ${profilesData?.length || 0} 條記錄`);
      profilesData?.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.full_name}`);
        console.log(`      專業: [${profile.majors?.join(', ') || '無'}]`);
        console.log(`      副專業: [${profile.minors?.join(', ') || '無'}]`);
      });
    }

    // 7. 統計數據
    console.log('\n7️⃣ 數據統計...');
    const { data: statsData, error: statsError } = await supabase
      .from('portfolio')
      .select('id, tags, software');

    if (statsError) {
      console.log(`❌ 統計查詢失敗: ${statsError.message}`);
    } else {
      const totalItems = statsData?.length || 0;
      const itemsWithTags =
        statsData?.filter(item => item.tags && item.tags.length > 0).length ||
        0;
      const itemsWithSoftware =
        statsData?.filter(item => item.software && item.software.length > 0)
          .length || 0;

      console.log(`📊 數據統計:`);
      console.log(`   總作品數: ${totalItems}`);
      console.log(`   有標籤: ${itemsWithTags}`);
      console.log(`   有軟件: ${itemsWithSoftware}`);
    }

    console.log('\n🎉 數據遷移測試完成！');
  } catch (error) {
    console.error('💥 測試過程中發生錯誤:', error);
  }
};

// 執行測試
testDataMigration().catch(console.error);
