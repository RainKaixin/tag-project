// 手動修復 RLS 策略的腳本
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 環境變量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function manualRLSFix() {
  console.log('🔧 手動修復 RLS 策略...\n');

  try {
    // 嘗試直接執行 SQL 語句
    console.log('📝 嘗試執行 SQL 語句...');

    // 刪除現有策略
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can insert their own likes" ON artwork_likes;',
      'DROP POLICY IF EXISTS "Users can delete their own likes" ON artwork_likes;',
      'DROP POLICY IF EXISTS "Anyone can view likes" ON artwork_likes;',
      'DROP POLICY IF EXISTS "Users can insert their own follows" ON follows;',
      'DROP POLICY IF EXISTS "Users can delete their own follows" ON follows;',
      'DROP POLICY IF EXISTS "Anyone can view follows" ON follows;',
    ];

    for (const sql of dropPolicies) {
      console.log(`執行: ${sql}`);
      const { error } = await supabase.rpc('exec', { sql });
      if (error) {
        console.log(`⚠️ 執行失敗: ${error.message}`);
      } else {
        console.log('✅ 執行成功');
      }
    }

    // 創建新策略
    const createPolicies = [
      'CREATE POLICY "Anyone can insert likes" ON artwork_likes FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Anyone can delete likes" ON artwork_likes FOR DELETE USING (true);',
      'CREATE POLICY "Anyone can view likes" ON artwork_likes FOR SELECT USING (true);',
      'CREATE POLICY "Anyone can insert follows" ON follows FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Anyone can delete follows" ON follows FOR DELETE USING (true);',
      'CREATE POLICY "Anyone can view follows" ON follows FOR SELECT USING (true);',
    ];

    for (const sql of createPolicies) {
      console.log(`執行: ${sql}`);
      const { error } = await supabase.rpc('exec', { sql });
      if (error) {
        console.log(`⚠️ 執行失敗: ${error.message}`);
      } else {
        console.log('✅ 執行成功');
      }
    }
  } catch (error) {
    console.error('❌ 修復過程中發生錯誤:', error);
  }
}

manualRLSFix();
