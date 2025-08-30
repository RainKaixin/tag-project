// 简化的Deadline调试脚本
// 在Collaboration详情页的浏览器控制台中运行

console.log('=== 简化Deadline调试 ===');

// 1. 检查localStorage中的协作数据
console.log('1. 检查localStorage中的协作数据:');
const collaborationsData = localStorage.getItem('mock_collaborations');
if (collaborationsData) {
  const collaborations = JSON.parse(collaborationsData);
  console.log('找到协作数据:', collaborations.length, '个项目');

  collaborations.forEach((collab, index) => {
    console.log(`\n协作 ${index + 1}:`);
    console.log(`  ID: ${collab.id}`);
    console.log(`  Title: ${collab.title}`);
    console.log(`  applicationDeadline: "${collab.applicationDeadline}"`);
    console.log(`  deadline: "${collab.deadline}"`);
  });
} else {
  console.log('❌ 未找到协作数据');
}

// 2. 检查当前页面的协作ID
console.log('\n2. 检查当前页面:');
const pathParts = window.location.pathname.split('/');
const collaborationId = pathParts[pathParts.length - 1];
console.log('当前URL:', window.location.href);
console.log('协作ID:', collaborationId);

// 3. 查找当前协作数据
if (collaborationsData && collaborationId) {
  const collaborations = JSON.parse(collaborationsData);
  const currentCollaboration = collaborations.find(
    c => c.id === collaborationId
  );

  if (currentCollaboration) {
    console.log('\n3. 当前协作数据:');
    console.log(
      '  applicationDeadline:',
      currentCollaboration.applicationDeadline
    );
    console.log('  deadline:', currentCollaboration.deadline);

    // 4. 测试deadline显示逻辑
    console.log('\n4. 测试显示逻辑:');
    const deadline =
      currentCollaboration.applicationDeadline ||
      currentCollaboration.deadline ||
      'Not specified';
    console.log('  最终deadline值:', deadline);

    const shouldShow =
      deadline && deadline !== 'Not specified' && deadline !== '';
    console.log('  是否应该显示:', shouldShow);

    if (!shouldShow) {
      console.log('  ❌ 不显示的原因:');
      console.log('    - deadline存在:', !!deadline);
      console.log('    - 不是"Not specified":', deadline !== 'Not specified');
      console.log('    - 不是空字符串:', deadline !== '');
    }
  } else {
    console.log('❌ 未找到当前协作');
  }
}

console.log('\n=== 调试完成 ===');
