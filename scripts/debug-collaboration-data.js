// 调试协作数据的脚本
console.log('=== 调试协作数据 ===');

// 检查localStorage中的协作数据
const collaborationsData = localStorage.getItem('mock_collaborations');
if (collaborationsData) {
  const collaborations = JSON.parse(collaborationsData);
  console.log('localStorage中的协作数据:', collaborations);

  // 检查每个协作的deadline字段
  collaborations.forEach((collab, index) => {
    console.log(`\n--- 协作 ${index + 1}: ${collab.title} ---`);
    console.log('ID:', collab.id);
    console.log('applicationDeadline:', collab.applicationDeadline);
    console.log('deadline:', collab.deadline);
    console.log('所有字段:', Object.keys(collab));
  });
} else {
  console.log('❌ localStorage中没有协作数据');

  // 检查其他可能的存储键
  const allKeys = Object.keys(localStorage);
  console.log('localStorage中的所有键:', allKeys);

  // 查找包含collaboration的键
  const collaborationKeys = allKeys.filter(
    key => key.includes('collaboration') || key.includes('Collaboration')
  );
  console.log('包含collaboration的键:', collaborationKeys);

  collaborationKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      console.log(`\n--- ${key} ---`);
      console.log(data);
    } catch (error) {
      console.log(`读取 ${key} 失败:`, error);
    }
  });
}

// 检查当前页面的URL
console.log('\n=== 当前页面信息 ===');
console.log('URL:', window.location.href);
console.log('路径:', window.location.pathname);

// 尝试从URL提取协作ID
const pathParts = window.location.pathname.split('/');
const collaborationId = pathParts[pathParts.length - 1];
console.log('从URL提取的协作ID:', collaborationId);

// 如果有协作数据，查找当前协作
if (collaborationsData) {
  const collaborations = JSON.parse(collaborationsData);
  const currentCollaboration = collaborations.find(
    c => c.id === collaborationId
  );

  if (currentCollaboration) {
    console.log('\n=== 当前协作详情 ===');
    console.log('当前协作:', currentCollaboration);
    console.log(
      'applicationDeadline:',
      currentCollaboration.applicationDeadline
    );
    console.log('deadline:', currentCollaboration.deadline);

    // 模拟processProjectData处理
    const processedData = {
      deadline:
        currentCollaboration.applicationDeadline ||
        currentCollaboration.deadline ||
        null,
      applicationDeadline:
        currentCollaboration.applicationDeadline ||
        currentCollaboration.deadline ||
        null,
    };

    console.log('处理后的数据:', processedData);

    // 模拟显示逻辑
    const deadlineValue =
      processedData.deadline || processedData.applicationDeadline || '';
    const shouldShowDeadline = !!deadlineValue && deadlineValue.trim() !== '';

    console.log('显示逻辑结果:', {
      deadlineValue,
      shouldShowDeadline,
      deadlineDisplayText: deadlineValue,
    });
  } else {
    console.log('❌ 未找到当前协作');
  }
}

console.log('\n=== 调试完成 ===');
