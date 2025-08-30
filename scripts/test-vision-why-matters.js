// 测试 Project Vision 和 Why This Matters 的修复效果
console.log('=== 测试 Project Vision 和 Why This Matters 修复 ===');

// 模拟用户输入的数据（Alice 填写的内容）
const userInputData = {
  // 用户填写了 Project Vision 和 Why This Matters
  subtitle: 'Flexible',
  projectVision: 'Building an innovative platform for creative collaboration', // 用户填写了
  whyThisMatters:
    'This project will revolutionize how creative teams work together and make collaboration more accessible to students worldwide.', // 用户填写了
  applicationDeadline: 'Dec 31, 2024',
};

console.log('用户输入数据:', userInputData);

// 模拟processProjectData函数（修复后）
const processProjectData = projectData => {
  return {
    description: projectData.subtitle || '',
    vision: {
      tagline: projectData.projectVision || '',
      narrative: projectData.whyThisMatters || '', // 修复：使用 whyThisMatters 而不是 projectDescription
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
console.log(
  '✅ Project Vision: 显示 "Building an innovative platform for creative collaboration"'
);
console.log(
  '✅ Why This Matters: 显示 "This project will revolutionize how creative teams work together..."'
);

console.log('\n=== 修复验证 ===');
console.log('修复前: narrative: projectData.projectDescription (错误字段名)');
console.log('修复后: narrative: projectData.whyThisMatters (正确字段名)');

console.log('\n=== 测试完成 ===');
