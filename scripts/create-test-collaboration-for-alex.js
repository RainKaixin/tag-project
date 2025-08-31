// create-test-collaboration-for-alex.js - 为Alex创建一个测试协作项目

console.log('🎯 Creating test collaboration for Alex...');

// 检查现有的协作数据
const stored = localStorage.getItem('mock_collaborations');
const collaborations = stored ? JSON.parse(stored) : [];

console.log('📦 Existing collaborations:', collaborations.length);

// 创建新的测试协作项目
const newCollaboration = {
  id: `test_${Date.now()}`,
  title: 'Test Collaboration Project',
  description:
    'This is a test collaboration project created to verify the data flow.',
  projectVision: 'Testing the collaboration data flow in artist profile',
  whyThisMatters:
    'This project helps us verify that collaborations created by users appear correctly in their artist profile.',
  teamSize: '2-3',
  duration: '1-2 weeks',
  meetingSchedule: 'Once a week',
  applicationDeadline: '2024-12-31',
  projectType: 'Test Project',
  contactInfo: {
    email: 'alex.chen@example.com',
    discord: 'alexchen#1234',
    other: '',
  },
  roles: [
    {
      id: 'role_1',
      title: 'Test Role',
      description: 'This is a test role for verification purposes.',
      requiredSkills: 'Testing, Verification',
      status: 'available',
    },
  ],
  author: {
    id: 'alex',
    name: 'Alex Chen',
    avatar: null,
    role: 'Concept Artist',
  },
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  likes: 0,
  views: 0,
  applications: [],
};

// 添加到协作列表的开头
collaborations.unshift(newCollaboration);

// 保存回 localStorage
localStorage.setItem('mock_collaborations', JSON.stringify(collaborations));

console.log('✅ Test collaboration created successfully!');
console.log('📝 New collaboration details:', {
  id: newCollaboration.id,
  title: newCollaboration.title,
  author: newCollaboration.author.name,
  createdAt: newCollaboration.createdAt,
});

// 验证保存
const verifyStored = localStorage.getItem('mock_collaborations');
const verifyCollaborations = JSON.parse(verifyStored);
console.log(
  '🔍 Verification - Total collaborations:',
  verifyCollaborations.length
);

// 查找Alex的协作项目
const alexCollaborations = verifyCollaborations.filter(
  c => c.author && c.author.id === 'alex'
);
console.log('👤 Alex collaborations:', alexCollaborations.length);
alexCollaborations.forEach(c => {
  console.log(`  - ${c.title} (${c.id})`);
});

console.log('🎉 Test completed!');
