// 清除 Bryan 和 Alice 测试评论数据的脚本
// 专门用于删除所有作品中的 Bryan 和 Alice 测试评论

console.log('🧹 清除 Bryan 和 Alice 的测试评论数据...');

// 获取所有评论相关的键
const commentKeys = Object.keys(localStorage).filter(key =>
  key.startsWith('comments_')
);
console.log(`📊 找到 ${commentKeys.length} 个评论数据键:`);

let totalRemoved = 0;

commentKeys.forEach(key => {
  try {
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    console.log(`\n📁 检查 ${key}:`);
    console.log(`   📝 原始评论数量: ${comments.length}`);

    // 过滤掉 Bryan 和 Alice 的测试评论
    const filteredComments = comments.filter(comment => {
      const isBryanTest =
        comment.authorName === 'Bryan' && comment.text === 'Yeah!';
      const isAliceTest =
        comment.authorName === 'Alice' && comment.text === 'cool!';
      const isTestComment = isBryanTest || isAliceTest;

      if (isTestComment) {
        console.log(
          `   ❌ 删除测试评论: ${comment.authorName} - "${comment.text}"`
        );
        totalRemoved++;
        return false;
      }
      return true;
    });

    console.log(`   ✅ 保留评论数量: ${filteredComments.length}`);

    // 更新 localStorage
    if (filteredComments.length === 0) {
      // 如果没有评论了，删除整个键
      localStorage.removeItem(key);
      console.log(`   🗑️  删除空的评论键: ${key}`);
    } else {
      // 保存过滤后的评论
      localStorage.setItem(key, JSON.stringify(filteredComments));
      console.log(`   💾 更新评论数据: ${key}`);
    }
  } catch (error) {
    console.error(`❌ 处理 ${key} 时出错:`, error);
  }
});

console.log(`\n🎉 清除完成！`);
console.log(`📊 总共删除了 ${totalRemoved} 条测试评论`);
console.log(`💡 现在刷新页面，每个作品将会有独立的评论区域。`);
console.log(`⚠️  注意：所有 Bryan 和 Alice 的测试评论已被清除！`);
