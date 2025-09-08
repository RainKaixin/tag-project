// 清理 Mock 數據的腳本
console.log('🧹 開始清理 Mock 數據...');

// 要清理的 Mock 數據 key
const mockDataKeys = [
  'tag_artwork_likes',
  'tag_artist_follows',
  'tag_notifications',
  'tag_favorites',
  'tag_artwork_views',
  'tag_collaboration_drafts',
  'tag_apply_form_data_colla',
  'tag_applications_data_coll',
  'tag_positions_status_colla',
  'tag_review_requests',
  'tag_final_comments',
  'tag_favorite_counters',
  'tag_guidelines_accepted',
  'tag_service_data',
  'tag.currentUserId', // 這個很重要！
  'tag.userProfile.512411b2-adac-4dec-8fe5-63fb405f756b',
  'tag.avatars.512411b2-adac-4dec-8fe5-63fb405f756b',
  'tag.avatarCache',
  'u.alice.avatarCache',
];

// 清理指定的 key
mockDataKeys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ 已清理: ${key}`);
  } else {
    console.log(`⚠️ 未找到: ${key}`);
  }
});

// 清理所有以 tag_ 開頭的 key
const allKeys = Object.keys(localStorage);
const tagKeys = allKeys.filter(key => key.startsWith('tag_'));
tagKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ 已清理: ${key}`);
});

// 清理所有以 tag. 開頭的 key
const tagDotKeys = allKeys.filter(key => key.startsWith('tag.'));
tagDotKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ 已清理: ${key}`);
});

console.log('🎯 Mock 數據清理完成！');
console.log('💡 現在請刷新頁面並重新登錄 Supabase 用戶');
