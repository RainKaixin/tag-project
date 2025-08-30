// 测试只显示用户内容的脚本
console.log('=== 测试只显示用户内容 ===');

// 模拟用户输入的数据
const userInputData = {
  // 用户只填写了 Project Description
  subtitle: 'Flexible',
  projectVision: '', // 用户没有填写
  projectDescription: '', // 用户没有填写
  applicationDeadline: 'Dec 31, 2024',
};

console.log('用户输入数据:', userInputData);

// 模拟processProjectData函数（修复后）
const processProjectData = projectData => {
  return {
    description: projectData.subtitle || '',
    vision: {
      tagline: projectData.projectVision || '',
      narrative: projectData.projectDescription || '',
    },
    applicationDeadline: projectData.applicationDeadline || '',
  };
};

// 模拟显示逻辑
const shouldShowProjectDescription = project => {
  return !!project.description && project.description.trim() !== '';
};

const shouldShowProjectVision = project => {
  return !!project.vision.tagline && project.vision.tagline.trim() !== '';
};

const shouldShowWhyThisMatters = project => {
  return !!project.vision.narrative && project.vision.narrative.trim() !== '';
};

// 处理数据
const processedData = processProjectData(userInputData);
console.log('处理后的数据:', processedData);

// 测试显示逻辑
console.log('\n=== 显示逻辑测试 ===');
console.log(
  'Project Description 应该显示:',
  shouldShowProjectDescription(processedData)
);
console.log('Project Vision 应该显示:', shouldShowProjectVision(processedData));
console.log(
  'Why This Matters 应该显示:',
  shouldShowWhyThisMatters(processedData)
);

console.log('\n=== 预期结果 ===');
console.log('✅ Project Description: 显示 "Flexible"');
console.log('❌ Project Vision: 不显示（用户未填写）');
console.log('❌ Why This Matters: 不显示（用户未填写）');

console.log('\n=== 测试完成 ===');
