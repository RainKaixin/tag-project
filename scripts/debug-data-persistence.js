// 调试数据持久化问题
// 在项目详情页面的控制台中运行

console.log('🔍 Debugging data persistence...');

// 检查 localStorage 中的协作数据
const stored = localStorage.getItem('mock_collaborations');
console.log('📦 Raw stored data:', stored ? 'Found' : 'Not found');

if (stored) {
  const collaborations = JSON.parse(stored);
  console.log('📋 Total collaborations:', collaborations.length);

  collaborations.forEach((collab, index) => {
    console.log(`\n${index + 1}. ${collab.title} (ID: ${collab.id}):`);
    console.log(`   Roles:`, collab.roles);
    console.log(`   Roles count:`, collab.roles?.length || 0);

    if (collab.roles && collab.roles.length > 0) {
      collab.roles.forEach((role, roleIndex) => {
        console.log(`     Role ${roleIndex + 1}:`);
        console.log(`       Title:`, role.title || role.customRole);
        console.log(
          `       Description:`,
          role.description || role.roleDescription
        );
        console.log(`       Required Skills:`, role.requiredSkills);
        console.log(`       Status:`, role.status);
      });
    } else {
      console.log(`   ❌ No roles found`);
    }
  });

  // 检查当前页面的项目数据
  console.log('\n🔍 Current page project data:');

  // 尝试从页面获取项目数据
  const projectData =
    window.location.state?.project ||
    window.location.state?.collaboration ||
    window.location.state?.projectData;

  if (projectData) {
    console.log('📄 Project data from location state:', projectData);
    console.log('👥 Roles from location state:', projectData.roles);
  } else {
    console.log('❌ No project data found in location state');
  }

  // 检查 URL 参数
  const urlParams = new URLSearchParams(window.location.search);
  const pathSegments = window.location.pathname.split('/');
  const idFromUrl = pathSegments[pathSegments.length - 1];
  console.log('\n🔗 URL Analysis:');
  console.log('   Path segments:', pathSegments);
  console.log('   ID from URL:', idFromUrl);
  console.log('   URL params:', Object.fromEntries(urlParams));

  // 测试 getCollaborationDataById 函数
  console.log('\n🧪 Testing getCollaborationDataById:');

  // 模拟 getCollaborationDataById 函数
  const testGetCollaborationDataById = itemId => {
    try {
      console.log(`   Looking for itemId: ${itemId}`);

      const stored = localStorage.getItem('mock_collaborations');
      if (stored) {
        const collaborations = JSON.parse(stored);
        console.log(`   Found ${collaborations.length} collaborations`);

        const collaboration = collaborations.find(
          collab => collab.id === itemId
        );
        if (collaboration) {
          console.log(`   ✅ Found collaboration:`, collaboration.title);
          console.log(`   Roles:`, collaboration.roles);
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
              `   🔄 Using latest collaboration as fallback:`,
              latestCollaboration.title
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
    } else {
      console.log(`   ❌ Failed with ID: ${testId}`);
    }
  });

  // 检查页面上的职位数据
  setTimeout(() => {
    console.log('\n🔍 Checking page elements...');

    // 查找 Open Positions 元素
    const openPositions = document.querySelector('[class*="Open Positions"]');
    if (openPositions) {
      console.log('📋 Found Open Positions element:', openPositions);

      // 查找职位卡片
      const positionCards = openPositions.querySelectorAll(
        '[class*="card"], [class*="position"]'
      );
      console.log('🎯 Position cards found:', positionCards.length);

      positionCards.forEach((card, index) => {
        console.log(
          `   Position ${index + 1}:`,
          card.textContent?.substring(0, 100) + '...'
        );
      });
    } else {
      console.log('❌ No Open Positions element found');
    }
  }, 1000);
} else {
  console.log('❌ No collaborations found in localStorage');
}

console.log('✅ Debug completed!');
