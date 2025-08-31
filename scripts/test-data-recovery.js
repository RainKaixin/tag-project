// 测试数据恢复逻辑
// 在项目详情页面的控制台中运行

console.log('🧪 Testing data recovery logic...');

// 1. 检查当前页面的 ID
const pathSegments = window.location.pathname.split('/');
const idFromUrl = pathSegments[pathSegments.length - 1];
console.log('🔗 ID from URL:', idFromUrl, '(type:', typeof idFromUrl, ')');

// 2. 检查 localStorage 中的数据
const stored = localStorage.getItem('mock_collaborations');
console.log('📦 localStorage data exists:', !!stored);

if (stored) {
  const collaborations = JSON.parse(stored);
  console.log('📋 Total collaborations:', collaborations.length);

  // 显示所有协作项目的 ID
  collaborations.forEach((collab, index) => {
    console.log(
      `${index + 1}. ID: ${collab.id} (type: ${typeof collab.id}), Title: ${
        collab.title
      }`
    );
  });

  // 3. 测试 getCollaborationDataById 函数
  console.log('\n🧪 Testing getCollaborationDataById function...');

  // 模拟 getCollaborationDataById 逻辑
  const testGetCollaborationDataById = itemId => {
    try {
      console.log(`   Looking for itemId: ${itemId} (type: ${typeof itemId})`);

      const stored = localStorage.getItem('mock_collaborations');
      if (stored) {
        const collaborations = JSON.parse(stored);
        console.log(`   Found ${collaborations.length} collaborations`);

        // 尝试多种 ID 匹配方式
        let collaboration = collaborations.find(collab => collab.id === itemId);

        // 如果直接匹配失败，尝试字符串匹配
        if (!collaboration) {
          console.log(`   Direct match failed, trying string match...`);
          collaboration = collaborations.find(
            collab => collab.id.toString() === itemId.toString()
          );
        }

        // 如果还是失败，尝试数字匹配
        if (!collaboration && !isNaN(itemId)) {
          console.log(`   String match failed, trying number match...`);
          collaboration = collaborations.find(
            collab => collab.id === parseInt(itemId)
          );
        }

        if (collaboration) {
          console.log(`   ✅ Found collaboration: ${collaboration.title}`);
          console.log(`   Roles count: ${collaboration.roles?.length || 0}`);
          return collaboration;
        } else {
          console.log(`   ❌ No collaboration found with id: ${itemId}`);
          console.log(
            `   Available IDs:`,
            collaborations.map(c => c.id)
          );

          // 尝试查找最新的协作项目
          if (collaborations.length > 0) {
            const latestCollaboration = collaborations[0];
            console.log(
              `   🔄 Using latest collaboration as fallback: ${latestCollaboration.title}`
            );
            return latestCollaboration;
          }
        }
      } else {
        console.log(`   ❌ No data in localStorage`);
      }
      return null;
    } catch (error) {
      console.error(`   ❌ Error:`, error);
      return null;
    }
  };

  // 测试不同的 ID 格式
  const testIds = [idFromUrl, parseInt(idFromUrl), idFromUrl.toString()];

  testIds.forEach(testId => {
    console.log(`\n   Testing ID: ${testId} (type: ${typeof testId})`);
    const result = testGetCollaborationDataById(testId);
    if (result) {
      console.log(`   ✅ Success with ID: ${testId}`);
      console.log(`   Result roles:`, result.roles);
    } else {
      console.log(`   ❌ Failed with ID: ${testId}`);
    }
  });

  // 4. 检查当前页面的 projectData
  console.log('\n🔍 Checking current page projectData...');

  // 尝试从页面获取项目数据
  const projectData =
    window.location.state?.project ||
    window.location.state?.collaboration ||
    window.location.state?.projectData;

  if (projectData) {
    console.log('📄 Project data from location state:', projectData);
    console.log('👥 Roles from location state:', projectData.roles);
    console.log(
      '👥 Collaborators from location state:',
      projectData.collaborators
    );
    console.log(
      '👥 Vision collaborators from location state:',
      projectData.vision?.collaborators
    );
  } else {
    console.log('❌ No project data found in location state');
  }
} else {
  console.log('❌ No collaborations found in localStorage');
}

console.log('✅ Test completed!');
