// 调试 Collaboration 数据流
console.log('🔍 [DEBUG] 开始检查 Collaboration 数据流...');

// 1. 检查 localStorage 中的 Collaboration 数据
const collaborationsFromStorage = localStorage.getItem('tag.collaborations');
console.log(
  '📦 [DEBUG] localStorage 中的 Collaboration 数据:',
  collaborationsFromStorage
);

if (collaborationsFromStorage) {
  try {
    const parsedCollaborations = JSON.parse(collaborationsFromStorage);
    console.log(
      '📦 [DEBUG] 解析后的 Collaboration 数据:',
      parsedCollaborations
    );

    // 检查最新的 Collaboration 数据
    if (parsedCollaborations.length > 0) {
      const latestCollaboration = parsedCollaborations[0];
      console.log('📦 [DEBUG] 最新的 Collaboration 数据:', latestCollaboration);
      console.log('📦 [DEBUG] duration 字段:', latestCollaboration.duration);
      console.log(
        '📦 [DEBUG] meetingSchedule 字段:',
        latestCollaboration.meetingSchedule
      );
      console.log('📦 [DEBUG] teamSize 字段:', latestCollaboration.teamSize);
    }
  } catch (error) {
    console.error('❌ [DEBUG] 解析 localStorage 数据失败:', error);
  }
}

// 2. 检查 IndexedDB 中的图片数据
console.log('📦 [DEBUG] 检查 IndexedDB 中的图片数据...');

// 3. 检查当前页面的 Collaboration 数据
if (window.location.pathname.includes('/collab/')) {
  console.log('🔍 [DEBUG] 当前在 Collaboration 详情页');

  // 尝试获取页面中的 project 数据
  const projectElements = document.querySelectorAll('[data-project]');
  console.log('📦 [DEBUG] 页面中的 project 元素:', projectElements);
}

// 4. 检查 Collaboration 服务的数据
console.log('🔍 [DEBUG] 检查 Collaboration 服务数据...');

// 5. 输出调试信息
console.log('🔍 [DEBUG] 调试完成！请检查上面的日志信息。');
