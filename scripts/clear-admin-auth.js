// clear-admin-auth.js - 清理管理员认证数据脚本

console.log('=== 清理管理员认证数据 ===');

// 清除所有可能的认证数据
const keysToRemove = [
  'admin_auth_data',
  'admin_super_token',
  'admin_token_timestamp',
];

let removedCount = 0;

keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ 已删除: ${key}`);
    removedCount++;
  } else {
    console.log(`ℹ️  未找到: ${key}`);
  }
});

console.log(`\n清理完成！共删除了 ${removedCount} 个认证数据项`);
console.log('现在刷新页面将需要重新输入用户名和密码登录');

// 显示当前localStorage中的所有键（用于调试）
console.log('\n当前localStorage中的所有键:');
Object.keys(localStorage).forEach(key => {
  console.log(`- ${key}`);
});
