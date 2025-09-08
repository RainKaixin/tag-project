// 检查数据库触发器的脚本
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 環境變量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTriggers() {
  console.log('🔍 檢查數據庫觸發器...\n');

  try {
    // 檢查 follows 表是否有觸發器
    console.log('📊 檢查 follows 表觸發器:');

    const { data: triggerData, error: triggerError } = await supabase.rpc(
      'exec_sql',
      {
        sql: `
          SELECT 
            trigger_name,
            event_manipulation,
            action_timing,
            action_statement
          FROM information_schema.triggers 
          WHERE event_object_table = 'follows'
          ORDER BY trigger_name;
        `,
      }
    );

    if (triggerError) {
      console.log('❌ 查詢觸發器錯誤:', triggerError);
      console.log('💡 嘗試直接查詢...');

      // 嘗試直接查詢
      const { data: directData, error: directError } = await supabase
        .from('information_schema.triggers')
        .select('*')
        .eq('event_object_table', 'follows');

      if (directError) {
        console.log('❌ 直接查詢也失敗:', directError);
      } else {
        console.log('✅ 找到觸發器:', directData);
      }
    } else {
      console.log('✅ 觸發器信息:', triggerData);
    }

    // 檢查 notifications 表
    console.log('\n📊 檢查 notifications 表:');
    const { data: notifData, error: notifError } = await supabase
      .from('notifications')
      .select('*')
      .limit(5);

    if (notifError) {
      console.log('❌ 查詢 notifications 表錯誤:', notifError);
    } else {
      console.log('✅ notifications 表存在，記錄數:', notifData.length);
      if (notifData.length > 0) {
        console.log('📋 最新通知:', notifData[0]);
      }
    }

    // 檢查 follows 表
    console.log('\n📊 檢查 follows 表:');
    const { data: followsData, error: followsError } = await supabase
      .from('follows')
      .select('*')
      .limit(5);

    if (followsError) {
      console.log('❌ 查詢 follows 表錯誤:', followsError);
    } else {
      console.log('✅ follows 表存在，記錄數:', followsData.length);
      if (followsData.length > 0) {
        console.log('📋 最新關注記錄:', followsData[0]);
      }
    }
  } catch (error) {
    console.error('❌ 檢查過程中發生錯誤:', error);
  }
}

checkTriggers();
