// 测试 Collaboration 数据流
console.log('🧪 [TEST] 开始测试 Collaboration 数据流...');

// 模拟表单数据
const testFormData = {
  title: 'Test Collaboration',
  description: 'Test description',
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

// 检查数据映射
console.log('🔍 [TEST] 检查数据映射:');
console.log('  - teamSize:', testFormData.teamSize);
console.log('  - duration:', testFormData.duration);
console.log('  - meetingSchedule:', testFormData.meetingSchedule);

// 模拟 API 数据格式
const testApiData = {
  id: 'test-123',
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
};

console.log('📦 [TEST] 模拟 API 数据:', testApiData);

// 模拟详情页数据格式
const testDetailData = {
  id: testApiData.id,
  title: testApiData.title,
  duration: testApiData.duration,
  teamSize: testApiData.teamSize,
  meetingFrequency: testApiData.meetingSchedule,
  deadline: testApiData.applicationDeadline,
  contactInfo: testApiData.contactInfo,
};

console.log('📄 [TEST] 模拟详情页数据:', testDetailData);

// 验证数据映射
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

console.log('🧪 [TEST] 测试完成！');
