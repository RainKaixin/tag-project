// 调试草稿数据结构
console.log('=== 草稿数据结构调试 ===');

// 检查草稿数据
const draftData = localStorage.getItem('tag_collaboration_drafts');
console.log('原始草稿数据:', draftData);

if (draftData) {
  try {
    const parsed = JSON.parse(draftData);
    console.log('解析后的草稿数据:', parsed);

    // 遍历所有用户ID
    Object.keys(parsed).forEach(userId => {
      console.log(`\n用户 ${userId} 的草稿:`);
      const userDrafts = parsed[userId];
      console.log('用户草稿数组:', userDrafts);

      if (Array.isArray(userDrafts)) {
        userDrafts.forEach((draft, index) => {
          console.log(`\n草稿 ${index + 1}:`);
          console.log('- ID:', draft.id);
          console.log('- 标题:', draft.title);
          console.log('- 用户ID:', draft.userId);
          console.log('- 创建时间:', draft.createdAt);
          console.log('- 更新时间:', draft.updatedAt);
          console.log('- 草稿类型:', draft.draftType);
          console.log('- 完整数据:', draft);
        });
      }
    });
  } catch (error) {
    console.error('解析草稿数据失败:', error);
  }
} else {
  console.log('没有找到草稿数据');
}

// 检查其他相关数据
console.log('\n=== 其他相关数据 ===');
const allKeys = Object.keys(localStorage);
const draftKeys = allKeys.filter(key => key.includes('draft'));
console.log('包含draft的键:', draftKeys);

draftKeys.forEach(key => {
  console.log(`\n键 ${key}:`);
  const value = localStorage.getItem(key);
  console.log('值:', value);
});
