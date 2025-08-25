// 调试收藏数据问题
console.log('=== 收藏数据调试 ===');

// 1. 检查localStorage中的收藏数据
console.log(
  '[LS] localStorage.getItem("tag_favorites"):',
  localStorage.getItem('tag_favorites')
);

// 2. 检查收藏计数数据
console.log(
  '[LS] localStorage.getItem("tag_favorite_counters"):',
  localStorage.getItem('tag_favorite_counters')
);

// 3. 解析收藏数据
try {
  const favoritesData = JSON.parse(
    localStorage.getItem('tag_favorites') || '{}'
  );
  console.log('[FAV] Parsed favorites data:', favoritesData);

  // 检查user1的收藏
  const user1Favorites = favoritesData.user1 || [];
  console.log('[FAV] User1 favorites:', user1Favorites);

  // 检查作品收藏
  const workFavorites = user1Favorites.filter(fav => fav.itemType === 'work');
  console.log('[FAV] Work favorites:', workFavorites);

  // 检查协作收藏
  const collabFavorites = user1Favorites.filter(
    fav => fav.itemType === 'collaboration'
  );
  console.log('[FAV] Collaboration favorites:', collabFavorites);
} catch (error) {
  console.error('[ERROR] Failed to parse favorites data:', error);
}

// 4. 检查作品ID为1的数据
console.log('[WORK_ID_1] 检查作品ID为1的数据:');
const workId1 = '1';
console.log('[WORK_ID_1] itemId:', workId1, 'type:', typeof workId1);

// 5. 模拟收藏卡片的查找逻辑
const defaultArtworks = [
  {
    id: 1,
    title: 'Explosive Energy',
    artist: 'Alex Chen',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: 'Visual Effects',
  },
  {
    id: 2,
    title: 'Dark Knight',
    artist: 'Sarah Kim',
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    category: 'Game Design',
  },
];

// 测试不同的查找方式
console.log('[TEST] 测试查找逻辑:');
console.log('[TEST] parseInt(workId1):', parseInt(workId1));
console.log('[TEST] workId1.toString():', workId1.toString());

// 测试find方法
const artwork1 = defaultArtworks.find(art => art.id === parseInt(workId1));
const artwork2 = defaultArtworks.find(art => art.id.toString() === workId1);
const artwork3 = defaultArtworks.find(art => art.id === workId1);

console.log('[TEST] find(art.id === parseInt(workId1)):', artwork1);
console.log('[TEST] find(art.id.toString() === workId1):', artwork2);
console.log('[TEST] find(art.id === workId1):', artwork3);

console.log('=== 调试完成 ===');







