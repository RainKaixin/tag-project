// 修复收藏数据
console.log('=== 修复收藏数据 ===');

// 1. 清理现有数据
console.log('[CLEAR] 清理现有收藏数据...');
localStorage.removeItem('tag_favorites');
localStorage.removeItem('tag_favorite_counters');

// 2. 手动设置正确的默认数据
console.log('[SET] 设置正确的默认收藏数据...');

const correctDefaultData = {
  user1: [
    {
      id: 'fav_' + Date.now() + '_1', // 收藏记录ID
      userId: 'user1',
      itemType: 'work',
      itemId: '1', // 作品ID - 这个是关键，必须是字符串"1"
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1天前
    },
    {
      id: 'fav_' + Date.now() + '_2', // 收藏记录ID
      userId: 'user1',
      itemType: 'collaboration',
      itemId: '1', // 协作ID - 这个是关键，必须是字符串"1"
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2天前
    },
  ],
};

localStorage.setItem('tag_favorites', JSON.stringify(correctDefaultData));

// 3. 验证设置结果
console.log('[VERIFY] 验证设置结果:');
const savedData = JSON.parse(localStorage.getItem('tag_favorites'));
console.log('[VERIFY] 保存的数据:', savedData);

savedData.user1.forEach((fav, index) => {
  console.log(`[VERIFY] 收藏${index + 1}:`, {
    recordId: fav.id,
    itemType: fav.itemType,
    itemId: fav.itemId,
    itemIdType: typeof fav.itemId,
  });
});

// 4. 测试作品查找
console.log('\n[TEST] 测试作品查找:');
const defaultArtworks = [
  { id: 1, title: 'Explosive Energy', artist: 'Alex Chen' },
  { id: 2, title: 'Dark Knight', artist: 'Sarah Kim' },
];

const testItemId = savedData.user1[0].itemId; // 应该是 "1"
console.log('[TEST] 测试 itemId:', testItemId, typeof testItemId);

const foundArtwork = defaultArtworks.find(
  art => art.id.toString() === testItemId
);
console.log('[TEST] 找到的作品:', foundArtwork);

console.log('\n[INFO] 数据修复完成！请刷新页面查看效果。');
console.log('=== 修复完成 ===');







