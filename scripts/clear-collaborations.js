// clear-collaborations.js - 清理Collaborations测试数据
// 用于删除所有Collaborations相关的localStorage数据，以便进行新的测试

console.log('🧹 开始清理Collaborations测试数据...');

// 定义需要清理的存储键
const COLLABORATION_KEYS = [
  'mock_collaborations',
  'mock_collaboration_applications',
  'mock_collaboration_likes',
  'mock_collaboration_views',
  'mock_collaboration_favorites',
  'tag.collaboration_requests',
];

// 清理函数
function clearCollaborationData() {
  try {
    let clearedCount = 0;

    // 清理指定的Collaborations键
    COLLABORATION_KEYS.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`✅ 已删除: ${key}`);
        clearedCount++;
      } else {
        console.log(`ℹ️  未找到: ${key}`);
      }
    });

    // 清理所有包含collaboration的键（兜底清理）
    const allKeys = Object.keys(localStorage);
    const collaborationKeys = allKeys.filter(key =>
      key.toLowerCase().includes('collaboration')
    );

    collaborationKeys.forEach(key => {
      if (!COLLABORATION_KEYS.includes(key)) {
        localStorage.removeItem(key);
        console.log(`✅ 已删除额外键: ${key}`);
        clearedCount++;
      }
    });

    console.log(`\n🎉 清理完成！共删除 ${clearedCount} 个数据项`);
    console.log('📝 现在可以开始新的Collaborations测试了');

    return { success: true, clearedCount };
  } catch (error) {
    console.error('❌ 清理过程中发生错误:', error);
    return { success: false, error: error.message };
  }
}

// 执行清理
const result = clearCollaborationData();

// 显示当前状态
console.log('\n📊 当前localStorage状态:');
const remainingKeys = Object.keys(localStorage).filter(key =>
  key.toLowerCase().includes('collaboration')
);
if (remainingKeys.length === 0) {
  console.log('✅ 所有Collaborations数据已清理完毕');
} else {
  console.log('⚠️  仍有以下Collaborations相关数据:');
  remainingKeys.forEach(key => console.log(`  - ${key}`));
}

// 导出结果供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clearCollaborationData, result };
}
