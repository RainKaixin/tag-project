// run-favorites-migration.js - 执行 favorites 表迁移脚本

import fs from 'fs';
import path from 'path';

// 读取迁移文件
const migrationPath = path.join(
  __dirname,
  '../database/migrations/006_create_favorites_table.sql'
);
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('📋 Favorites 表迁移脚本内容:');
console.log('='.repeat(50));
console.log(migrationSQL);
console.log('='.repeat(50));

console.log('\n📝 执行说明:');
console.log('1. 请登录到您的Supabase控制台');
console.log('2. 进入 SQL Editor');
console.log('3. 复制上面的SQL内容');
console.log('4. 粘贴到SQL编辑器中并执行');
console.log('5. 执行完成后，收藏功能将使用新的RLS策略和聚合视图');

console.log('\n🔗 Supabase控制台链接:');
console.log('https://supabase.com/dashboard');

console.log('\n⚠️  注意事项:');
console.log('- 确保您有足够的权限执行DDL操作');
console.log('- 建议在测试环境中先执行');
console.log('- 执行前请备份重要数据');
console.log('- 此迁移将删除通配SELECT策略并创建聚合视图');

console.log('\n✅ 迁移完成后，收藏功能将更加安全和高效');
