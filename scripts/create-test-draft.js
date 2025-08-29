// 创建测试草稿数据
console.log('=== 创建测试草稿数据 ===');

// 模拟草稿数据结构
const testDraftData = {
  alice: [
    {
      id: 'draft_alice_001',
      userId: 'alice',
      title: '冰雪摄影项目草稿',
      draftType: 'collaboration',
      description: '一个关于冰雪摄影的协作项目',
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T14:20:00.000Z',
      status: 'draft',
    },
    {
      id: 'draft_alice_002',
      userId: 'alice',
      title: '风景摄影合作',
      draftType: 'collaboration',
      description: '寻找风景摄影师合作',
      createdAt: '2024-01-16T09:15:00.000Z',
      updatedAt: '2024-01-16T11:45:00.000Z',
      status: 'draft',
    },
  ],
  bryan: [
    {
      id: 'draft_bryan_001',
      userId: 'bryan',
      title: '插画设计项目',
      draftType: 'collaboration',
      description: '儿童插画设计项目',
      createdAt: '2024-01-14T16:00:00.000Z',
      updatedAt: '2024-01-15T08:30:00.000Z',
      status: 'draft',
    },
  ],
};

// 保存到localStorage
localStorage.setItem('tag_collaboration_drafts', JSON.stringify(testDraftData));

console.log('测试草稿数据已创建:');
console.log(JSON.stringify(testDraftData, null, 2));

// 验证数据
const savedData = localStorage.getItem('tag_collaboration_drafts');
console.log('\n验证保存的数据:');
console.log(savedData ? '✅ 数据保存成功' : '❌ 数据保存失败');
