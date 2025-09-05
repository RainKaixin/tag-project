// 運行 artwork_likes 表遷移腳本

console.log('🚀 開始執行 artwork_likes 表遷移...');

// 動態導入Supabase客戶端
import('../src/services/supabase/client.js')
  .then(async ({ supabase }) => {
    try {
      // 讀取遷移文件
      const fs = await import('fs');
      const path = await import('path');

      const migrationPath = path.join(
        process.cwd(),
        'database/migrations/005_create_artwork_likes_table.sql'
      );
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      console.log('📄 讀取遷移文件:', migrationPath);

      // 執行遷移
      console.log('⚡ 執行SQL遷移...');
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: migrationSQL,
      });

      if (error) {
        console.error('❌ 遷移失敗:', error);

        // 如果 exec_sql 函數不存在，嘗試直接執行
        if (error.message.includes('function exec_sql')) {
          console.log('🔄 嘗試直接執行SQL...');

          // 分割SQL語句並逐個執行
          const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

          for (const statement of statements) {
            console.log('執行語句:', statement.substring(0, 50) + '...');
            const { error: stmtError } = await supabase.rpc('exec', {
              sql: statement,
            });
            if (stmtError) {
              console.error('語句執行失敗:', stmtError);
            } else {
              console.log('✅ 語句執行成功');
            }
          }
        }
      } else {
        console.log('✅ 遷移成功完成!');
      }

      // 驗證表是否創建成功
      console.log('🔍 驗證表創建...');
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'artwork_likes');

      if (tableError) {
        console.error('❌ 驗證失敗:', tableError);
      } else if (tables && tables.length > 0) {
        console.log('✅ artwork_likes 表創建成功!');
      } else {
        console.log('⚠️ artwork_likes 表未找到，可能需要手動創建');
      }
    } catch (error) {
      console.error('❌ 遷移過程出錯:', error);
    }
  })
  .catch(error => {
    console.error('❌ 無法導入Supabase客戶端:', error);
    console.log('💡 請確保環境變量已正確配置');
  });
