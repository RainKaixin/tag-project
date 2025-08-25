// 清理收藏缓存
console.log('=== 清理收藏缓存 ===');

// 1. 清理localStorage中的收藏数据
console.log('[CLEAR] 清理 localStorage 中的收藏数据...');
localStorage.removeItem('tag_favorites');
localStorage.removeItem('tag_favorite_counters');

// 2. 检查是否清理成功
console.log('[CHECK] 检查清理结果:');
console.log('[CHECK] tag_favorites:', localStorage.getItem('tag_favorites'));
console.log(
  '[CHECK] tag_favorite_counters:',
  localStorage.getItem('tag_favorite_counters')
);

// 3. 提示用户刷新页面
console.log('[INFO] 缓存已清理，请刷新页面重新加载收藏数据');
console.log('[INFO] 建议使用 Ctrl+F5 强制刷新');

console.log('=== 清理完成 ===');







