// 清理 Collaboration Posts 脚本
// 删除除了有图片的 Collaboration 之外的所有其他 Posts

console.log('🧹 开始清理 Collaboration Posts...');

// 获取所有 Collaboration 数据
const getCollaborationsFromStorage = () => {
  try {
    const stored = localStorage.getItem('collaborations');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading collaborations from storage:', error);
    return [];
  }
};

// 保存 Collaboration 数据
const saveCollaborationsToStorage = collaborations => {
  try {
    localStorage.setItem('collaborations', JSON.stringify(collaborations));
    console.log('✅ 数据已保存到 localStorage');
  } catch (error) {
    console.error('Error saving collaborations to storage:', error);
  }
};

// 检查 Collaboration 是否有图片
const hasImage = collaboration => {
  return (
    collaboration.heroImage ||
    collaboration.posterPreview ||
    collaboration.posterKey
  );
};

// 主清理函数
const cleanCollaborations = () => {
  console.log('📋 获取当前 Collaboration 数据...');

  const collaborations = getCollaborationsFromStorage();
  console.log(`📊 当前共有 ${collaborations.length} 个 Collaboration Posts`);

  // 显示所有 Collaboration 的信息
  collaborations.forEach((collab, index) => {
    console.log(
      `${index + 1}. "${collab.title}" - 作者: ${
        collab.author?.name || 'Unknown'
      } - 有图片: ${hasImage(collab) ? '✅' : '❌'}`
    );
  });

  // 保留有图片的 Collaboration
  const collaborationsWithImages = collaborations.filter(hasImage);
  console.log(
    `\n🖼️ 有图片的 Collaboration: ${collaborationsWithImages.length} 个`
  );

  // 删除没有图片的 Collaboration
  const collaborationsToDelete = collaborations.filter(
    collab => !hasImage(collab)
  );
  console.log(`🗑️ 要删除的 Collaboration: ${collaborationsToDelete.length} 个`);

  if (collaborationsToDelete.length > 0) {
    console.log('\n🗑️ 要删除的 Collaboration 列表:');
    collaborationsToDelete.forEach((collab, index) => {
      console.log(
        `${index + 1}. "${collab.title}" - 作者: ${
          collab.author?.name || 'Unknown'
        }`
      );
    });

    // 执行删除
    saveCollaborationsToStorage(collaborationsWithImages);
    console.log('\n✅ 清理完成！');
    console.log(
      `📊 清理后剩余 ${collaborationsWithImages.length} 个 Collaboration Posts`
    );
  } else {
    console.log('\n✅ 没有需要删除的 Collaboration Posts');
  }

  // 刷新页面以显示更新
  console.log('\n🔄 建议刷新页面以查看更新效果');
};

// 执行清理
cleanCollaborations();

// 导出函数供手动调用
window.cleanCollaborations = cleanCollaborations;
console.log(
  '\n💡 您也可以手动调用 window.cleanCollaborations() 来重新执行清理'
);
