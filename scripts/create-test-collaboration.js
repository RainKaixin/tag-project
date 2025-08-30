// 创建测试协作数据的脚本
// 在浏览器控制台中运行

console.log('=== 创建测试协作数据 ===');

// 创建包含完整测试数据的协作项目
const testCollaboration = {
  id: 'test-collab-001',
  title: 'Test Collaboration Project',
  subtitle: 'A comprehensive test project for vision and why this matters',
  projectDescription: 'Test project description',
  projectVision: 'Building an innovative platform for creative collaboration', // 测试 Project Vision
  whyThisMatters:
    'This project will revolutionize how creative teams work together and make collaboration more accessible to students worldwide.', // 测试 Why This Matters
  projectType: 'Design, Development',
  applicationDeadline: 'Dec 31, 2024', // 确保有deadline数据
  deadline: 'Dec 31, 2024', // 备用deadline字段
  contactEmail: 'test@example.com',
  contactDiscord: 'testuser#1234',
  meetingSchedule: '2-3 times/week',
  duration: '3 months',
  teamSize: '5 members',
  categories: ['Design', 'Development'],
  posterPreview: 'test-image-key',
  author: {
    id: 'alice',
    name: 'Alice',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
  },
  milestones: [],
  createdAt: new Date().toISOString(),
};

// 获取现有的协作数据
let existingCollaborations = [];
try {
  const stored = localStorage.getItem('mock_collaborations');
  if (stored) {
    existingCollaborations = JSON.parse(stored);
    console.log('现有协作数据:', existingCollaborations);
  }
} catch (error) {
  console.error('读取现有数据失败:', error);
}

// 添加或更新测试协作
const updatedCollaborations = [
  testCollaboration,
  ...existingCollaborations.filter(c => c.id !== testCollaboration.id),
];

// 保存到localStorage
try {
  localStorage.setItem(
    'mock_collaborations',
    JSON.stringify(updatedCollaborations)
  );
  console.log('✅ 测试协作数据已保存');
  console.log('保存的数据:', updatedCollaborations);

  // 验证保存的数据
  const saved = localStorage.getItem('mock_collaborations');
  const parsed = JSON.parse(saved);
  console.log('验证保存的数据:', parsed);

  // 检查deadline字段
  const testCollab = parsed.find(c => c.id === 'test-collab-001');
  if (testCollab) {
    console.log('测试协作的deadline字段:');
    console.log('  applicationDeadline:', testCollab.applicationDeadline);
    console.log('  deadline:', testCollab.deadline);
  }
} catch (error) {
  console.error('保存数据失败:', error);
}

console.log('=== 测试数据创建完成 ===');
console.log('现在请刷新Collaboration详情页查看效果');
