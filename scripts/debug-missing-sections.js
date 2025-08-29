// 调试缺失的 Deadline 和 Looking For 部分
console.log('🔍 [DEBUG] 开始检查缺失的 Deadline 和 Looking For 部分...');

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

      // 检查 Deadline 相关字段
      console.log('🔍 [DEBUG] Deadline 相关字段:');
      console.log('  - deadline:', latestCollaboration.deadline);
      console.log(
        '  - applicationDeadline:',
        latestCollaboration.applicationDeadline
      );
      console.log('  - dueDate:', latestCollaboration.dueDate);

      // 检查 Looking For 相关字段
      console.log('🔍 [DEBUG] Looking For 相关字段:');
      console.log('  - vision:', latestCollaboration.vision);
      console.log(
        '  - vision.lookingFor:',
        latestCollaboration.vision?.lookingFor
      );
      console.log('  - lookingFor:', latestCollaboration.lookingFor);
      console.log('  - roles:', latestCollaboration.roles);

      // 检查 ProjectProgressBar 需要的字段
      console.log('🔍 [DEBUG] ProjectProgressBar 需要的字段:');
      console.log(
        '  - project.deadline (用于 dueDate):',
        latestCollaboration.deadline
      );
      console.log('  - project.milestones:', latestCollaboration.milestones);

      // 检查 ProjectVision 需要的字段
      console.log('🔍 [DEBUG] ProjectVision 需要的字段:');
      console.log('  - project.vision:', latestCollaboration.vision);
      console.log(
        '  - project.vision.lookingFor:',
        latestCollaboration.vision?.lookingFor
      );
    }
  } catch (error) {
    console.error('❌ [DEBUG] 解析 localStorage 数据失败:', error);
  }
}

// 2. 检查当前页面的 URL 参数
console.log('🔍 [DEBUG] 当前页面 URL:', window.location.href);
console.log('🔍 [DEBUG] 当前页面路径:', window.location.pathname);

// 3. 检查是否有 Collaboration ID
const pathParts = window.location.pathname.split('/');
const collaborationId = pathParts[pathParts.length - 1];
console.log('🔍 [DEBUG] Collaboration ID:', collaborationId);

// 4. 检查数据映射问题
console.log('🔍 [DEBUG] 检查数据映射问题...');

// 5. 模拟正确的数据映射
const testData = {
  // 原始表单数据
  formData: {
    applicationDeadline: '2024-12-31',
    lookingFor: ['UI Designer', 'Frontend Developer'],
  },

  // API 数据格式
  apiData: {
    applicationDeadline: '2024-12-31',
    vision: {
      lookingFor: ['UI Designer', 'Frontend Developer'],
    },
  },

  // 详情页数据格式
  detailData: {
    deadline: '2024-12-31', // 应该映射到 applicationDeadline
    vision: {
      lookingFor: ['UI Designer', 'Frontend Developer'],
    },
  },
};

console.log('📝 [DEBUG] 正确的数据映射应该是:', testData);

// 6. 输出调试信息
console.log('🔍 [DEBUG] 调试完成！请检查上面的日志信息。');
