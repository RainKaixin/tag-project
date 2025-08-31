// debug-tagme-collaborations.js - 调试TAGMe页面的协作数据问题

console.log('🔍 Debugging TAGMe collaborations issue...');

// 检查 localStorage 中的协作数据
const stored = localStorage.getItem('mock_collaborations');
console.log('📦 Raw stored data:', stored);

if (stored) {
  const collaborations = JSON.parse(stored);
  console.log('📋 Total collaborations in storage:', collaborations.length);

  // 显示所有协作项目
  collaborations.forEach((collab, index) => {
    console.log(
      `${index + 1}. ${collab.title} (by ${collab.author?.id || 'unknown'})`
    );
  });

  // 检查是否有 Alex 的协作项目
  const alexCollaborations = collaborations.filter(
    c => c.author && c.author.id === 'alex'
  );
  console.log('👤 Alex collaborations:', alexCollaborations.length);

  // 检查是否有其他用户的协作项目
  const otherCollaborations = collaborations.filter(
    c => c.author && c.author.id !== 'alex'
  );
  console.log('👥 Other users collaborations:', otherCollaborations.length);

  // 检查协作项目的状态
  const activeCollaborations = collaborations.filter(
    c => c.status === 'active'
  );
  console.log('✅ Active collaborations:', activeCollaborations.length);

  // 检查协作项目的创建时间
  collaborations.forEach(collab => {
    console.log(`📅 ${collab.title}: created at ${collab.createdAt}`);
  });
} else {
  console.log('❌ No collaborations found in localStorage');
}

// 模拟 TAGMe 页面的 getCollaborations 调用
console.log('\n🔍 Simulating TAGMe getCollaborations call...');

// 模拟 getCollaborationsFromStorage 函数
const getCollaborationsFromStorage = () => {
  try {
    const stored = localStorage.getItem('mock_collaborations');
    const parsed = stored ? JSON.parse(stored) : [];
    console.log(
      '📊 getCollaborationsFromStorage returned:',
      parsed.length,
      'collaborations'
    );
    return parsed;
  } catch (error) {
    console.error('Error reading collaborations from storage:', error);
    return [];
  }
};

// 模拟 getCollaborations 函数
const getCollaborations = async (options = {}) => {
  try {
    const queryOptions = {
      page: 1,
      limit: 12,
      status: 'active',
      authorId: null,
      searchTerm: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...options,
    };

    let collaborations = getCollaborationsFromStorage();
    console.log('📋 Initial collaborations count:', collaborations.length);

    // 筛选逻辑
    if (queryOptions.authorId) {
      collaborations = collaborations.filter(
        c => c.author.id === queryOptions.authorId
      );
      console.log('🔍 After authorId filter:', collaborations.length);
    }

    if (queryOptions.status) {
      collaborations = collaborations.filter(
        c => c.status === queryOptions.status
      );
      console.log('🔍 After status filter:', collaborations.length);
    }

    if (queryOptions.searchTerm) {
      const searchTerm = queryOptions.searchTerm.toLowerCase();
      collaborations = collaborations.filter(
        c =>
          c.title.toLowerCase().includes(searchTerm) ||
          c.description.toLowerCase().includes(searchTerm) ||
          c.projectVision.toLowerCase().includes(searchTerm)
      );
      console.log('🔍 After searchTerm filter:', collaborations.length);
    }

    // 排序逻辑
    collaborations.sort((a, b) => {
      const aValue = a[queryOptions.sortBy];
      const bValue = b[queryOptions.sortBy];

      if (queryOptions.sortOrder === 'desc') {
        return new Date(bValue) - new Date(aValue);
      } else {
        return new Date(aValue) - new Date(bValue);
      }
    });

    // 分页逻辑
    const total = collaborations.length;
    const totalPages = Math.ceil(total / queryOptions.limit);
    const startIndex = (queryOptions.page - 1) * queryOptions.limit;
    const endIndex = startIndex + queryOptions.limit;
    const paginatedCollaborations = collaborations.slice(startIndex, endIndex);

    console.log('📄 Final result:', {
      total,
      totalPages,
      startIndex,
      endIndex,
      paginatedCount: paginatedCollaborations.length,
    });

    return {
      success: true,
      data: paginatedCollaborations,
      pagination: {
        page: queryOptions.page,
        limit: queryOptions.limit,
        total,
        totalPages,
        hasNext: queryOptions.page < totalPages,
        hasPrev: queryOptions.page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch collaborations',
    };
  }
};

// 测试 TAGMe 页面的调用
getCollaborations().then(result => {
  console.log('🎯 TAGMe getCollaborations result:', result);
  if (result.success) {
    console.log(
      '📊 TAGMe should display:',
      result.data.length,
      'collaborations'
    );
    result.data.forEach((collab, index) => {
      console.log(`${index + 1}. ${collab.title} (${collab.author?.id})`);
    });
  } else {
    console.log('❌ TAGMe getCollaborations failed:', result.error);
  }
});

console.log('✅ Debug completed!');
