// 调试申请状态存储和恢复的脚本
console.log('=== 申请状态调试脚本 ===');

// 检查localStorage中的申请数据
const checkApplicationData = () => {
  console.log('\n1. 检查localStorage中的申请数据:');

  const allKeys = Object.keys(localStorage);
  const applicationKeys = allKeys.filter(key =>
    key.startsWith('tag_applications_data')
  );

  console.log('找到的申请数据键:', applicationKeys);

  applicationKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      const parsedData = JSON.parse(data);
      console.log(`\n键: ${key}`);
      console.log('数据:', parsedData);

      if (parsedData.applications) {
        Object.entries(parsedData.applications).forEach(
          ([positionId, applications]) => {
            console.log(`  职位 ${positionId} 的申请:`, applications);
          }
        );
      }
    } catch (error) {
      console.error(`解析键 ${key} 时出错:`, error);
    }
  });
};

// 检查协作项目数据
const checkCollaborationData = () => {
  console.log('\n2. 检查localStorage中的协作项目数据:');

  try {
    const collaborationsData = localStorage.getItem('mock_collaborations');
    if (collaborationsData) {
      const collaborations = JSON.parse(collaborationsData);
      console.log('协作项目数据:', collaborations);

      collaborations.forEach(collab => {
        console.log(`\n项目 ${collab.id}:`);
        console.log('  - 角色/职位:', collab.roles);
        console.log('  - 合作者:', collab.collaborators);
        console.log('  - Vision合作者:', collab.vision?.collaborators);
      });
    } else {
      console.log('没有找到协作项目数据');
    }
  } catch (error) {
    console.error('解析协作项目数据时出错:', error);
  }
};

// 模拟申请状态恢复逻辑
const simulateStatusRestore = () => {
  console.log('\n3. 模拟申请状态恢复逻辑:');

  // 获取申请数据
  const applicationKeys = Object.keys(localStorage).filter(key =>
    key.startsWith('tag_applications_data')
  );

  applicationKeys.forEach(key => {
    const collaborationId = key.replace('tag_applications_data_', '');
    console.log(`\n处理协作项目 ${collaborationId}:`);

    try {
      const data = localStorage.getItem(key);
      const parsedData = JSON.parse(data);

      if (parsedData.applications) {
        Object.entries(parsedData.applications).forEach(
          ([positionId, applications]) => {
            console.log(`  职位 ${positionId}:`);
            applications.forEach(app => {
              console.log(
                `    - 用户 ${app.userId} (${app.name}): ${app.status}`
              );
            });
          }
        );
      }
    } catch (error) {
      console.error(`处理 ${key} 时出错:`, error);
    }
  });
};

// 执行调试
checkApplicationData();
checkCollaborationData();
simulateStatusRestore();

console.log('\n=== 调试完成 ===');
