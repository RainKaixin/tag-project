// test-collaboration-dataflow.js - 测试协作数据流

console.log('🧪 Testing collaboration data flow...');

// 模拟用户ID
const testUserId = 'alex';

// 检查 localStorage 中的协作数据
const stored = localStorage.getItem('mock_collaborations');
console.log(
  '📦 Stored collaborations:',
  stored ? JSON.parse(stored).length : 0
);

if (stored) {
  const collaborations = JSON.parse(stored);
  console.log(
    '📋 All collaborations:',
    collaborations.map(c => ({
      id: c.id,
      title: c.title,
      author: c.author?.id,
      createdAt: c.createdAt,
    }))
  );

  // 过滤用户创建的协作项目
  const userCollaborations = collaborations.filter(
    collab => collab.author && collab.author.id === testUserId
  );

  console.log('👤 User collaborations:', userCollaborations.length);
  console.log(
    '📝 User collaboration details:',
    userCollaborations.map(c => ({
      id: c.id,
      title: c.title,
      author: c.author?.name,
      createdAt: c.createdAt,
    }))
  );
} else {
  console.log('❌ No collaborations found in localStorage');
}

// 测试数据格式转换
const testCollaboration = {
  id: 'test_123',
  title: 'Test Collaboration',
  description: 'This is a test collaboration',
  author: {
    id: 'alex',
    name: 'Alex Chen',
  },
  createdAt: new Date().toISOString(),
  projectType: 'Test Project',
  heroImage: null,
};

// 模拟转换逻辑
const createdAt = new Date(testCollaboration.createdAt);
const now = new Date();
const monthsDiff = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24 * 30));

let dateRange;
if (monthsDiff === 0) {
  dateRange = 'This month';
} else if (monthsDiff === 1) {
  dateRange = 'Last month';
} else {
  dateRange = `${monthsDiff} months ago`;
}

const formatted = {
  id: testCollaboration.id,
  title: testCollaboration.title,
  description: testCollaboration.description,
  image:
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  partner: 'Team Members',
  partnerAvatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  completionDate: `Created ${dateRange}`,
  category: testCollaboration.projectType || 'Collaboration',
  isInitiator: true,
  role: 'Project Owner • Initiator',
  dateRange: dateRange,
  responsibility: '',
  teamFeedback: {
    feedbacker: 'Team',
    feedbackerRole: 'Collaborators',
    content:
      'This project is currently in progress. Team feedback will be available once the project is completed.',
  },
};

console.log('🔄 Formatted collaboration:', formatted);
console.log('✅ Test completed!');
