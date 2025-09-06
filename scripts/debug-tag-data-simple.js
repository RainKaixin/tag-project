// debug-tag-data-simple.js: 簡化版標籤數據調試

import { createClient } from '@supabase/supabase-js';

// 使用您提供的Supabase配置
const supabaseUrl = 'https://ooaicpvsjmmxuccqlzuh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsImtpZCI6ImhSV2RQM3BNNzdYdUdCMFoiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL29vYWljcHZzam1teHVjY3FsenVoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5ZGE3YzAxMi0yYjgwLTQ1OTctYjEzOC00ZjVjMGM3ZmRjZDEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU3MTgzMTUwLCJpYXQiOjE3NTcxNzk1NTAsImVtYWlsIjoidGFnQHJhaW53YW5nLmFydCIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzU2OTQwMDM1fV0sInNlc3Npb25faWQiOiJhYTllZDY1Ni1lMmM5LTQyZDEtYTJlYS03NjlkNDNhYTQ4NTciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.dXqHD3lvsndutMxtQw1atvE-BMj6zIIboHyi4_IhIoU';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 調試標籤數據問題
 */
const debugTagData = async () => {
  console.log('🔍 調試標籤數據問題...\n');

  try {
    // 1. 檢查portfolio表的所有數據
    console.log('1️⃣ 檢查portfolio表數據...');
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolio')
      .select('id, title, tags, is_public, user_id')
      .limit(10);

    if (portfolioError) {
      console.log(`❌ portfolio表查詢失敗: ${portfolioError.message}`);
      return;
    }

    console.log(`✅ 找到 ${portfolioData?.length || 0} 個作品`);
    portfolioData?.forEach((item, index) => {
      console.log(`   ${index + 1}. "${item.title}"`);
      console.log(`      標籤: [${item.tags?.join(', ') || '無'}]`);
      console.log(`      公開: ${item.is_public}`);
      console.log(`      用戶: ${item.user_id}`);
      console.log('');
    });

    // 2. 檢查是否有包含"castle"標籤的作品
    console.log('2️⃣ 檢查"castle"標籤...');
    const { data: castleData, error: castleError } = await supabase
      .from('portfolio')
      .select('id, title, tags')
      .contains('tags', ['castle']);

    if (castleError) {
      console.log(`❌ castle標籤查詢失敗: ${castleError.message}`);
    } else {
      console.log(
        `✅ 找到 ${castleData?.length || 0} 個包含"castle"標籤的作品`
      );
      castleData?.forEach((item, index) => {
        console.log(
          `   ${index + 1}. "${item.title}" - 標籤: [${item.tags?.join(', ')}]`
        );
      });
    }

    // 3. 檢查所有標籤
    console.log('\n3️⃣ 檢查所有標籤...');
    const { data: allTagsData, error: allTagsError } = await supabase
      .from('portfolio')
      .select('tags')
      .not('tags', 'is', null);

    if (allTagsError) {
      console.log(`❌ 標籤查詢失敗: ${allTagsError.message}`);
    } else {
      const allTags = new Set();
      allTagsData?.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach(tag => {
            if (tag && tag.trim()) {
              allTags.add(tag.trim());
            }
          });
        }
      });

      console.log(`✅ 找到 ${allTags.size} 個唯一標籤:`);
      Array.from(allTags)
        .sort()
        .forEach((tag, index) => {
          console.log(`   ${index + 1}. "${tag}"`);
        });
    }

    // 4. 測試不同的標籤查詢方式
    console.log('\n4️⃣ 測試不同的標籤查詢方式...');

    // 方式1: 使用contains查詢
    const { data: containsData, error: containsError } = await supabase
      .from('portfolio')
      .select('id, title, tags')
      .contains('tags', ['castle']);
    console.log(`   contains查詢: ${containsData?.length || 0} 個結果`);

    // 方式2: 使用overlaps查詢
    const { data: overlapsData, error: overlapsError } = await supabase
      .from('portfolio')
      .select('id, title, tags')
      .overlaps('tags', ['castle']);
    console.log(`   overlaps查詢: ${overlapsData?.length || 0} 個結果`);

    // 5. 檢查profiles表數據
    console.log('\n5️⃣ 檢查profiles表數據...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .limit(5);

    if (profilesError) {
      console.log(`❌ profiles表查詢失敗: ${profilesError.message}`);
    } else {
      console.log(`✅ profiles表有 ${profilesData?.length || 0} 條記錄`);
      profilesData?.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}, 姓名: ${item.full_name}`);
      });
    }

    console.log('\n🎯 分析結果：');
    if (portfolioData?.length === 0) {
      console.log('❌ portfolio表為空，需要先上傳作品');
    } else if (castleData?.length === 0) {
      console.log('❌ 沒有包含"castle"標籤的作品，需要檢查標籤數據');
      console.log(
        '💡 建議：檢查現有作品的標籤格式，或者上傳包含"castle"標籤的作品'
      );
    } else {
      console.log('✅ 找到包含"castle"標籤的作品，問題可能在查詢邏輯');
    }
  } catch (error) {
    console.error('💥 調試過程中發生錯誤:', error);
  }
};

// 執行調試
debugTagData().catch(console.error);
