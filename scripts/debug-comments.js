// 调试评论数据的脚本
// 用于检查当前评论数据的状态和问题

console.log('🔍 调试评论数据...');

// 获取所有评论相关的键
const commentKeys = Object.keys(localStorage).filter(key =>
  key.startsWith('comments_')
);
console.log(`📊 找到 ${commentKeys.length} 个评论数据键:`);

commentKeys.forEach(key => {
  try {
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    console.log(`\n📁 ${key}:`);
    console.log(`   📝 评论数量: ${comments.length}`);

    if (comments.length > 0) {
      comments.forEach((comment, index) => {
        console.log(`   ${index + 1}. ID: ${comment.id}`);
        console.log(`      📄 内容: ${comment.text || comment.content}`);
        console.log(
          `      👤 作者: ${comment.authorName} (${comment.authorId})`
        );
        console.log(`      🎨 作品ID: ${comment.workId}`);
        console.log(`      🔗 父评论: ${comment.parentId || '无'}`);
        console.log(
          `      🕒 时间: ${new Date(comment.createdAt).toLocaleString()}`
        );
        console.log(`      ❌ 已删除: ${comment.isDeleted || false}`);
      });
    }
  } catch (error) {
    console.error(`❌ 解析 ${key} 时出错:`, error);
  }
});

// 检查是否有重复的评论ID
console.log('\n🔍 检查重复评论ID...');
const allCommentIds = [];
commentKeys.forEach(key => {
  try {
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    comments.forEach(comment => {
      allCommentIds.push(comment.id);
    });
  } catch (error) {
    console.error(`❌ 解析 ${key} 时出错:`, error);
  }
});

const duplicateIds = allCommentIds.filter(
  (id, index) => allCommentIds.indexOf(id) !== index
);
if (duplicateIds.length > 0) {
  console.log(`⚠️  发现 ${duplicateIds.length} 个重复的评论ID:`, duplicateIds);
} else {
  console.log('✅ 没有发现重复的评论ID');
}

// 检查评论数据隔离
console.log('\n🔍 检查评论数据隔离...');
const workIdGroups = {};
commentKeys.forEach(key => {
  const workId = key.replace('comments_', '');
  try {
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    workIdGroups[workId] = comments.length;
  } catch (error) {
    console.error(`❌ 解析 ${key} 时出错:`, error);
  }
});

console.log('📊 各作品的评论数量:');
Object.entries(workIdGroups).forEach(([workId, count]) => {
  console.log(`   🎨 ${workId}: ${count} 条评论`);
});

console.log('\n🎉 调试完成！');
