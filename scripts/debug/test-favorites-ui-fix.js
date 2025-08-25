// 测试收藏UI修复效果
console.log('=== 测试收藏UI修复效果 ===');

// 1. 检查图片元素
console.log('\n[TEST 1] 检查收藏卡片中的图片元素:');
const favoriteCards = document.querySelectorAll(
  '[class*="FavoriteWorkCard"] img, .favorites img'
);
console.log('[IMAGES] 找到的图片元素数量:', favoriteCards.length);

favoriteCards.forEach((img, index) => {
  console.log(`[IMAGE ${index + 1}]:`, {
    src: img.src,
    alt: img.alt,
    className: img.className,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    complete: img.complete,
    currentSrc: img.currentSrc,
  });

  // 检查图片是否加载成功
  if (img.complete) {
    console.log(`[IMAGE ${index + 1}] 图片已加载完成`);
  } else {
    console.log(`[IMAGE ${index + 1}] 图片正在加载中...`);
  }
});

// 2. 检查收藏卡片结构
console.log('\n[TEST 2] 检查收藏卡片结构:');
const favoriteContainers = document.querySelectorAll(
  '[class*="FavoriteWorkCard"], .favorites > div'
);
console.log('[CONTAINERS] 找到的收藏容器数量:', favoriteContainers.length);

favoriteContainers.forEach((container, index) => {
  console.log(`[CONTAINER ${index + 1}]:`, {
    className: container.className,
    children: container.children.length,
    hasImage: !!container.querySelector('img'),
    hasLink: !!container.querySelector('a'),
    hasButton: !!container.querySelector('button'),
  });
});

// 3. 检查CSS样式
console.log('\n[TEST 3] 检查CSS样式:');
favoriteCards.forEach((img, index) => {
  const styles = window.getComputedStyle(img);
  console.log(`[STYLES ${index + 1}]:`, {
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    width: styles.width,
    height: styles.height,
    objectFit: styles.objectFit,
    position: styles.position,
    zIndex: styles.zIndex,
  });
});

// 4. 检查网络请求
console.log('\n[TEST 4] 检查图片网络请求:');
favoriteCards.forEach((img, index) => {
  if (img.src && !img.src.startsWith('data:')) {
    console.log(`[NETWORK ${index + 1}] 图片URL:`, img.src);

    // 测试图片URL是否可访问
    fetch(img.src, { method: 'HEAD' })
      .then(response => {
        console.log(
          `[NETWORK ${index + 1}] 状态:`,
          response.status,
          response.ok ? '✅ 可访问' : '❌ 不可访问'
        );
      })
      .catch(error => {
        console.error(`[NETWORK ${index + 1}] 错误:`, error.message);
      });
  }
});

// 5. 检查localStorage数据
console.log('\n[TEST 5] 检查localStorage数据:');
const favoritesData = localStorage.getItem('tag_favorites');
if (favoritesData) {
  try {
    const parsed = JSON.parse(favoritesData);
    console.log('[STORAGE] 收藏数据:', parsed);

    const user1Favorites = parsed.user1 || [];
    user1Favorites.forEach((fav, index) => {
      console.log(`[FAVORITE ${index + 1}]:`, {
        itemType: fav.itemType,
        itemId: fav.itemId,
        recordId: fav.id,
      });
    });
  } catch (error) {
    console.error('[STORAGE] 解析失败:', error);
  }
} else {
  console.log('[STORAGE] 没有收藏数据');
}

// 6. 模拟图片加载测试
console.log('\n[TEST 6] 模拟图片加载测试:');
const testImageUrls = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1489599435384-d5f1a131c7dc?w=400&h=400&fit=crop',
];

testImageUrls.forEach((url, index) => {
  const testImg = new Image();
  testImg.onload = () => {
    console.log(`[TEST_IMG ${index + 1}] ✅ 加载成功:`, url);
  };
  testImg.onerror = () => {
    console.log(`[TEST_IMG ${index + 1}] ❌ 加载失败:`, url);
  };
  testImg.src = url;
});

console.log('\n=== 测试完成 ===');
console.log(
  '如果看到图片元素存在且src正确，但UI仍显示占位图，可能是CSS样式问题。'
);







