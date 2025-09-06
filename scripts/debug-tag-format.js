// debug-tag-format.js: 檢查數據庫中的標籤格式

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ooaicpvsjmmxuccqlzuh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsImtpZCI6ImhSV2RQM3BNNzdYdUdCMFoiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL29vYWljcHZzam1teHVjY3FsenVoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU3MTg2NjQzLCJpYXQiOjE3NTcxODMwNDMsImVtYWlsIjoidGFnQHJhaW53YW5nLmFydCIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzU2OTQwMDM1fV0sInNlc3Npb25faWQiOiJhYTllZDY1Ni1lMmM5LTQyZDEtYTJlYS03NjlkNDNhYTQ4NTciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.Tnsrc-fgiKOZC4xRvO4dsdGX9y8g2gVLgfq9y-4gLrg';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 檢查數據庫中的標籤格式
 */
const debugTagFormat = async () => {
  console.log('🔍 檢查數據庫中的標籤格式...\n');

  try {
    // 1. 獲取所有作品的標籤數據
    console.log('1️⃣ 檢查所有作品的標籤數據:');
    console.log('----------------------------------------');

    const { data: allWorks, error: allError } = await supabase
      .from('portfolio')
      .select('id, title, tags, software, is_public')
      .limit(10);

    if (allError) {
      console.error('❌ 獲取作品數據失敗:', allError);
      return;
    }

    console.log(`✅ 找到 ${allWorks.length} 個作品:`);
    allWorks.forEach(work => {
      console.log(`  作品: "${work.title}"`);
      console.log(`    tags:`, work.tags);
      console.log(`    software:`, work.software);
      console.log(`    is_public:`, work.is_public);
      console.log('');
    });

    // 2. 檢查是否有包含 "castle" 標籤的作品
    console.log('2️⃣ 檢查包含 "castle" 標籤的作品:');
    console.log('----------------------------------------');

    const { data: castleWorks, error: castleError } = await supabase
      .from('portfolio')
      .select('id, title, tags, software')
      .contains('tags', ['castle']);

    if (castleError) {
      console.error('❌ 查詢castle標籤失敗:', castleError);
    } else {
      console.log(`✅ 找到 ${castleWorks.length} 個包含 "castle" 標籤的作品:`);
      castleWorks.forEach(work => {
        console.log(`  作品: "${work.title}"`);
        console.log(`    tags:`, work.tags);
        console.log('');
      });
    }

    // 3. 檢查是否有包含 "#castle" 標籤的作品
    console.log('3️⃣ 檢查包含 "#castle" 標籤的作品:');
    console.log('----------------------------------------');

    const { data: hashCastleWorks, error: hashCastleError } = await supabase
      .from('portfolio')
      .select('id, title, tags, software')
      .contains('tags', ['#castle']);

    if (hashCastleError) {
      console.error('❌ 查詢#castle標籤失敗:', hashCastleError);
    } else {
      console.log(
        `✅ 找到 ${hashCastleWorks.length} 個包含 "#castle" 標籤的作品:`
      );
      hashCastleWorks.forEach(work => {
        console.log(`  作品: "${work.title}"`);
        console.log(`    tags:`, work.tags);
        console.log('');
      });
    }

    // 4. 檢查所有唯一標籤
    console.log('4️⃣ 檢查所有唯一標籤:');
    console.log('----------------------------------------');

    const { data: uniqueTags, error: uniqueError } = await supabase
      .from('portfolio')
      .select('tags')
      .not('tags', 'is', null);

    if (uniqueError) {
      console.error('❌ 獲取唯一標籤失敗:', uniqueError);
    } else {
      const allTags = new Set();
      uniqueTags.forEach(work => {
        if (work.tags && Array.isArray(work.tags)) {
          work.tags.forEach(tag => allTags.add(tag));
        }
      });

      console.log(`✅ 找到 ${allTags.size} 個唯一標籤:`);
      Array.from(allTags)
        .sort()
        .forEach(tag => {
          console.log(`  "${tag}"`);
        });
    }
  } catch (error) {
    console.error('💥 檢查過程中發生錯誤:', error);
  }
};

/**
 * 主函數
 */
const main = async () => {
  console.log('🚀 標籤格式調試腳本啟動\n');

  // 執行檢查
  await debugTagFormat();
};

// 執行檢查
main().catch(console.error);
