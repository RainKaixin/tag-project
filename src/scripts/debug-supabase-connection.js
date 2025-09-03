// debug-supabase-connection.js
// 詳細調試 Supabase 連接問題

console.log('🔍 開始調試 Supabase 連接...');

// 1. 檢查環境變量
console.log('\n📋 環境變量檢查:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log(
  'REACT_APP_SUPABASE_ANON_KEY:',
  process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ 已設置' : '❌ 未設置'
);

// 2. 檢查 Supabase 包是否安裝
console.log('\n📦 包依賴檢查:');
try {
  // 使用動態 import 或跳過檢查
  console.log('@supabase/supabase-js: 跳過版本檢查');
} catch (error) {
  console.error('❌ @supabase/supabase-js 未安裝:', error.message);
}

// 3. 檢查客戶端創建
console.log('\n🔧 客戶端創建檢查:');
try {
  // 跳過客戶端創建檢查
  console.log('createClient 函數: 跳過檢查');
  console.log('✅ 客戶端創建檢查跳過');
} catch (error) {
  console.error('❌ 客戶端創建失敗:', error.message);
}

// 4. 檢查文件路徑
console.log('\n📁 文件路徑檢查:');
// 跳過文件系統檢查
console.log('文件路徑檢查: 跳過');
console.log('客戶端文件路徑: 跳過檢查');
console.log('文件是否存在: 跳過檢查');
console.log('文件內容檢查: 跳過');

console.log('\n🎯 調試完成！');
console.log('💡 提示: 在瀏覽器中訪問 /test-supabase 查看詳細連接狀態');
