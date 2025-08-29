// 检查 Collaboration 数据
console.log('🔍 [CHECK] 开始检查 Collaboration 数据...');

// 1. 检查 localStorage 中的 Collaboration 数据
const collaborationsFromStorage = localStorage.getItem('tag.collaborations');
console.log(
  '📦 [CHECK] localStorage 中的 Collaboration 数据:',
  collaborationsFromStorage
);

if (collaborationsFromStorage) {
  try {
    const parsedCollaborations = JSON.parse(collaborationsFromStorage);
    console.log(
      '📦 [CHECK] 解析后的 Collaboration 数据:',
      parsedCollaborations
    );

    // 检查最新的 Collaboration 数据
    if (parsedCollaborations.length > 0) {
      const latestCollaboration = parsedCollaborations[0];
      console.log('📦 [CHECK] 最新的 Collaboration 数据:', latestCollaboration);
      console.log('📦 [CHECK] duration 字段:', latestCollaboration.duration);
      console.log(
        '📦 [CHECK] meetingSchedule 字段:',
        latestCollaboration.meetingSchedule
      );
      console.log('📦 [CHECK] teamSize 字段:', latestCollaboration.teamSize);
      console.log(
        '📦 [CHECK] applicationDeadline 字段:',
        latestCollaboration.applicationDeadline
      );
    }
  } catch (error) {
    console.error('❌ [CHECK] 解析 localStorage 数据失败:', error);
  }
}

// 2. 检查当前页面的 URL 参数
console.log('🔍 [CHECK] 当前页面 URL:', window.location.href);
console.log('🔍 [CHECK] 当前页面路径:', window.location.pathname);

// 3. 检查是否有 Collaboration ID
const pathParts = window.location.pathname.split('/');
const collaborationId = pathParts[pathParts.length - 1];
console.log('🔍 [CHECK] Collaboration ID:', collaborationId);

// 4. 检查 Context 中的数据
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('🔍 [CHECK] React DevTools 可用');
}

console.log('🔍 [CHECK] 检查完成！');
