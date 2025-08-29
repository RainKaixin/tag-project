// 彻底清除所有测试评论数据的脚本
// 删除所有 Bryan 和 Alice 的测试评论，以及相关的测试数据

console.log('🧹 彻底清除所有测试评论数据...');

// 方法1：清除所有评论数据（最彻底的方法）
console.log('\n📋 方法1：清除所有评论数据');
const commentKeys = Object.keys(localStorage).filter(key =>
  key.startsWith('comments_')
);
console.log(`找到 ${commentKeys.length} 个评论数据键:`, commentKeys);

commentKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ 已清除: ${key}`);
});

// 方法2：清除其他可能相关的数据
console.log('\n📋 方法2：清除其他相关数据');
const otherKeys = Object.keys(localStorage).filter(
  key =>
    key.includes('comment') ||
    key.includes('reply') ||
    key.includes('test') ||
    key.includes('bryan') ||
    key.includes('alice')
);
console.log(`找到 ${otherKeys.length} 个其他相关数据键:`, otherKeys);

otherKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ 已清除: ${key}`);
});

// 方法3：检查并清除特定模式的测试数据
console.log('\n📋 方法3：检查特定测试数据模式');
const allKeys = Object.keys(localStorage);
const testPatterns = [
  'comment_bryan_',
  'comment_alice_',
  'test_comment',
  'default_comment',
];

allKeys.forEach(key => {
  const isTestData = testPatterns.some(pattern => key.includes(pattern));
  if (isTestData) {
    localStorage.removeItem(key);
    console.log(`✅ 清除测试数据: ${key}`);
  }
});

console.log('\n🎉 彻底清除完成！');
console.log('💡 现在刷新页面，所有作品将会有干净的评论区域。');
console.log('⚠️  注意：所有测试评论数据已被完全清除！');
console.log('📝 每个作品现在都有独立的评论区域，不会再有跨作品的评论显示。');
