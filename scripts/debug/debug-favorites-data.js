// 调试收藏数据结构
console.log('=== 调试收藏数据结构 ===');

// 1. 检查localStorage中的原始数据
const rawData = localStorage.getItem('tag_favorites');
console.log('[RAW] localStorage.getItem("tag_favorites"):', rawData);

if (rawData) {
  try {
    const parsedData = JSON.parse(rawData);
    console.log('[PARSED] 解析后的数据:', parsedData);

    // 检查user1的收藏
    const user1Favorites = parsedData.user1 || [];
    console.log('[USER1] user1的收藏数量:', user1Favorites.length);

    user1Favorites.forEach((fav, index) => {
      console.log(`[FAV_${index}] 收藏记录:`, {
        id: fav.id,
        itemType: fav.itemType,
        itemId: fav.itemId,
        createdAt: fav.createdAt,
      });

      // 检查itemId的类型和值
      console.log(`[FAV_${index}] itemId详情:`, {
        value: fav.itemId,
        type: typeof fav.itemId,
        length: fav.itemId?.length,
      });
    });
  } catch (error) {
    console.error('[ERROR] 解析数据失败:', error);
  }
} else {
  console.log('[INFO] localStorage中没有收藏数据');
}

// 2. 测试作品查找
console.log('\n=== 测试作品查找 ===');
const testItemIds = ['1', '2', 'mock_1755714932817_htyplp3qyb4'];

const defaultArtworks = [
  { id: 1, title: 'Explosive Energy', artist: 'Alex Chen' },
  { id: 2, title: 'Dark Knight', artist: 'Sarah Kim' },
];

testItemIds.forEach(itemId => {
  console.log(`[TEST] 测试 itemId: "${itemId}" (${typeof itemId})`);

  // 测试不同的查找方式
  const result1 = defaultArtworks.find(art => art.id === parseInt(itemId));
  const result2 = defaultArtworks.find(art => art.id.toString() === itemId);
  const result3 = defaultArtworks.find(art => art.id == itemId);

  console.log(`[TEST] parseInt匹配:`, result1?.title || 'undefined');
  console.log(`[TEST] toString匹配:`, result2?.title || 'undefined');
  console.log(`[TEST] 宽松匹配:`, result3?.title || 'undefined');
  console.log('---');
});

console.log('=== 调试完成 ===');







