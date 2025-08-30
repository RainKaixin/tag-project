// 测试deadline数据显示的脚本
console.log('=== 测试Deadline数据显示 ===');

// 模拟协作数据
const mockCollaborationData = {
  id: 'test-1',
  title: 'Test Collaboration',
  applicationDeadline: 'Dec 31, 2024',
  deadline: null,
  author: {
    id: 'alice',
    name: 'Alice Chen',
  },
};

// 模拟processProjectData函数
const processProjectData = projectData => {
  console.log('[processProjectData] Input projectData:', projectData);

  const project = {
    id: projectData.id,
    title: projectData.title,
    deadline: projectData.applicationDeadline || projectData.deadline || null,
    applicationDeadline:
      projectData.applicationDeadline || projectData.deadline || null,
    author: projectData.author,
  };

  console.log('[processProjectData] Output project:', project);
  console.log('[processProjectData] Deadline 数据流:', {
    inputApplicationDeadline: projectData.applicationDeadline,
    inputDeadline: projectData.deadline,
    outputDeadline: project.deadline,
    outputApplicationDeadline: project.applicationDeadline,
  });

  return project;
};

// 模拟CollaborationHeader组件的显示逻辑
const testDeadlineDisplay = project => {
  console.log('[CollaborationHeader] project:', project);

  const deadlineValue = project?.deadline || project?.applicationDeadline || '';
  const shouldShowDeadline = !!deadlineValue && deadlineValue.trim() !== '';
  const deadlineDisplayText = deadlineValue || '';

  console.log('[CollaborationHeader] deadline显示条件:', {
    rawDeadline: project?.deadline,
    applicationDeadline: project?.applicationDeadline,
    deadlineValue,
    deadlineDisplayText,
    shouldShowDeadline,
    hasDeadline: !!deadlineValue,
    notEmpty: deadlineValue?.trim() !== '',
    deadlineType: typeof deadlineValue,
    deadlineLength: deadlineValue?.length,
  });

  return {
    shouldShowDeadline,
    deadlineDisplayText,
  };
};

// 执行测试
console.log('\n--- 测试1: 有applicationDeadline数据 ---');
const processedData1 = processProjectData(mockCollaborationData);
const result1 = testDeadlineDisplay(processedData1);
console.log('显示结果:', result1);

console.log('\n--- 测试2: 只有deadline数据 ---');
const mockData2 = {
  ...mockCollaborationData,
  applicationDeadline: null,
  deadline: 'Jan 15, 2025',
};
const processedData2 = processProjectData(mockData2);
const result2 = testDeadlineDisplay(processedData2);
console.log('显示结果:', result2);

console.log('\n--- 测试3: 没有deadline数据 ---');
const mockData3 = {
  ...mockCollaborationData,
  applicationDeadline: null,
  deadline: null,
};
const processedData3 = processProjectData(mockData3);
const result3 = testDeadlineDisplay(processedData3);
console.log('显示结果:', result3);

console.log('\n=== 测试完成 ===');
