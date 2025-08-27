// clear-draft-test-data.js: 清理草稿測試數據
console.log('Clearing draft test data...');

// 清理 localStorage 中的草稿數據
if (typeof localStorage !== 'undefined') {
  // 清理 tag_collaboration_drafts
  localStorage.removeItem('tag_collaboration_drafts');
  console.log('✅ Cleared tag_collaboration_drafts');

  // 清理舊的 collaboration_drafts（如果存在）
  localStorage.removeItem('collaboration_drafts');
  console.log('✅ Cleared collaboration_drafts');

  console.log('🎉 Draft test data cleared successfully!');
} else {
  console.log('❌ localStorage not available');
}
