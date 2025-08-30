// 调试Deadline数据流的脚本
// 在Collaboration详情页的浏览器控制台中运行

console.log('=== 调试Deadline数据流 ===');

// 1. 检查localStorage中的原始协作数据
console.log('1. 检查localStorage中的原始协作数据:');
try {
  const collaborationsData = localStorage.getItem('mock_collaborations');
  if (collaborationsData) {
    const collaborations = JSON.parse(collaborationsData);
    console.log('找到协作数据:', collaborations.length, '个项目');

    collaborations.forEach((collab, index) => {
      console.log(`\n协作 ${index + 1}:`);
      console.log(`  ID: ${collab.id}`);
      console.log(`  Title: ${collab.title}`);
      console.log(`  applicationDeadline: "${collab.applicationDeadline}"`);
      console.log(`  deadline: "${collab.deadline}"`);
      console.log(`  完整数据:`, collab);
    });
  } else {
    console.log('❌ 未找到协作数据');
  }
} catch (error) {
  console.error('检查协作数据失败:', error);
}

// 2. 模拟processProjectData函数
console.log('\n2. 模拟processProjectData函数:');
function processProjectData(projectData) {
  console.log('输入projectData:', projectData);

  if (!projectData) {
    console.log('❌ 没有projectData');
    return null;
  }

  // 检查关键字段
  console.log('关键字段检查:');
  console.log('  applicationDeadline:', projectData.applicationDeadline);
  console.log('  deadline:', projectData.deadline);
  console.log('  contactEmail:', projectData.contactEmail);
  console.log('  contactDiscord:', projectData.contactDiscord);

  const processedProject = {
    id: projectData.id,
    title: projectData.title,
    author: projectData.author,
    duration: projectData.duration || 'Not specified',
    teamSize: projectData.teamSize || 'Not specified',
    postedTime: '2 hours ago',
    tags: projectData.categories || ['Project'],
    heroImage: projectData.posterPreview || projectData.image,
    description:
      projectData.subtitle +
      ". We're looking for passionate designers and developers to join our team and create something amazing together.",
    meetingFrequency: projectData.meetingSchedule || 'Not specified',
    deadline:
      projectData.applicationDeadline ||
      projectData.deadline ||
      'Not specified',
    contactInfo: {
      discord: projectData.contactDiscord || null,
      email: projectData.contactEmail || null,
    },
    status: 'in_progress',
    vision: {
      tagline:
        projectData.projectVision ||
        'Building the future of creative collaboration',
      narrative:
        projectData.projectDescription ||
        "We're creating a platform that connects talented designers and developers to build amazing digital experiences together.",
      lookingFor: projectData.projectType
        ? projectData.projectType
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
        : [],
      contact: {
        discord: projectData.contactDiscord || null,
        email: projectData.contactEmail || null,
      },
    },
    milestones: projectData.milestones || [],
  };

  console.log('处理后的project:', processedProject);
  console.log('deadline字段:', processedProject.deadline);

  return processedProject;
}

// 3. 测试processProjectData
console.log('\n3. 测试processProjectData:');
try {
  const collaborationsData = localStorage.getItem('mock_collaborations');
  if (collaborationsData) {
    const collaborations = JSON.parse(collaborationsData);
    if (collaborations.length > 0) {
      const testProject = collaborations[0];
      console.log('测试第一个协作项目:');
      const processed = processProjectData(testProject);

      if (processed) {
        console.log('✅ 处理成功');
        console.log('最终deadline值:', processed.deadline);

        // 检查deadline是否会被显示
        const shouldShowDeadline =
          processed.deadline &&
          processed.deadline !== 'Not specified' &&
          processed.deadline !== '';
        console.log('是否应该显示deadline:', shouldShowDeadline);
      } else {
        console.log('❌ 处理失败');
      }
    }
  }
} catch (error) {
  console.error('测试processProjectData失败:', error);
}

// 4. 检查当前页面的协作数据
console.log('\n4. 检查当前页面的协作数据:');
try {
  // 尝试从URL获取协作ID
  const pathParts = window.location.pathname.split('/');
  const collaborationId = pathParts[pathParts.length - 1];

  console.log('当前URL:', window.location.href);
  console.log('提取的协作ID:', collaborationId);

  if (collaborationId) {
    const collaborationsData = localStorage.getItem('mock_collaborations');
    if (collaborationsData) {
      const collaborations = JSON.parse(collaborationsData);
      const currentCollaboration = collaborations.find(
        c => c.id === collaborationId
      );

      if (currentCollaboration) {
        console.log('找到当前协作:', currentCollaboration);
        const processed = processProjectData(currentCollaboration);
        if (processed) {
          console.log('当前协作的deadline:', processed.deadline);

          // 检查显示条件
          const shouldShow =
            processed.deadline &&
            processed.deadline !== 'Not specified' &&
            processed.deadline !== '';
          console.log('是否应该显示deadline:', shouldShow);
        }
      } else {
        console.log('❌ 未找到当前协作');
      }
    }
  }
} catch (error) {
  console.error('检查当前页面数据失败:', error);
}

// 5. 创建测试数据
console.log('\n5. 创建包含正确deadline的测试数据:');
const testCollaboration = {
  id: 'test-collab-001',
  title: 'SSSSS',
  subtitle: 'aaa',
  projectDescription: 'Test project description',
  projectVision: 'Test vision',
  projectType: 'Design, Development',
  applicationDeadline: '2024-12-31', // 确保有deadline数据
  deadline: '2024-12-31', // 备用deadline字段
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

// 测试这个数据
console.log('测试协作数据:');
const testProcessed = processProjectData(testCollaboration);
if (testProcessed) {
  console.log('测试协作的deadline:', testProcessed.deadline);
  const shouldShow =
    testProcessed.deadline &&
    testProcessed.deadline !== 'Not specified' &&
    testProcessed.deadline !== '';
  console.log('测试协作是否应该显示deadline:', shouldShow);
}

console.log('\n=== 调试完成 ===');
