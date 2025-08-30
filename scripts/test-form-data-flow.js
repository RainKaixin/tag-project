// 测试表单数据流
console.log('=== 测试表单数据流 ===');

// 模拟用户输入的表单数据
const mockFormData = {
  title: 'Test Project',
  description: 'Test description',
  projectVision: 'Building an innovative platform for creative collaboration',
  whyThisMatters:
    'This project will revolutionize how creative teams work together',
  teamSize: '5 members',
  duration: '3 months',
  meetingSchedule: '2-3 times/week',
  applicationDeadline: 'Dec 31, 2024',
  projectType: 'Design, Development',
  contactEmail: 'test@example.com',
  contactDiscord: 'testuser#1234',
  poster: null,
  posterPreview: '',
  roles: [
    {
      id: 1,
      customRole: 'UI/UX Designer',
      roleDescription: 'Create beautiful user interfaces',
      requiredSkills: 'Figma, Adobe Creative Suite',
    },
  ],
};

console.log('1. 模拟表单数据:', mockFormData);

// 模拟验证逻辑
const requiredFields = {
  title: 'Project Title',
  description: 'Project Description',
  projectVision: 'Project Vision',
  contactEmail: 'Contact Email',
  teamSize: 'Team Size',
  meetingSchedule: 'Meeting Schedule',
  applicationDeadline: 'Application Deadline',
};

const missingFields = [];
for (const [field, label] of Object.entries(requiredFields)) {
  if (!mockFormData[field] || mockFormData[field].trim() === '') {
    missingFields.push(label);
  }
}

console.log('2. 验证结果:', {
  requiredFields,
  missingFields,
  projectVisionValue: mockFormData.projectVision,
  whyThisMattersValue: mockFormData.whyThisMatters,
  projectVisionValid: !!(
    mockFormData.projectVision && mockFormData.projectVision.trim() !== ''
  ),
  whyThisMattersValid: !!(
    mockFormData.whyThisMatters && mockFormData.whyThisMatters.trim() !== ''
  ),
});

// 模拟提交数据准备
const submissionData = {
  ...mockFormData,
  applicationDeadline: mockFormData.applicationDeadline || 'TEST DEADLINE',
  posterPreview: null,
  author: {
    id: 'current_user',
    name: 'Current User',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  createdAt: new Date().toISOString(),
  status: 'active',
  likes: 0,
  views: 0,
};

console.log('3. 提交数据:', submissionData);
console.log('4. 关键字段检查:', {
  projectVision: submissionData.projectVision,
  whyThisMatters: submissionData.whyThisMatters,
  hasProjectVision: !!submissionData.projectVision,
  hasWhyThisMatters: !!submissionData.whyThisMatters,
  projectVisionLength: submissionData.projectVision?.length || 0,
  whyThisMattersLength: submissionData.whyThisMatters?.length || 0,
});

console.log('=== 测试完成 ===');
