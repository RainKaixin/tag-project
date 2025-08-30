// 测试存储功能的简单脚本
// 在浏览器控制台中运行

console.log('=== 存储功能测试开始 ===');

// 1. 测试直接localStorage操作
console.log('1. 测试直接localStorage操作:');
try {
  localStorage.setItem('test_key', 'test_value');
  const result = localStorage.getItem('test_key');
  console.log(
    '直接localStorage测试:',
    result === 'test_value' ? '✅ 成功' : '❌ 失败'
  );
  localStorage.removeItem('test_key');
} catch (error) {
  console.error('直接localStorage测试失败:', error);
}

// 2. 测试收藏数据结构
console.log('\n2. 测试收藏数据结构:');
const testFavoritesData = {
  alice_123: [
    {
      id: 'fav_1',
      userId: 'alice_123',
      itemType: 'collaboration',
      itemId: 'collab_1756498213013_5eep2qq12',
      createdAt: new Date().toISOString(),
    },
  ],
};

try {
  localStorage.setItem('tag_favorites', JSON.stringify(testFavoritesData));
  const retrieved = JSON.parse(localStorage.getItem('tag_favorites'));
  console.log('收藏数据存储测试:', JSON.stringify(retrieved, null, 2));
  console.log(
    '数据完整性测试:',
    retrieved['alice_123']?.[0]?.itemId === 'collab_1756498213013_5eep2qq12'
      ? '✅ 成功'
      : '❌ 失败'
  );
} catch (error) {
  console.error('收藏数据存储测试失败:', error);
}

// 3. 测试用户ID存储
console.log('\n3. 测试用户ID存储:');
try {
  localStorage.setItem('tag.currentUserId', 'alice_123');
  const userId = localStorage.getItem('tag.currentUserId');
  console.log(
    '用户ID存储测试:',
    userId === 'alice_123' ? '✅ 成功' : '❌ 失败'
  );
} catch (error) {
  console.error('用户ID存储测试失败:', error);
}

// 4. 模拟收藏服务逻辑
console.log('\n4. 模拟收藏服务逻辑:');
async function testFavoritesService() {
  try {
    // 模拟存储操作
    const storage = JSON.parse(localStorage.getItem('tag_favorites') || '{}');
    const userId = localStorage.getItem('tag.currentUserId');

    console.log('当前用户ID:', userId);
    console.log('当前存储数据:', storage);

    if (!userId) {
      console.log('❌ 用户未登录');
      return;
    }

    const userFavorites = storage[userId] || [];
    const testItemId = 'collab_1756498213013_5eep2qq12';

    // 检查是否已收藏
    const existingIndex = userFavorites.findIndex(
      fav => fav.itemType === 'collaboration' && fav.itemId === testItemId
    );

    console.log('查找收藏项索引:', existingIndex);
    console.log('当前收藏状态:', existingIndex !== -1 ? '已收藏' : '未收藏');

    if (existingIndex === -1) {
      // 添加收藏
      const newFavorite = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        userId,
        itemType: 'collaboration',
        itemId: testItemId,
        createdAt: new Date().toISOString(),
      };

      userFavorites.push(newFavorite);
      storage[userId] = userFavorites;
      localStorage.setItem('tag_favorites', JSON.stringify(storage));

      console.log('✅ 添加收藏成功:', newFavorite);
    } else {
      console.log('✅ 已收藏，无需重复添加');
    }

    // 验证收藏状态
    const verifyStorage = JSON.parse(
      localStorage.getItem('tag_favorites') || '{}'
    );
    const verifyUserFavorites = verifyStorage[userId] || [];
    const verifyIndex = verifyUserFavorites.findIndex(
      fav => fav.itemType === 'collaboration' && fav.itemId === testItemId
    );

    console.log(
      '验证收藏状态:',
      verifyIndex !== -1 ? '✅ 已收藏' : '❌ 未收藏'
    );
    console.log('最终存储数据:', verifyStorage);
  } catch (error) {
    console.error('收藏服务测试失败:', error);
  }
}

// 运行测试
testFavoritesService();

console.log('\n=== 存储功能测试完成 ===');
console.log('请检查上面的输出结果，确认存储功能是否正常');
