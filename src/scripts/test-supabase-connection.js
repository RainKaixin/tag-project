// test-supabase-connection.js
// 測試 Supabase 連接和環境變量

console.log('🧪 測試 Supabase 連接...');

// 檢查環境變量
console.log('📋 環境變量檢查:');
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log(
  'REACT_APP_SUPABASE_ANON_KEY:',
  process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ 已設置' : '❌ 未設置'
);
console.log(
  'REACT_APP_ENABLE_SUPABASE:',
  process.env.REACT_APP_ENABLE_SUPABASE
);

// 測試 Supabase 客戶端
try {
  // 使用动态导入避免 require 问题
  import('../services/supabase/client.js').then(
    ({ supabase, checkSupabaseConnection }) => {
      console.log('\n🔗 Supabase 客戶端檢查:');
      console.log('supabase.auth:', !!supabase.auth);
      console.log('supabase.from:', !!supabase.from);

      // 測試連接
      console.log('\n🌐 測試 Supabase 連接...');
      checkSupabaseConnection().then(isConnected => {
        if (isConnected) {
          console.log('✅ Supabase 連接成功！');
        } else {
          console.log('❌ Supabase 連接失敗，將使用 mock 數據');
        }
      });
    }
  );
} catch (error) {
  console.error('❌ 導入 Supabase 客戶端失敗:', error.message);
}

console.log('\n🎯 測試完成！');
