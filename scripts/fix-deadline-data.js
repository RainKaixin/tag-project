// 修复Deadline数据的脚本
// 在Collaboration详情页的浏览器控制台中运行

console.log('=== 修复Deadline数据 ===');

// 1. 获取现有协作数据
const collaborationsData = localStorage.getItem('mock_collaborations');
if (!collaborationsData) {
  console.log('❌ 未找到协作数据');
  return;
}

const collaborations = JSON.parse(collaborationsData);
console.log('找到协作数据:', collaborations.length, '个项目');

// 2. 修复每个协作的deadline字段
const fixedCollaborations = collaborations.map(collab => {
  console.log(`\n修复协作: ${collab.title}`);
  console.log(`  原始 applicationDeadline: "${collab.applicationDeadline}"`);
  console.log(`  原始 deadline: "${collab.deadline}"`);

  // 如果applicationDeadline为空或"Not specified"，设置为一个默认值
  if (
    !collab.applicationDeadline ||
    collab.applicationDeadline === 'Not specified' ||
    collab.applicationDeadline === ''
  ) {
    collab.applicationDeadline = '2024-12-31';
    console.log(
      `  ✅ 修复 applicationDeadline 为: "${collab.applicationDeadline}"`
    );
  }

  // 如果deadline为空或"Not specified"，设置为applicationDeadline的值
  if (
    !collab.deadline ||
    collab.deadline === 'Not specified' ||
    collab.deadline === ''
  ) {
    collab.deadline = collab.applicationDeadline;
    console.log(`  ✅ 修复 deadline 为: "${collab.deadline}"`);
  }

  return collab;
});

// 3. 保存修复后的数据
try {
  localStorage.setItem(
    'mock_collaborations',
    JSON.stringify(fixedCollaborations)
  );
  console.log('\n✅ 数据修复完成并保存');

  // 4. 验证修复结果
  console.log('\n4. 验证修复结果:');
  const savedData = localStorage.getItem('mock_collaborations');
  const savedCollaborations = JSON.parse(savedData);

  savedCollaborations.forEach((collab, index) => {
    console.log(`\n协作 ${index + 1}: ${collab.title}`);
    console.log(`  applicationDeadline: "${collab.applicationDeadline}"`);
    console.log(`  deadline: "${collab.deadline}"`);

    // 测试显示逻辑
    const deadline =
      collab.applicationDeadline || collab.deadline || 'Not specified';
    const shouldShow =
      deadline && deadline !== 'Not specified' && deadline !== '';
    console.log(`  应该显示deadline: ${shouldShow}`);
  });
} catch (error) {
  console.error('保存数据失败:', error);
}

console.log('\n=== 修复完成 ===');
console.log('请刷新页面查看效果');
