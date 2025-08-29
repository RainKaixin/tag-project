// 清除评论数据的测试脚本
// 用于清除现有的评论数据，让新的初始化逻辑生效

console.log('🧹 清除评论数据...');

// 清除 localStorage 中的所有评论数据
const keys = Object.keys(localStorage).filter(key =>
  key.startsWith('comments_')
);
console.log(`找到 ${keys.length} 个评论数据键:`, keys);

keys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ 已清除: ${key}`);
});

console.log('🎉 评论数据清除完成！');
console.log('💡 现在刷新页面，新的评论数据将会被初始化。');
