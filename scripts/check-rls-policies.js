// 檢查 RLS 策略的診斷腳本
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 環境變量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLSPolicies() {
  console.log('🔍 檢查 RLS 策略...\n');

  try {
    // 檢查當前認證狀態
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.log('❌ 獲取會話錯誤:', sessionError);
    } else if (session) {
      console.log('✅ 當前用戶已認證:', session.user.id);
    } else {
      console.log('⚠️ 當前用戶未認證');
    }

    // 檢查 artwork_likes 表的 RLS 策略
    console.log('\n📊 檢查 artwork_likes 表的 RLS 策略:');

    // 嘗試查詢現有數據
    const { data: existingLikes, error: queryError } = await supabase
      .from('artwork_likes')
      .select('*')
      .limit(1);

    if (queryError) {
      console.log('❌ 查詢 artwork_likes 錯誤:', queryError);
    } else {
      console.log(
        '✅ 可以查詢 artwork_likes，現有記錄數:',
        existingLikes?.length || 0
      );
    }

    // 檢查 follows 表的 RLS 策略
    console.log('\n📊 檢查 follows 表的 RLS 策略:');

    const { data: existingFollows, error: followsQueryError } = await supabase
      .from('follows')
      .select('*')
      .limit(1);

    if (followsQueryError) {
      console.log('❌ 查詢 follows 錯誤:', followsQueryError);
    } else {
      console.log(
        '✅ 可以查詢 follows，現有記錄數:',
        existingFollows?.length || 0
      );
    }

    // 檢查是否有認證用戶
    console.log('\n🔐 檢查認證狀態:');

    // 嘗試使用服務角色密鑰（如果有的話）
    const serviceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY;
    if (serviceKey) {
      console.log('🔑 使用服務角色密鑰進行測試...');
      const serviceSupabase = createClient(supabaseUrl, serviceKey);

      // 使用服務角色測試插入
      const { data: serviceInsertData, error: serviceInsertError } =
        await serviceSupabase.from('artwork_likes').insert({
          user_id: '00000000-0000-0000-0000-000000000001',
          artwork_id: '00000000-0000-0000-0000-000000000002',
        });

      if (serviceInsertError) {
        console.log('❌ 服務角色插入錯誤:', serviceInsertError);
      } else {
        console.log('✅ 服務角色插入成功');

        // 清理測試數據
        await serviceSupabase
          .from('artwork_likes')
          .delete()
          .eq('user_id', '00000000-0000-0000-0000-000000000001')
          .eq('artwork_id', '00000000-0000-0000-0000-000000000002');
      }
    } else {
      console.log('⚠️ 沒有服務角色密鑰，無法測試管理員權限');
    }

    // 檢查表的所有者
    console.log('\n👤 檢查表的所有者:');

    const { data: tableInfo, error: tableInfoError } = await supabase.rpc(
      'get_table_info',
      { table_name: 'artwork_likes' }
    );

    if (tableInfoError) {
      console.log('⚠️ 無法獲取表信息:', tableInfoError.message);
    } else {
      console.log('✅ 表信息:', tableInfo);
    }
  } catch (error) {
    console.error('❌ 檢查過程中發生錯誤:', error);
  }
}

checkRLSPolicies();
