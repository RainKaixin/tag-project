// 清理旧的测试数据脚本
// 在浏览器控制台中运行此脚本

console.log('开始清理旧的测试数据...');

// 清理所有 portfolio 相关的 localStorage 数据
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (key.startsWith('portfolio_') || key.includes('portfolio'))) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  console.log(`删除: ${key}`);
  localStorage.removeItem(key);
});

console.log(`清理完成，删除了 ${keysToRemove.length} 个旧数据项`);
console.log('请刷新页面，然后重新上传图片进行测试');
