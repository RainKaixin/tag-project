// 一分钟验明正身 - 快速检查三个关键点
console.log('=== 一分钟验明正身 ===');

// 1. 检查 localStorage 中的原始数据
const STORAGE_KEY = 'mock_collaborations';
const storedData = localStorage.getItem(STORAGE_KEY);
const collaborations = storedData ? JSON.parse(storedData) : [];

// 找到 Alice 的最新协作
const aliceCollaboration = collaborations.find(
  collab => collab.author?.name === 'Alice' || collab.author?.id === 'alice'
);

console.log('\n1️⃣ localStorage 原始数据检查:');
if (aliceCollaboration) {
  console.log('✅ 找到 Alice 的协作');
  console.log('projectVision:', aliceCollaboration.projectVision);
  console.log('whyThisMatters:', aliceCollaboration.whyThisMatters);
  console.log('description:', aliceCollaboration.description);
  console.log('vision 对象:', aliceCollaboration.vision);
} else {
  console.log('❌ 未找到 Alice 的协作');
}

// 2. 模拟 processProjectData 输入输出
console.log('\n2️⃣ processProjectData 输入输出检查:');
if (aliceCollaboration) {
  console.log('输入 - projectVision:', aliceCollaboration.projectVision);
  console.log('输入 - whyThisMatters:', aliceCollaboration.whyThisMatters);

  // 模拟 processProjectData 处理
  const mockProcess = {
    description: aliceCollaboration.subtitle || '',
    vision: {
      tagline: aliceCollaboration.projectVision || '',
      narrative: aliceCollaboration.whyThisMatters || '',
    },
  };

  console.log('输出 - vision.tagline:', mockProcess.vision.tagline);
  console.log('输出 - vision.narrative:', mockProcess.vision.narrative);
}

// 3. 检查渲染条件
console.log('\n3️⃣ 渲染条件检查:');
if (aliceCollaboration) {
  const visionTagline = aliceCollaboration.projectVision || '';
  const visionNarrative = aliceCollaboration.whyThisMatters || '';

  console.log('visionTagline 长度:', visionTagline.length);
  console.log('visionNarrative 长度:', visionNarrative.length);
  console.log('应该显示 Project Vision:', visionTagline.trim().length > 0);
  console.log('应该显示 Why This Matters:', visionNarrative.trim().length > 0);
}

console.log('\n=== 检查完成 ===');
