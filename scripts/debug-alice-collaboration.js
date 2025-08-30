// 专门调试 Alice 的协作数据
console.log('=== 调试 Alice 的协作数据 ===');

// 检查 localStorage 中的协作数据
const STORAGE_KEY = 'mock_collaborations';

try {
  const storedData = localStorage.getItem(STORAGE_KEY);
  console.log('原始存储数据长度:', storedData?.length || 0);

  if (storedData) {
    const collaborations = JSON.parse(storedData);
    console.log('协作项目总数:', collaborations.length);

    // 查找 Alice 的协作项目
    const aliceCollaboration = collaborations.find(collab => {
      const authorName = collab.author?.name || collab.author?.artist || '';
      const authorId = collab.author?.id || '';
      return (
        authorName.toLowerCase().includes('alice') ||
        authorId.toLowerCase().includes('alice')
      );
    });

    if (aliceCollaboration) {
      console.log('\n=== 找到 Alice 的协作项目 ===');
      console.log('项目标题:', aliceCollaboration.title);
      console.log('作者信息:', aliceCollaboration.author);

      console.log('\n=== 关键字段检查 ===');
      console.log('projectVision (原始):', aliceCollaboration.projectVision);
      console.log('whyThisMatters (原始):', aliceCollaboration.whyThisMatters);
      console.log('description (原始):', aliceCollaboration.description);
      console.log('subtitle (原始):', aliceCollaboration.subtitle);

      console.log('\n=== 所有字段 ===');
      console.log('所有字段名:', Object.keys(aliceCollaboration));

      // 检查是否有 vision 对象
      if (aliceCollaboration.vision) {
        console.log('\n=== Vision 对象 ===');
        console.log('Vision 对象:', aliceCollaboration.vision);
        console.log('Vision tagline:', aliceCollaboration.vision.tagline);
        console.log('Vision narrative:', aliceCollaboration.vision.narrative);
      } else {
        console.log('\n❌ 没有找到 vision 对象');
      }

      // 模拟 processProjectData 处理
      console.log('\n=== 模拟数据处理 ===');
      const mockProcessProjectData = projectData => {
        return {
          description: projectData.subtitle || '',
          vision: {
            tagline: projectData.projectVision || '',
            narrative: projectData.whyThisMatters || '',
          },
        };
      };

      const processedData = mockProcessProjectData(aliceCollaboration);
      console.log('处理后的数据:', processedData);
      console.log('处理后的 vision.tagline:', processedData.vision.tagline);
      console.log('处理后的 vision.narrative:', processedData.vision.narrative);
    } else {
      console.log('\n❌ 未找到 Alice 的协作项目');

      // 显示所有协作项目的基本信息
      console.log('\n=== 所有协作项目 ===');
      collaborations.forEach((collab, index) => {
        const authorName =
          collab.author?.name || collab.author?.artist || 'Unknown';
        console.log(`${index + 1}. ${collab.title} - 作者: ${authorName}`);
      });
    }
  } else {
    console.log('❌ localStorage 中没有找到协作数据');
  }
} catch (error) {
  console.error('❌ 解析数据时出错:', error);
}

console.log('\n=== 调试完成 ===');
