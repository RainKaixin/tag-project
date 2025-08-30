// 检查 localStorage 中的协作数据
console.log('=== 检查 localStorage 中的协作数据 ===');

// 模拟浏览器环境
if (typeof localStorage === 'undefined') {
  console.log('localStorage 不可用，使用模拟数据');

  // 模拟数据
  const mockData = [
    {
      id: 'test-collab-001',
      title: 'Test Project',
      projectVision:
        'Building an innovative platform for creative collaboration',
      whyThisMatters:
        'This project will revolutionize how creative teams work together',
      description: 'Test description',
      teamSize: '5 members',
      duration: '3 months',
      meetingSchedule: '2-3 times/week',
      applicationDeadline: 'Dec 31, 2024',
      contactEmail: 'test@example.com',
      contactDiscord: 'testuser#1234',
      author: {
        id: 'alice',
        name: 'Alice Chen',
        avatar: null,
        role: 'Initiator',
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      applications: [],
    },
  ];

  console.log('模拟数据:', mockData);
  console.log('第一个项目的关键字段:');
  console.log('- projectVision:', mockData[0].projectVision);
  console.log('- whyThisMatters:', mockData[0].whyThisMatters);
  console.log('- hasProjectVision:', !!mockData[0].projectVision);
  console.log('- hasWhyThisMatters:', !!mockData[0].whyThisMatters);
} else {
  // 在浏览器环境中运行
  try {
    const stored = localStorage.getItem('mock_collaborations');
    console.log('localStorage 中的原始数据:', stored);

    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('解析后的数据:', parsed);
      console.log('数据长度:', parsed.length);

      if (parsed.length > 0) {
        const firstItem = parsed[0];
        console.log('第一个项目:', firstItem);
        console.log('第一个项目的键:', Object.keys(firstItem));
        console.log('关键字段检查:');
        console.log('- projectVision:', firstItem.projectVision);
        console.log('- whyThisMatters:', firstItem.whyThisMatters);
        console.log('- hasProjectVision:', !!firstItem.projectVision);
        console.log('- hasWhyThisMatters:', !!firstItem.whyThisMatters);
        console.log(
          '- projectVisionLength:',
          firstItem.projectVision?.length || 0
        );
        console.log(
          '- whyThisMattersLength:',
          firstItem.whyThisMatters?.length || 0
        );
      }
    } else {
      console.log('localStorage 中没有找到协作数据');
    }
  } catch (error) {
    console.error('检查 localStorage 数据时出错:', error);
  }
}

console.log('=== 检查完成 ===');
