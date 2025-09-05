// run-follows-migration.js - 運行 follows 表遷移

console.log('🚀 開始運行 follows 表遷移...');

// 讀取 SQL 文件
import fs from 'fs';
import path from 'path';

const sqlFilePath = path.join(
  __dirname,
  '../database/migrations/007_create_follows_table.sql'
);

try {
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log('📄 讀取 SQL 文件成功');
  console.log('📋 SQL 內容:');
  console.log('='.repeat(50));
  console.log(sqlContent);
  console.log('='.repeat(50));

  console.log('✅ 請將上述 SQL 內容複製到 Supabase SQL Editor 中執行');
  console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard');
  console.log('📝 步驟:');
  console.log('   1. 登入 Supabase Dashboard');
  console.log('   2. 選擇您的項目');
  console.log('   3. 進入 SQL Editor');
  console.log('   4. 粘貼上述 SQL 內容');
  console.log('   5. 點擊 "Run" 執行');
} catch (error) {
  console.error('❌ 讀取 SQL 文件失敗:', error);
}
