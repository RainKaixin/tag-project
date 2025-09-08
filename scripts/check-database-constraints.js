// 檢查數據庫約束的腳本
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 環境變量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConstraints() {
  console.log('🔍 檢查數據庫約束...\n');

  try {
    // 檢查 artwork_likes 表的約束
    console.log('📊 檢查 artwork_likes 表約束:');

    // 嘗試查詢表結構
    const { data: likesData, error: likesError } = await supabase
      .from('artwork_likes')
      .select('*')
      .limit(1);

    if (likesError) {
      console.log('❌ 查詢 artwork_likes 錯誤:', likesError);
    } else {
      console.log('✅ artwork_likes 表存在，記錄數:', likesData?.length || 0);
    }

    // 檢查 follows 表的約束
    console.log('\n📊 檢查 follows 表約束:');

    const { data: followsData, error: followsError } = await supabase
      .from('follows')
      .select('*')
      .limit(1);

    if (followsError) {
      console.log('❌ 查詢 follows 錯誤:', followsError);
    } else {
      console.log('✅ follows 表存在，記錄數:', followsData?.length || 0);
    }

    // 嘗試插入測試數據來檢查約束
    console.log('\n🧪 測試插入操作...');

    const testUserId = '00000000-0000-0000-0000-000000000001';
    const testArtworkId = '00000000-0000-0000-0000-000000000002';

    // 測試 artwork_likes 插入
    console.log('測試 artwork_likes 插入...');
    const { data: insertData, error: insertError } = await supabase
      .from('artwork_likes')
      .insert({
        user_id: testUserId,
        artwork_id: testArtworkId,
      });

    if (insertError) {
      console.log('❌ 插入錯誤:', insertError);
      console.log('錯誤代碼:', insertError.code);
      console.log('錯誤詳情:', insertError.details);
      console.log('錯誤提示:', insertError.hint);
    } else {
      console.log('✅ 插入成功');

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

checkConstraints();
