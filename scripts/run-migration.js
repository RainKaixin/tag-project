// run-migration.js - 执行数据库迁移脚本

const fs = require('fs');
const path = require('path');

// 读取迁移文件
const migrationPath = path.join(
  __dirname,
  '../database/migrations/create_artwork_views_table.sql'
);
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('📋 数据库迁移脚本内容:');
console.log('='.repeat(50));
console.log(migrationSQL);
console.log('='.repeat(50));

console.log('\n📝 执行说明:');
console.log('1. 请登录到您的Supabase控制台');
console.log('2. 进入 SQL Editor');
console.log('3. 复制上面的SQL内容');
console.log('4. 粘贴到SQL编辑器中并执行');
console.log('5. 执行完成后，浏览量统计功能即可使用');

console.log('\n🔗 Supabase控制台链接:');
console.log('https://supabase.com/dashboard');

console.log('\n⚠️  注意事项:');
console.log('- 确保您有足够的权限执行DDL操作');
console.log('- 建议在测试环境中先执行');
console.log('- 执行前请备份重要数据');

console.log('\n✅ 迁移完成后，系统将自动开始记录作品浏览量');
