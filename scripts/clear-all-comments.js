// 清除所有评论数据的脚本
// 用于解决评论跨作品显示的问题

console.log('🧹 清除所有评论数据...');

// 清除 localStorage 中的所有评论数据
const keys = Object.keys(localStorage).filter(key =>
  key.startsWith('comments_')
);
console.log(`找到 ${keys.length} 个评论数据键:`, keys);

keys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ 已清除: ${key}`);
});

// 清除其他可能相关的数据
const otherKeys = Object.keys(localStorage).filter(
  key => key.includes('comment') || key.includes('reply')
);
console.log(`找到 ${otherKeys.length} 个其他相关数据键:`, otherKeys);

otherKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ 已清除: ${key}`);
});

console.log('🎉 所有评论数据清除完成！');
console.log('💡 现在刷新页面，每个作品将会有独立的评论数据。');
console.log('⚠️  注意：这将清除所有现有的评论数据！');
