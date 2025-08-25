// Mock API 调试脚本
// 在浏览器控制台中运行

console.log('🔍 开始调试 Mock API...');

// 1. 检查当前用户 ID
console.log('📋 步骤 1: 检查当前用户 ID');
const currentUserId = localStorage.getItem('tag.currentUserId') || 'alice';
console.log('当前用户 ID:', currentUserId);

// 2. 检查 portfolio 存储键
console.log('📋 步骤 2: 检查 portfolio 存储');
const portfolioKey = `portfolio_${currentUserId}`;
const existingPortfolio = localStorage.getItem(portfolioKey);
console.log('Portfolio 键:', portfolioKey);
console.log(
  '现有数据:',
  existingPortfolio ? JSON.parse(existingPortfolio) : '无'
);

// 3. 模拟完整的上传流程
console.log('📋 步骤 3: 模拟完整上传流程');

// 3.1 模拟图片上传
const mockImageData =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
const imageKey = `portfolio_image_portfolio/${currentUserId}/test-image.jpg`;
localStorage.setItem(imageKey, mockImageData);
console.log('✅ 模拟图片已上传到:', imageKey);

// 3.2 创建作品数据
const testPortfolioItem = {
  id: `mock_${Date.now()}_${Math.random().toString(36).substring(2)}`,
  title: '测试作品 - Mock API 调试',
  description: '这是一个用于调试 Mock API 的测试作品',
  category: '测试',
  tags: ['test', 'debug', 'mock'],
  imagePaths: [`portfolio/${currentUserId}/test-image.jpg`],
  thumbnailPath: `portfolio/${currentUserId}/test-image.jpg`,
  isPublic: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 3.3 保存作品到 portfolio
const existingData = localStorage.getItem(portfolioKey);
const portfolio = existingData ? JSON.parse(existingData) : [];
portfolio.unshift(testPortfolioItem);
localStorage.setItem(portfolioKey, JSON.stringify(portfolio));
console.log('✅ 作品已保存到 portfolio');

// 4. 验证数据存储
console.log('📋 步骤 4: 验证数据存储');
const storedData = localStorage.getItem(portfolioKey);
const parsedData = JSON.parse(storedData);
console.log('存储的作品数量:', parsedData.length);
console.log('最新作品:', parsedData[0]);

// 5. 测试读取功能
console.log('📋 步骤 5: 测试读取功能');

// 5.1 测试 getMyPortfolio (所有作品)
const myPortfolio = parsedData;
console.log('我的所有作品:', myPortfolio.length, '个');

// 5.2 测试 getPublicPortfolio (公开作品)
const publicPortfolio = parsedData.filter(item => item.isPublic !== false);
console.log('公开作品:', publicPortfolio.length, '个');

// 5.3 测试 getAllPublicPortfolios (所有用户的公开作品)
const allKeys = Object.keys(localStorage);
const portfolioKeys = allKeys.filter(key => key.startsWith('portfolio_'));
console.log('所有 portfolio 键:', portfolioKeys);

const allPublicItems = [];
portfolioKeys.forEach(key => {
  const userId = key.replace('portfolio_', '');
  const data = localStorage.getItem(key);
  const userPortfolio = data ? JSON.parse(data) : [];
  const publicItems = userPortfolio.filter(item => item.isPublic !== false);
  allPublicItems.push(...publicItems);
});

console.log('所有用户的公开作品:', allPublicItems.length, '个');

// 6. 列出所有相关的 localStorage 键
console.log('📋 步骤 6: 列出所有相关的 localStorage 键');
const allPortfolioKeys = allKeys.filter(
  key => key.startsWith('portfolio_') || key.startsWith('portfolio_image_')
);
console.log('所有 portfolio 相关键:', allPortfolioKeys);

console.log('🎉 Mock API 调试完成！');
console.log('💡 现在可以访问以下页面测试:');
console.log('   - http://localhost:3000/settings/edit-profile (查看作品列表)');
console.log('   - http://localhost:3000/me (查看艺术家页面)');
console.log('   - http://localhost:3000/test-mock-api (测试页面)');
