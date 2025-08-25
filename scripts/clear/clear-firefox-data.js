// 清理 Firefox 浏览器数据的脚本
// 在 Firefox 浏览器控制台中运行此脚本

console.log('🧹 开始清理 Firefox 浏览器数据...');

// 1. 清理 localStorage 数据
console.log('📦 清理 localStorage 数据...');
const localStorageKeys = Object.keys(localStorage);
const tagKeys = localStorageKeys.filter(
  key =>
    key.includes('tag') ||
    key.includes('portfolio') ||
    key.includes('favorite') ||
    key.includes('work')
);

tagKeys.forEach(key => {
  console.log(`删除 localStorage 键: ${key}`);
  localStorage.removeItem(key);
});

// 2. 清理 IndexedDB 数据
console.log('🗄️ 清理 IndexedDB 数据...');

// 清理作品数据
const clearPortfolioData = async () => {
  try {
    const db = await indexedDB.open('tag-portfolio-db', 1);
    db.onsuccess = event => {
      const database = event.target.result;

      // 清理作品表
      const portfolioTransaction = database.transaction(
        ['portfolios'],
        'readwrite'
      );
      const portfolioStore = portfolioTransaction.objectStore('portfolios');
      portfolioStore.clear();
      console.log('✅ 清理作品数据完成');

      // 清理图片表
      const imageTransaction = database.transaction(['images'], 'readwrite');
      const imageStore = imageTransaction.objectStore('images');
      imageStore.clear();
      console.log('✅ 清理图片数据完成');

      // 清理头像表
      const avatarTransaction = database.transaction(['avatars'], 'readwrite');
      const avatarStore = avatarTransaction.objectStore('avatars');
      avatarStore.clear();
      console.log('✅ 清理头像数据完成');

      database.close();
    };
  } catch (error) {
    console.log('⚠️ IndexedDB 清理失败:', error);
  }
};

// 3. 清理收藏夹数据
console.log('❤️ 清理收藏夹数据...');
const clearFavorites = async () => {
  try {
    const db = await indexedDB.open('tag-favorites-db', 1);
    db.onsuccess = event => {
      const database = event.target.result;
      const transaction = database.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');
      store.clear();
      console.log('✅ 清理收藏夹数据完成');
      database.close();
    };
  } catch (error) {
    console.log('⚠️ 收藏夹清理失败:', error);
  }
};

// 4. 清理种子数据保护键
console.log('🌱 清理种子数据保护键...');
const seedKeys = [
  'tag.seed.initialized',
  'tag.default.data.loaded',
  'tag.portfolio.seed',
  'tag.works.seed',
  'tag.favorites.seed',
];

seedKeys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`删除种子键: ${key}`);
  }
});

// 执行清理
clearPortfolioData();
clearFavorites();

// 5. 强制刷新页面
console.log('🔄 准备刷新页面...');
setTimeout(() => {
  console.log('✅ 数据清理完成！页面将在 3 秒后刷新...');
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}, 1000);

console.log('📋 清理任务已启动，请等待完成...');
