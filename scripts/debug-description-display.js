// 直接在浏览器控制台运行这个脚本
// 复制粘贴到浏览器控制台 (F12 -> Console)

console.log('🔍 Debugging description display issue...');

// 检查 localStorage 中的协作数据
const stored = localStorage.getItem('mock_collaborations');
console.log('📦 Raw stored data:', stored ? 'Found' : 'Not found');

if (stored) {
  const collaborations = JSON.parse(stored);
  console.log('📋 Total collaborations:', collaborations.length);

  // 检查每个协作项目的 description 字段
  collaborations.forEach((collab, index) => {
    console.log(`\n${index + 1}. ${collab.title}:`);
    console.log(`   Description: "${collab.description}"`);
    console.log(`   Description length: ${collab.description?.length || 0}`);
    console.log(`   Description type: ${typeof collab.description}`);
    console.log(`   Has description: ${!!collab.description}`);
  });

  // 模拟 TAGMe 页面的数据转换
  console.log('\n🔍 Simulating TAGMe data conversion...');

  // 模拟 formatAPIDataForList
  const formatAPIDataForList = apiDataList => {
    return apiDataList.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.description,
      description: item.description, // 添加 description 字段
      projectVision: item.projectVision,
      whyThisMatters: item.whyThisMatters,
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
      applicationDeadline: item.applicationDeadline || '',
      status: item.status === 'active' ? 'Open for Collaboration' : 'Closed',
      skills: item.roles?.map(role => role.title) || [],
      teamSize: item.teamSize || '',
      currentMembers: 0,
    }));
  };

  // 筛选 active 状态的协作项目
  const activeCollaborations = collaborations.filter(
    c => c.status === 'active'
  );
  console.log('🔍 Active collaborations:', activeCollaborations.length);

  // 格式化為列表格式
  const formattedCollaborations = formatAPIDataForList(activeCollaborations);

  console.log('📄 Final formatted collaborations:');
  formattedCollaborations.forEach((collab, index) => {
    console.log(`\n${index + 1}. ${collab.title}:`);
    console.log(`   Description: "${collab.description}"`);
    console.log(`   Description length: ${collab.description?.length || 0}`);
    console.log(`   Has description: ${!!collab.description}`);
  });
} else {
  console.log('❌ No collaborations found in localStorage');
}

console.log('✅ Debug completed!');
