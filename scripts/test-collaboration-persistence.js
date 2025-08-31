// 测试协作数据持久化
// 在项目详情页面的控制台中运行

console.log('🧪 Testing collaboration data persistence...');

// 1. 检查当前 localStorage 中的数据
const stored = localStorage.getItem('mock_collaborations');
console.log('📦 Current localStorage data:', stored ? 'Found' : 'Not found');

if (stored) {
  const collaborations = JSON.parse(stored);
  console.log('📋 Total collaborations:', collaborations.length);

  // 2. 显示所有协作项目的信息
  collaborations.forEach((collab, index) => {
    console.log(
      `\n${index + 1}. ${collab.title} (ID: ${
        collab.id
      }, Type: ${typeof collab.id}):`
    );
    console.log(`   Roles count:`, collab.roles?.length || 0);

    if (collab.roles && collab.roles.length > 0) {
      collab.roles.forEach((role, roleIndex) => {
        console.log(
          `     Role ${roleIndex + 1}: ${role.title || role.customRole}`
        );
      });
    } else {
      console.log(`   ❌ No roles found`);
    }
  });

  // 3. 测试数据恢复功能
  console.log('\n🧪 Testing data recovery...');

  // 获取当前页面的 ID
  const pathSegments = window.location.pathname.split('/');
  const idFromUrl = pathSegments[pathSegments.length - 1];
  console.log('🔗 ID from URL:', idFromUrl, '(type:', typeof idFromUrl, ')');

  // 测试不同的 ID 格式
  const testIds = [idFromUrl, parseInt(idFromUrl), idFromUrl.toString()];

  testIds.forEach(testId => {
    console.log(`\n   Testing ID: ${testId} (type: ${typeof testId})`);

    // 模拟 getCollaborationDataById 逻辑
    let found = false;
    collaborations.forEach(collab => {
      // 直接匹配
      if (collab.id === testId) {
        console.log(`     ✅ Direct match found: ${collab.title}`);
        found = true;
        return;
      }

      // 字符串匹配
      if (collab.id.toString() === testId.toString()) {
        console.log(`     ✅ String match found: ${collab.title}`);
        found = true;
        return;
      }

      // 数字匹配
      if (!isNaN(testId) && collab.id === parseInt(testId)) {
        console.log(`     ✅ Number match found: ${collab.title}`);
        found = true;
        return;
      }
    });

    if (!found) {
      console.log(`     ❌ No match found for ID: ${testId}`);
    }
  });

  // 4. 检查页面上的实际显示
  setTimeout(() => {
    console.log('\n🔍 Checking page display...');

    // 查找 Open Positions 元素
    const openPositions = document.querySelector('[class*="Open Positions"]');
    if (openPositions) {
      console.log('📋 Found Open Positions element');

      // 查找职位卡片
      const positionCards = openPositions.querySelectorAll(
        '[class*="card"], [class*="position"]'
      );
      console.log('🎯 Position cards found:', positionCards.length);

      if (positionCards.length > 0) {
        positionCards.forEach((card, index) => {
          const titleElement = card.querySelector('h3, h4, [class*="title"]');
          const title = titleElement ? titleElement.textContent : 'Unknown';
          console.log(`   Position ${index + 1}: ${title}`);
        });
      } else {
        console.log('   ❌ No position cards found');
      }
    } else {
      console.log('❌ No Open Positions element found');
    }
  }, 1000);

  // 5. 提供修复建议
  console.log('\n💡 Recommendations:');
  console.log('   1. 确保协作项目有正确的 roles 数据');
  console.log('   2. 检查 ID 类型匹配问题');
  console.log('   3. 验证数据恢复逻辑');
} else {
  console.log('❌ No collaborations found in localStorage');
  console.log('💡 Try creating a new collaboration first');
}

console.log('✅ Test completed!');
