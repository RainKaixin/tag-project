// 测试deadline修复的脚本
console.log('=== 测试Deadline修复 ===');

// 模拟原始数据（从localStorage获取的完整数据）
const originalData = {
  id: 'collab_1756502259950_5hxh1mv6u',
  title: 'asd',
  description: 'Flexible',
  projectVision: 'Flexible',
  teamSize: '2-3',
  duration: '1-2 weeks',
  meetingSchedule: '1-2 times/week',
  applicationDeadline: 'Flexible', // 这个字段在原始数据中存在
  author: {
    id: 'alice',
    name: 'Alice Chen',
  },
};

console.log('原始数据:', originalData);

// 模拟formatAPIDataForList函数（修复前）
const formatAPIDataForList_before = apiDataList => {
  return apiDataList.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.description,
    image: item.heroImage || null,
    posterPreview: item.posterPreview || item.heroImage || null,
    categories: item.projectType ? [item.projectType] : [],
    author: {
      id: item.author?.id || null,
      name: item.author?.name || 'Unknown',
      avatar: item.author?.avatar || null,
    },
    likes: item.likes || 0,
    views: item.views || 0,
    isLiked: false,
    isBookmarked: false,
    isInitiator: false,
    role: item.author?.role || 'Initiator',
    duration: item.duration || '',
    meetingSchedule: item.meetingSchedule || '',
    // 注意：这里没有 applicationDeadline 字段
    status: item.status === 'active' ? 'Open for Collaboration' : 'Closed',
    skills: item.roles?.map(role => role.title) || [],
    teamSize: item.teamSize || '',
    currentMembers: 0,
  }));
};

// 模拟formatAPIDataForList函数（修复后）
const formatAPIDataForList_after = apiDataList => {
  return apiDataList.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.description,
    image: item.heroImage || null,
    posterPreview: item.posterPreview || item.heroImage || null,
    categories: item.projectType ? [item.projectType] : [],
    author: {
      id: item.author?.id || null,
      name: item.author?.name || 'Unknown',
      avatar: item.author?.avatar || null,
    },
    likes: item.likes || 0,
    views: item.views || 0,
    isLiked: false,
    isBookmarked: false,
    isInitiator: false,
    role: item.author?.role || 'Initiator',
    duration: item.duration || '',
    meetingSchedule: item.meetingSchedule || '',
    applicationDeadline: item.applicationDeadline || '', // 修复：添加 applicationDeadline 字段
    status: item.status === 'active' ? 'Open for Collaboration' : 'Closed',
    skills: item.roles?.map(role => role.title) || [],
    teamSize: item.teamSize || '',
    currentMembers: 0,
  }));
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

// 测试修复前的数据流
console.log('\n--- 测试修复前 ---');
const listData_before = formatAPIDataForList_before([originalData]);
console.log('列表数据 (修复前):', listData_before[0]);
console.log(
  'applicationDeadline 字段:',
  listData_before[0].applicationDeadline
);

const processedData_before = processProjectData(listData_before[0]);
const result_before = testDeadlineDisplay(processedData_before);
console.log('显示结果 (修复前):', result_before);

// 测试修复后的数据流
console.log('\n--- 测试修复后 ---');
const listData_after = formatAPIDataForList_after([originalData]);
console.log('列表数据 (修复后):', listData_after[0]);
console.log('applicationDeadline 字段:', listData_after[0].applicationDeadline);

const processedData_after = processProjectData(listData_after[0]);
const result_after = testDeadlineDisplay(processedData_after);
console.log('显示结果 (修复后):', result_after);

console.log('\n=== 修复效果对比 ===');
console.log(
  '修复前 - 应该显示:',
  result_before.shouldShowDeadline,
  '文本:',
  result_before.deadlineDisplayText
);
console.log(
  '修复后 - 应该显示:',
  result_after.shouldShowDeadline,
  '文本:',
  result_after.deadlineDisplayText
);
console.log(
  '修复成功:',
  result_after.shouldShowDeadline &&
    result_after.deadlineDisplayText === 'Flexible'
);

console.log('\n=== 测试完成 ===');
