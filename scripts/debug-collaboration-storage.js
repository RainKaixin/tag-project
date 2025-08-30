// 调试 localStorage 中的协作数据
console.log('=== 调试协作数据存储 ===');

// 检查 localStorage 中的协作数据
const STORAGE_KEY = 'mock_collaborations';

try {
  const storedData = localStorage.getItem(STORAGE_KEY);
  console.log('原始存储数据:', storedData);

  if (storedData) {
    const collaborations = JSON.parse(storedData);
    console.log('解析后的协作数据:', collaborations);

    // 查找 Alice 的协作项目
    const aliceCollaboration = collaborations.find(
      collab =>
        collab.author?.name === 'Alice' ||
        collab.author?.artist === 'Alice' ||
        collab.author?.id === 'alice'
    );

    if (aliceCollaboration) {
      console.log('\n=== Alice 的协作项目数据 ===');
      console.log('项目标题:', aliceCollaboration.title);
      console.log('项目描述:', aliceCollaboration.description);
      console.log('Project Vision:', aliceCollaboration.projectVision);
      console.log('Why This Matters:', aliceCollaboration.whyThisMatters);
      console.log(
        'Application Deadline:',
        aliceCollaboration.applicationDeadline
      );

      console.log('\n=== 数据字段检查 ===');
      console.log('所有字段:', Object.keys(aliceCollaboration));

      // 检查 vision 对象
      if (aliceCollaboration.vision) {
        console.log('Vision 对象:', aliceCollaboration.vision);
        console.log('Vision tagline:', aliceCollaboration.vision.tagline);
        console.log('Vision narrative:', aliceCollaboration.vision.narrative);
      }
    } else {
      console.log('未找到 Alice 的协作项目');

      // 显示所有协作项目的基本信息
      console.log('\n=== 所有协作项目 ===');
      collaborations.forEach((collab, index) => {
        console.log(
          `${index + 1}. ${collab.title} - 作者: ${
            collab.author?.name || collab.author?.artist || 'Unknown'
          }`
        );
      });
    }
  } else {
    console.log('localStorage 中没有找到协作数据');
  }
} catch (error) {
  console.error('解析数据时出错:', error);
}

console.log('\n=== 调试完成 ===');
