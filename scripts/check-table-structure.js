// 檢查數據庫表結構的腳本
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 環境變量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 檢查數據庫表結構...\n');

  try {
    // 檢查 artwork_likes 表結構
    console.log('📊 檢查 artwork_likes 表結構:');

    const { data: likesData, error: likesError } = await supabase
      .from('artwork_likes')
      .select('*')
      .limit(1);

    if (likesError) {
      console.log('❌ 查詢 artwork_likes 錯誤:', likesError);
    } else {
      console.log('✅ artwork_likes 表存在');
      if (likesData && likesData.length > 0) {
        console.log('📋 表結構:', Object.keys(likesData[0]));
      }
    }

    // 檢查 follows 表結構
    console.log('\n📊 檢查 follows 表結構:');

    const { data: followsData, error: followsError } = await supabase
      .from('follows')
      .select('*')
      .limit(1);

    if (followsError) {
      console.log('❌ 查詢 follows 錯誤:', followsError);
    } else {
      console.log('✅ follows 表存在');
      if (followsData && followsData.length > 0) {
        console.log('📋 表結構:', Object.keys(followsData[0]));
      }
    }

    // 嘗試使用 upsert 方法（這應該能工作）
    console.log('\n🧪 測試 upsert 方法...');

    const testUserId = '00000000-0000-0000-0000-000000000001';
    const testArtworkId = '00000000-0000-0000-0000-000000000002';

    // 測試 artwork_likes upsert
    console.log('測試 artwork_likes upsert...');
    const { data: upsertData, error: upsertError } = await supabase
      .from('artwork_likes')
      .upsert({
        user_id: testUserId,
        artwork_id: testArtworkId,
      });

    if (upsertError) {
      console.log('❌ upsert 錯誤:', upsertError);
    } else {
      console.log('✅ upsert 成功');

      // 清理測試數據
      await supabase
        .from('artwork_likes')
        .delete()
        .eq('user_id', testUserId)
        .eq('artwork_id', testArtworkId);
      console.log('🧹 測試數據已清理');
    }
  } catch (error) {
    console.error('❌ 檢查過程中發生錯誤:', error);
  }
}

checkTableStructure();
