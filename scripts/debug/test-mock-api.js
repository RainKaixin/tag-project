// 简单的 Mock API 测试脚本
// 在浏览器控制台中运行

console.log('🧪 开始测试 Mock API...');

// 测试 1: 检查 localStorage 中的用户 ID
console.log('📋 测试 1: 检查当前用户 ID');
const currentUserId = localStorage.getItem('tag.currentUserId') || 'alice';
console.log('当前用户 ID:', currentUserId);

// 测试 2: 检查 portfolio 存储键
console.log('📋 测试 2: 检查 portfolio 存储');
const portfolioKey = `portfolio_${currentUserId}`;
const existingPortfolio = localStorage.getItem(portfolioKey);
console.log('Portfolio 键:', portfolioKey);
console.log(
  '现有数据:',
  existingPortfolio ? JSON.parse(existingPortfolio) : '无'
);

// 测试 3: 创建测试数据
console.log('📋 测试 3: 创建测试数据');
const testPortfolio = [
  {
    id: 'test_1',
    title: '测试作品 1',
    description: '这是一个测试作品',
    category: '测试',
    tags: ['test', 'mock'],
    imagePaths: ['test/path/image1.jpg'],
    thumbnailPath: 'test/path/thumb1.jpg',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'test_2',
    title: '测试作品 2',
    description: '这是另一个测试作品',
    category: '测试',
    tags: ['test', 'mock'],
    imagePaths: ['test/path/image2.jpg'],
    thumbnailPath: 'test/path/thumb2.jpg',
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

localStorage.setItem(portfolioKey, JSON.stringify(testPortfolio));
console.log('✅ 测试数据已创建');

// 测试 4: 验证数据存储
console.log('📋 测试 4: 验证数据存储');
const storedData = localStorage.getItem(portfolioKey);
const parsedData = JSON.parse(storedData);
console.log('存储的数据:', parsedData);
console.log('数据长度:', parsedData.length);

// 测试 5: 测试公开/私有过滤
console.log('📋 测试 5: 测试公开/私有过滤');
const publicItems = parsedData.filter(item => item.isPublic !== false);
const privateItems = parsedData.filter(item => item.isPublic === false);
console.log('公开作品:', publicItems.length, '个');
console.log('私有作品:', privateItems.length, '个');

// 测试 6: 模拟图片上传
console.log('📋 测试 6: 模拟图片上传');
const imageKey = `portfolio_image_test/path/test.jpg`;
const mockImageData =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
localStorage.setItem(imageKey, mockImageData);
console.log('✅ 模拟图片已上传');

// 测试 7: 列出所有 portfolio 相关的键
console.log('📋 测试 7: 列出所有 portfolio 相关的键');
const allKeys = Object.keys(localStorage);
const portfolioKeys = allKeys.filter(key => key.startsWith('portfolio_'));
console.log('Portfolio 相关键:', portfolioKeys);

console.log('🎉 Mock API 测试完成！');
console.log(
  '💡 现在可以访问 http://localhost:3000/test-mock-api 来查看测试页面'
);
