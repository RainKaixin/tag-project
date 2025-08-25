/**
 * 收藏相关辅助函数
 */

/**
 * 格式化收藏时间
 * @param {string} timestamp - 时间戳
 * @returns {string} 格式化后的时间
 */
export const formatFavoriteTime = timestamp => {
  const now = new Date();
  const favoriteTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - favoriteTime) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return favoriteTime.toLocaleDateString();
  }
};

/**
 * 获取收藏类型显示名称
 * @param {string} itemType - 项目类型
 * @returns {string} 显示名称
 */
export const getFavoriteTypeLabel = itemType => {
  switch (itemType) {
    case 'work':
      return 'Work';
    case 'collaboration':
      return 'Collaboration';
    default:
      return 'Item';
  }
};

/**
 * 获取收藏类型颜色
 * @param {string} itemType - 项目类型
 * @returns {string} CSS类名
 */
export const getFavoriteTypeColor = itemType => {
  switch (itemType) {
    case 'work':
      return 'text-tag-blue';
    case 'collaboration':
      return 'text-tag-purple';
    default:
      return 'text-gray-600';
  }
};

/**
 * 获取收藏类型背景色
 * @param {string} itemType - 项目类型
 * @returns {string} CSS类名
 */
export const getFavoriteTypeBgColor = itemType => {
  switch (itemType) {
    case 'work':
      return 'bg-blue-100';
    case 'collaboration':
      return 'bg-purple-100';
    default:
      return 'bg-gray-100';
  }
};

/**
 * 验证收藏数据格式
 * @param {Object} favorite - 收藏数据
 * @returns {boolean} 是否有效
 */
export const validateFavoriteData = favorite => {
  return (
    favorite &&
    typeof favorite.id === 'string' &&
    typeof favorite.itemType === 'string' &&
    typeof favorite.itemId === 'string' &&
    favorite.itemType in ['work', 'collaboration']
  );
};

/**
 * 排序收藏列表
 * @param {Array} favorites - 收藏列表
 * @param {string} sortBy - 排序方式 ('time' | 'type')
 * @returns {Array} 排序后的列表
 */
export const sortFavorites = (favorites, sortBy = 'time') => {
  const sorted = [...favorites];

  switch (sortBy) {
    case 'time':
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    case 'type':
      return sorted.sort((a, b) => a.itemType.localeCompare(b.itemType));
    default:
      return sorted;
  }
};

/**
 * 过滤收藏列表
 * @param {Array} favorites - 收藏列表
 * @param {string} filterType - 过滤类型 ('all' | 'work' | 'collaboration')
 * @returns {Array} 过滤后的列表
 */
export const filterFavorites = (favorites, filterType) => {
  if (filterType === 'all') {
    return favorites;
  }
  return favorites.filter(favorite => favorite.itemType === filterType);
};

// favorites-helpers v1: 收藏功能辅助工具

/**
 * 获取作品数据映射
 * 支持两种ID格式：简单数字ID和复杂mock ID
 */
export const getWorkDataById = itemId => {
  // 默认作品数据 - 用于简单数字ID的映射
  const defaultArtworks = [
    {
      id: 1,
      title: 'Explosive Energy',
      artist: 'Alex Chen',
      image: null, // 移除默认图片
      category: 'Visual Effects',
    },
    {
      id: 2,
      title: 'Dark Knight',
      artist: 'Sarah Kim',
      image: null, // 移除默认图片
      category: 'Game Design',
    },
    {
      id: 3,
      title: 'Mobile UI Design',
      artist: 'Mike Johnson',
      image: null, // 移除默认图片
      category: 'UI/UX',
    },
    {
      id: 4,
      title: 'Enchanted Forest',
      artist: 'Emma Wilson',
      image: null, // 移除默认图片
      category: 'Illustration',
    },
    {
      id: 5,
      title: 'Digital Sculpture',
      artist: 'David Lee',
      image: null, // 移除默认图片
      category: 'Fine Art',
    },
    {
      id: 6,
      title: 'Brand Identity',
      artist: 'Lisa Wang',
      image: null, // 移除默认图片
      category: 'Graphic Design',
    },
  ];

  // 首先尝试简单数字ID匹配
  const simpleMatch = defaultArtworks.find(art => art.id.toString() === itemId);
  if (simpleMatch) {
    return simpleMatch;
  }

  // 如果是复杂的mock ID，使用固定的图片映射
  if (itemId && itemId.startsWith('mock_')) {
    // 为复杂ID提供一个固定的映射，确保一致性
    const mockIdToImageMap = {
      // 基于时间戳的哈希来确定使用哪张图片，确保同一个ID总是返回同一张图片
      default:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', // 冬天日本建筑
    };

    // 使用itemId的哈希来选择图片，确保一致性
    const imageIndex =
      Math.abs(itemId.split('_')[1] ? parseInt(itemId.split('_')[1]) : 0) %
      defaultArtworks.length;
    const selectedArtwork = defaultArtworks[imageIndex];

    return {
      id: itemId,
      title: selectedArtwork.title,
      artist: selectedArtwork.artist,
      image: selectedArtwork.image,
      category: selectedArtwork.category,
    };
  }

  return null;
};

/**
 * 获取协作数据映射
 * 与TAGMe中的collaborations数据保持一致
 */
export const getCollaborationDataById = itemId => {
  // 真实协作数据映射 - 与TAGMe中的collaborations数据保持一致
  const collaborations = [
    {
      id: 1,
      title: 'Brand Identity with Studio X',
      image: null, // 移除默认图片
    },
    {
      id: 2,
      title: 'Interactive Web Experience',
      image: null, // 移除默认图片
    },
    {
      id: 3,
      title: '3D Character Animation',
      image: null, // 移除默认图片
    },
  ];

  // 根据itemId查找对应的协作项目 - 保持字符串类型匹配
  return collaborations.find(collab => collab.id.toString() === itemId);
};

/**
 * 获取作品图片URL
 */
export const getWorkImageUrl = itemId => {
  const artwork = getWorkDataById(itemId);
  return (
    artwork?.image || null // 移除默认图片
  );
};

/**
 * 获取协作图片URL
 */
export const getCollaborationImageUrl = itemId => {
  const collaboration = getCollaborationDataById(itemId);
  return (
    collaboration?.image || null // 移除默认图片
  );
};
