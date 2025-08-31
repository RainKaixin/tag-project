// 测试 TAGMe 页面的 description 显示问题
// 在 TAGMe 页面的控制台中运行

console.log('🧪 Testing TAGMe description display...');

// 获取协作服务的数据
const collaborationService =
  window.collaborationService ||
  (window.location.pathname.includes('/tagme')
    ? require('../src/services/collaborationService/index.js')
    : null);

if (collaborationService) {
  console.log('📦 Collaboration service found');

  // 测试获取协作数据
  collaborationService.getCollaborations().then(result => {
    console.log('📊 TAGMe getCollaborations result:', result);

    if (result.success && result.data.length > 0) {
      console.log('📋 First collaboration data:', result.data[0]);
      console.log('📝 Description field:', result.data[0].description);
      console.log('📏 Description length:', result.data[0].description?.length);
      console.log('🔍 Description type:', typeof result.data[0].description);
    }
  });
} else {
  console.log('❌ Collaboration service not found');

  // 直接检查 localStorage
  const stored = localStorage.getItem('mock_collaborations');
  if (stored) {
    const collaborations = JSON.parse(stored);
    console.log('📦 Direct localStorage data:', collaborations);

    if (collaborations.length > 0) {
      console.log('📋 First collaboration:', collaborations[0]);
      console.log('📝 Description field:', collaborations[0].description);
    }
  }
}

// 检查页面上的协作卡片元素
setTimeout(() => {
  const collaborationCards = document.querySelectorAll(
    '[class*="collaboration"]'
  );
  console.log('🎴 Found collaboration cards:', collaborationCards.length);

  collaborationCards.forEach((card, index) => {
    const descriptionElement = card.querySelector('p[class*="text-xs"]');
    if (descriptionElement) {
      console.log(
        `📄 Card ${index + 1} description element:`,
        descriptionElement
      );
      console.log(
        `📝 Card ${index + 1} description text:`,
        descriptionElement.textContent
      );
      console.log(
        `🎨 Card ${index + 1} description styles:`,
        window.getComputedStyle(descriptionElement)
      );
    }
  });
}, 1000);
