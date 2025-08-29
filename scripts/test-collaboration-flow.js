// 测试 Collaboration 数据流
console.log('🧪 [TEST] 开始测试 Collaboration 数据流...');

// 1. 检查当前 localStorage 中的数据
const collaborationsFromStorage = localStorage.getItem('tag.collaborations');
console.log(
  '📦 [TEST] 当前 localStorage 中的 Collaboration 数据:',
  collaborationsFromStorage
);

// 2. 创建测试数据
const testFormData = {
  title: 'Test Collaboration Flow',
  description: 'Test description for data flow',
  projectVision: 'Test vision',
  teamSize: '4-5',
  duration: '3-4 months',
  meetingSchedule: '2-3 times/week',
  applicationDeadline: '2024-12-31',
  contactEmail: 'test@example.com',
  contactDiscord: 'test#1234',
  roles: [
    {
      id: 1,
      customRole: 'UI Designer',
      roleDescription: 'Design user interfaces',
      requiredSkills: 'Figma, Adobe XD',
    },
  ],
};

console.log('📝 [TEST] 测试表单数据:', testFormData);

// 3. 模拟 API 数据格式（formatFormDataForAPI 的输出）
const testApiData = {
  id: 'test-flow-123',
  title: testFormData.title,
  description: testFormData.description,
  projectVision: testFormData.projectVision,
  teamSize: testFormData.teamSize,
  duration: testFormData.duration,
  meetingSchedule: testFormData.meetingSchedule,
  applicationDeadline: testFormData.applicationDeadline,
  contactInfo: {
    email: testFormData.contactEmail,
    discord: testFormData.contactDiscord,
  },
  author: {
    id: 'test-user',
    name: 'Test User',
    avatar: null,
    role: 'Initiator',
  },
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  likes: 0,
  views: 0,
  applications: [],
};

console.log('📦 [TEST] 模拟 API 数据:', testApiData);

// 4. 模拟详情页数据格式（formatAPIDataForDetail 的输出）
const testDetailData = {
  id: testApiData.id,
  title: testApiData.title,
  author: {
    id: testApiData.author.id,
    title: testApiData.title,
    artist: testApiData.author.name,
    artistAvatar: testApiData.author.avatar,
    description: testApiData.description,
    image: null,
    category: 'Project',
    likes: testApiData.likes,
    views: testApiData.views,
    timeAgo: 'Just now',
    role: testApiData.author.role,
  },
  duration: testApiData.duration,
  teamSize: testApiData.teamSize,
  postedTime: 'Just now',
  tags: [],
  heroImage: null,
  description: testApiData.description,
  meetingFrequency: testApiData.meetingSchedule,
  deadline: testApiData.applicationDeadline,
  contactInfo: testApiData.contactInfo,
  status: testApiData.status,
  vision: {
    tagline: testApiData.projectVision,
    narrative: testApiData.description,
    hiringTargets: [],
    contact: testApiData.contactInfo,
  },
  milestones: [],
};

console.log('📄 [TEST] 模拟详情页数据:', testDetailData);

// 5. 验证数据映射
console.log('✅ [TEST] 验证数据映射:');
console.log(
  '  - duration 映射:',
  testApiData.duration,
  '->',
  testDetailData.duration
);
console.log(
  '  - meetingSchedule 映射:',
  testApiData.meetingSchedule,
  '->',
  testDetailData.meetingFrequency
);
console.log(
  '  - teamSize 映射:',
  testApiData.teamSize,
  '->',
  testDetailData.teamSize
);
console.log(
  '  - applicationDeadline 映射:',
  testApiData.applicationDeadline,
  '->',
  testDetailData.deadline
);

// 6. 检查 Project Description 组件应该显示的数据
console.log('🔍 [TEST] Project Description 组件应该显示的数据:');
console.log('  - Expected Team Size:', testDetailData.teamSize);
console.log('  - Duration:', testDetailData.duration);
console.log('  - Meeting Schedule:', testDetailData.meetingFrequency);

console.log('🧪 [TEST] 测试完成！');
