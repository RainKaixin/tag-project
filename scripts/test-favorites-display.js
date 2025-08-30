// 测试Favorites中Collaboration显示的脚本
// 在浏览器控制台中运行

console.log('=== Favorites Collaboration 显示测试开始 ===');

// 1. 检查localStorage中的协作数据
console.log('1. 检查localStorage中的协作数据:');
try {
  const collaborationsData = localStorage.getItem('mock_collaborations');
  if (collaborationsData) {
    const collaborations = JSON.parse(collaborationsData);
    console.log('找到协作数据:', collaborations.length, '个项目');
    collaborations.forEach((collab, index) => {
      console.log(`  ${index + 1}. ID: ${collab.id}, Title: ${collab.title}`);
      console.log(
        `     图片字段: posterPreview=${collab.posterPreview}, heroImage=${collab.heroImage}`
      );
    });
  } else {
    console.log('❌ 未找到协作数据');
  }
} catch (error) {
  console.error('检查协作数据失败:', error);
}

// 2. 检查收藏数据
console.log('\n2. 检查收藏数据:');
try {
  const favoritesData = localStorage.getItem('tag_favorites');
  if (favoritesData) {
    const favorites = JSON.parse(favoritesData);
    console.log('找到收藏数据:', favorites);

    // 查找当前用户的收藏
    const currentUser = localStorage.getItem('tag.currentUserId');
    if (currentUser && favorites[currentUser]) {
      const userFavorites = favorites[currentUser];
      console.log(
        `用户 ${currentUser} 的收藏:`,
        userFavorites.length,
        '个项目'
      );

      userFavorites.forEach((fav, index) => {
        console.log(`  ${index + 1}. Type: ${fav.itemType}, ID: ${fav.itemId}`);
        if (fav.itemType === 'collaboration') {
          // 查找对应的协作数据
          const collaborations = JSON.parse(
            localStorage.getItem('mock_collaborations') || '[]'
          );
          const collab = collaborations.find(c => c.id === fav.itemId);
          if (collab) {
            console.log(`     找到协作: ${collab.title}`);
            console.log(
              `     图片字段: posterPreview=${collab.posterPreview}, heroImage=${collab.heroImage}`
            );
          } else {
            console.log(`     ❌ 未找到对应的协作数据`);
          }
        }
      });
    } else {
      console.log('❌ 未找到当前用户的收藏数据');
    }
  } else {
    console.log('❌ 未找到收藏数据');
  }
} catch (error) {
  console.error('检查收藏数据失败:', error);
}

// 3. 模拟favoritesHelpers函数
console.log('\n3. 模拟favoritesHelpers函数测试:');

// 模拟 getCollaborationDataById
function getCollaborationDataById(itemId) {
  try {
    const stored = localStorage.getItem('mock_collaborations');
    if (stored) {
      const collaborations = JSON.parse(stored);
      const collaboration = collaborations.find(collab => collab.id === itemId);
      if (collaboration) {
        console.log(`✅ 找到协作数据: ${collaboration.title}`);
        return collaboration;
      }
    }
    console.warn(`❌ 未找到协作数据: ${itemId}`);
    return null;
  } catch (error) {
    console.error('获取协作数据失败:', error);
    return null;
  }
}

// 模拟 getCollaborationImageUrl
async function getCollaborationImageUrl(itemId) {
  const collaboration = getCollaborationDataById(itemId);

  if (!collaboration) {
    console.warn('❌ 未找到协作数据:', itemId);
    return null;
  }

  console.log('获取图片URL，协作数据:', collaboration);

  // 优先使用 posterPreview
  if (collaboration.posterPreview) {
    try {
      // 模拟 imageStorage.getImageUrl
      console.log(`✅ 使用 posterPreview: ${collaboration.posterPreview}`);
      return `blob:mock-${collaboration.posterPreview}`;
    } catch (error) {
      console.warn('获取 posterPreview 图片失败:', error);
    }
  }

  // 回退到 heroImage
  if (collaboration.heroImage) {
    try {
      console.log(`✅ 使用 heroImage: ${collaboration.heroImage}`);
      return `blob:mock-${collaboration.heroImage}`;
    } catch (error) {
      console.warn('获取 heroImage 图片失败:', error);
    }
  }

  console.warn('❌ 未找到图片字段');
  return null;
}

// 4. 测试收藏的协作项目
console.log('\n4. 测试收藏的协作项目:');
try {
  const favoritesData = localStorage.getItem('tag_favorites');
  const currentUser = localStorage.getItem('tag.currentUserId');

  if (favoritesData && currentUser) {
    const favorites = JSON.parse(favoritesData);
    const userFavorites = favorites[currentUser] || [];

    const collaborationFavorites = userFavorites.filter(
      fav => fav.itemType === 'collaboration'
    );
    console.log(`找到 ${collaborationFavorites.length} 个收藏的协作项目`);

    for (const fav of collaborationFavorites) {
      console.log(`\n测试协作项目: ${fav.itemId}`);

      // 测试获取协作数据
      const collabData = getCollaborationDataById(fav.itemId);
      if (collabData) {
        console.log(`  ✅ 协作数据: ${collabData.title}`);

        // 测试获取图片URL
        const imageUrl = await getCollaborationImageUrl(fav.itemId);
        if (imageUrl) {
          console.log(`  ✅ 图片URL: ${imageUrl}`);
        } else {
          console.log(`  ❌ 未获取到图片URL`);
        }
      } else {
        console.log(`  ❌ 未获取到协作数据`);
      }
    }
  }
} catch (error) {
  console.error('测试收藏协作项目失败:', error);
}

console.log('\n=== Favorites Collaboration 显示测试完成 ===');
