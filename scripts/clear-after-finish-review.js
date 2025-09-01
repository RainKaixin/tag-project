// 清理 After Finish Review 相关数据
console.log('🧹 清理 After Finish Review 相关数据...');

// 清理 localStorage 中的 review 相关数据
const reviewKeys = [
  'tag_review_requests',
  'tag_final_comments',
  'tag_notifications',
];

reviewKeys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ 已删除 localStorage 键: ${key}`);
  } else {
    console.log(`ℹ️  localStorage 键不存在: ${key}`);
  }
});

// 清理其他可能的 review 相关键
const allKeys = Object.keys(localStorage);
const reviewRelatedKeys = allKeys.filter(
  key =>
    key.includes('review') || key.includes('request') || key.includes('comment')
);

reviewRelatedKeys.forEach(key => {
  if (!reviewKeys.includes(key)) {
    localStorage.removeItem(key);
    console.log(`✅ 已删除相关键: ${key}`);
  }
});

console.log('🎉 After Finish Review 数据清理完成！');
console.log('📝 现在用户可以使用 "Add Experience" 功能了');
