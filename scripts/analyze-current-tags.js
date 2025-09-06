// analyze-current-tags.js: 分析現有標籤數據格式

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ooaicpvsjmmxuccqlzuh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsImtpZCI6ImhSV2RQM3BNNzdYdUdCMFoiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL29vYWljcHZzam1teHVjY3FsenVoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5ZGE3YzAxMi0yYjgwLTQ1OTctYjEzOC00ZjVjMGM3ZmRjZDEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU3MTgzMTUwLCJpYXQiOjE3NTcxNzk1NTAsImVtYWlsIjoidGFnQHJhaW53YW5nLmFydCIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzU2OTQwMDM1fV0sInNlc3Npb25faWQiOiJhYTllZDY1Ni1lMmM5LTQyZDEtYTJlYS03NjlkNDNhYTQ4NTciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.dXqHD3lvsndutMxtQw1atvE-BMj6zIIboHyi4_IhIoU';

const supabase = createClient(supabaseUrl, supabaseKey);

// 軟件白名單（與Gallery Filter一致）
const SOFTWARE_WHITELIST = [
  '3d-coat',
  '3ds-max',
  'after-effects',
  'blender',
  'cinema-4d',
  'davinci-resolve',
  'figma',
  'gaea',
  'houdini',
  'illustrator',
  'indesign',
  'javascript',
  'maya',
  'nuke',
  'photoshop',
  'python',
  'substance-designer',
  'substance-painter',
  'unity',
  'unreal-engine',
  'zbrush',
];

/**
 * 分析現有標籤數據格式
 */
const analyzeCurrentTags = async () => {
  console.log('🔍 分析現有標籤數據格式...\n');

  try {
    // 1. 獲取所有portfolio的tags數據
    console.log('1️⃣ 獲取所有portfolio的tags數據...');
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolio')
      .select('id, title, tags')
      .not('tags', 'is', null);

    if (portfolioError) {
      console.log(`❌ portfolio查詢失敗: ${portfolioError.message}`);
      return;
    }

    console.log(`✅ 找到 ${portfolioData?.length || 0} 個有標籤的作品`);

    // 2. 分析標籤格式
    console.log('\n2️⃣ 分析標籤格式...');
    const allTags = new Set();
    const softwareTags = new Set();
    const freeTags = new Set();
    const tagFormats = {
      withHash: 0,
      withoutHash: 0,
      mixedCase: 0,
      lowercase: 0,
    };

    portfolioData?.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          if (tag && tag.trim()) {
            const cleanTag = tag.trim();
            allTags.add(cleanTag);

            // 分析格式
            if (cleanTag.startsWith('#')) {
              tagFormats.withHash++;
            } else {
              tagFormats.withoutHash++;
            }

            if (cleanTag !== cleanTag.toLowerCase()) {
              tagFormats.mixedCase++;
            } else {
              tagFormats.lowercase++;
            }

            // 檢查是否為軟件標籤
            const normalizedTag = cleanTag.replace('#', '').toLowerCase();
            if (SOFTWARE_WHITELIST.includes(normalizedTag)) {
              softwareTags.add(cleanTag);
            } else {
              freeTags.add(cleanTag);
            }
          }
        });
      }
    });

    // 3. 顯示分析結果
    console.log('\n3️⃣ 標籤格式分析結果:');
    console.log(`   總標籤數: ${allTags.size}`);
    console.log(`   帶#前綴: ${tagFormats.withHash}`);
    console.log(`   不帶#前綴: ${tagFormats.withoutHash}`);
    console.log(`   混合大小寫: ${tagFormats.mixedCase}`);
    console.log(`   全小寫: ${tagFormats.lowercase}`);

    console.log('\n4️⃣ 軟件標籤分析:');
    console.log(`   軟件標籤數: ${softwareTags.size}`);
    console.log(`   自由標籤數: ${freeTags.size}`);

    if (softwareTags.size > 0) {
      console.log('   軟件標籤列表:');
      Array.from(softwareTags)
        .sort()
        .forEach((tag, index) => {
          console.log(`     ${index + 1}. "${tag}"`);
        });
    }

    if (freeTags.size > 0) {
      console.log('\n   自由標籤列表（前20個）:');
      Array.from(freeTags)
        .sort()
        .slice(0, 20)
        .forEach((tag, index) => {
          console.log(`     ${index + 1}. "${tag}"`);
        });
      if (freeTags.size > 20) {
        console.log(`     ... 還有 ${freeTags.size - 20} 個標籤`);
      }
    }

    // 4. 檢查profiles表的專業數據
    console.log('\n5️⃣ 檢查profiles表的專業數據...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, title, bio')
      .limit(10);

    if (profilesError) {
      console.log(`❌ profiles查詢失敗: ${profilesError.message}`);
    } else {
      console.log(`✅ profiles表有 ${profilesData?.length || 0} 條記錄`);
      profilesData?.forEach((profile, index) => {
        console.log(
          `   ${index + 1}. ${profile.full_name} - ${profile.title || 'N/A'}`
        );
      });
    }

    // 5. 生成遷移建議
    console.log('\n6️⃣ 遷移建議:');
    if (tagFormats.withHash > 0) {
      console.log('   ⚠️  需要處理#前綴標籤');
    }
    if (tagFormats.mixedCase > 0) {
      console.log('   ⚠️  需要統一大小寫格式');
    }
    if (softwareTags.size > 0) {
      console.log('   ✅ 發現軟件標籤，可以進行分欄遷移');
    } else {
      console.log('   ℹ️  未發現軟件標籤，可能需要檢查白名單');
    }

    console.log('\n🎯 下一步操作建議:');
    console.log('1. 如果發現軟件標籤，創建software字段');
    console.log('2. 統一標籤格式（去除#前綴，統一大小寫）');
    console.log('3. 將軟件標籤遷移到software字段');
    console.log('4. 創建相應的索引');
  } catch (error) {
    console.error('💥 分析過程中發生錯誤:', error);
  }
};

// 執行分析
analyzeCurrentTags().catch(console.error);
