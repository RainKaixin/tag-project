// 调试Deadline显示问题的脚本
// 在浏览器控制台中运行

console.log('=== Deadline 显示问题调试开始 ===');

// 1. 检查localStorage中的协作数据
console.log('1. 检查localStorage中的协作数据:');
try {
  const collaborationsData = localStorage.getItem('mock_collaborations');
  if (collaborationsData) {
    const collaborations = JSON.parse(collaborationsData);
    console.log('找到协作数据:', collaborations.length, '个项目');

    collaborations.forEach((collab, index) => {
      console.log(`\n协作 ${index + 1}:`);
      console.log(`  ID: ${collab.id}`);
      console.log(`  Title: ${collab.title}`);
      console.log(`  applicationDeadline: ${collab.applicationDeadline}`);
      console.log(`  deadline: ${collab.deadline}`);
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

// 4. 检查ProjectProgressBar的显示逻辑
console.log('\n4. 检查ProjectProgressBar显示逻辑:');
function checkDeadlineDisplay(dueDate) {
  console.log('检查dueDate:', dueDate);

  const shouldShow = dueDate && dueDate !== 'Not specified' && dueDate !== '';

  console.log('是否显示deadline:', shouldShow);

  if (shouldShow) {
    console.log('✅ Deadline应该显示为:', dueDate);
  } else {
    console.log('❌ Deadline不会显示');
  }

  return shouldShow;
}

// 5. 测试deadline显示逻辑
console.log('\n5. 测试deadline显示逻辑:');
const testDeadlines = [
  '2024-12-31',
  'Not specified',
  '',
  null,
  undefined,
  'Dec 15, 2024',
];

testDeadlines.forEach(deadline => {
  console.log(`\n测试deadline: "${deadline}"`);
  checkDeadlineDisplay(deadline);
});

// 6. 检查当前页面的协作数据
console.log('\n6. 检查当前页面的协作数据:');
try {
  // 尝试从URL获取协作ID
  const urlParams = new URLSearchParams(window.location.search);
  const collaborationId =
    urlParams.get('id') || window.location.pathname.split('/').pop();

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
          checkDeadlineDisplay(processed.deadline);
        }
      } else {
        console.log('❌ 未找到当前协作');
      }
    }
  }
} catch (error) {
  console.error('检查当前页面数据失败:', error);
}

console.log('\n=== Deadline 显示问题调试完成 ===');
