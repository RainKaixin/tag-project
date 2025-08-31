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
      default: '/assets/placeholder.svg', // 本地占位图
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
 * 从localStorage获取真实的协作数据
 */
export const getCollaborationDataById = itemId => {
  try {
    console.log('[getCollaborationDataById] Looking for itemId:', itemId);

    // 从localStorage获取真实的协作数据 - 使用正确的存储键名
    const stored = localStorage.getItem('mock_collaborations');
    console.log('[getCollaborationDataById] Raw stored data:', stored);

    if (stored) {
      const collaborations = JSON.parse(stored);
      console.log(
        '[getCollaborationDataById] Parsed collaborations:',
        collaborations
      );

      // 查找匹配的协作项目
      console.log('[getCollaborationDataById] Searching for itemId:', itemId);
      console.log(
        '[getCollaborationDataById] Available collaborations:',
        collaborations.map(c => ({ id: c.id, title: c.title }))
      );

      // 尝试多种 ID 匹配方式
      let collaboration = collaborations.find(collab => collab.id === itemId);

      // 如果直接匹配失败，尝试字符串匹配
      if (!collaboration) {
        collaboration = collaborations.find(
          collab => collab.id.toString() === itemId.toString()
        );
      }

      // 如果还是失败，尝试数字匹配
      if (!collaboration && !isNaN(itemId)) {
        collaboration = collaborations.find(
          collab => collab.id === parseInt(itemId)
        );
      }
      if (collaboration) {
        console.log(
          '[getCollaborationDataById] Found collaboration data:',
          collaboration
        );
        console.log(
          '[getCollaborationDataById] Collaboration roles:',
          collaboration.roles
        );
        return collaboration;
      } else {
        console.warn(
          '[getCollaborationDataById] No collaboration found with id:',
          itemId
        );
        console.log(
          '[getCollaborationDataById] Available IDs:',
          collaborations.map(c => c.id)
        );

        // 尝试查找最新的协作项目（如果没有找到匹配的ID）
        if (collaborations.length > 0) {
          const latestCollaboration = collaborations[0];
          console.log(
            '[getCollaborationDataById] Using latest collaboration as fallback:',
            latestCollaboration
          );
          console.log(
            '[getCollaborationDataById] Latest collaboration roles:',
            latestCollaboration.roles
          );
          return latestCollaboration;
        }
      }
    } else {
      console.warn('[getCollaborationDataById] No data in localStorage');
    }

    // 如果localStorage中没有数据，尝试从默认数据中查找
    console.warn(
      '[getCollaborationDataById] No collaboration data found in localStorage for itemId:',
      itemId
    );
    return null;
  } catch (error) {
    console.error(
      '[getCollaborationDataById] Error getting collaboration data:',
      error
    );
    return null;
  }
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
export const getCollaborationImageUrl = async itemId => {
  const collaboration = getCollaborationDataById(itemId);

  if (!collaboration) {
    console.warn('[Favorites] No collaboration data found for itemId:', itemId);
    return null;
  }

  console.log('[Favorites] Getting image for collaboration:', collaboration);

  // 优先使用 posterPreview key（与CollaborationGrid保持一致）
  if (collaboration.posterPreview) {
    try {
      const imageStorage = await import('../../../utils/indexedDB.js');
      const imageUrl = await imageStorage.default.getImageUrl(
        collaboration.posterPreview
      );
      console.log('[Favorites] Got image URL from posterPreview:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.warn(
        `[Favorites] Failed to get collaboration image from posterPreview: ${collaboration.posterPreview}`,
        error
      );
    }
  }

  // 回退到 heroImage key
  if (collaboration.heroImage) {
    try {
      const imageStorage = await import('../../../utils/indexedDB.js');
      const imageUrl = await imageStorage.default.getImageUrl(
        collaboration.heroImage
      );
      console.log('[Favorites] Got image URL from heroImage:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.warn(
        `[Favorites] Failed to get collaboration image from heroImage: ${collaboration.heroImage}`,
        error
      );
    }
  }

  // 回退到其他图片字段
  if (collaboration.image) {
    console.log('[Favorites] Using fallback image:', collaboration.image);
    return collaboration.image;
  }

  console.warn('[Favorites] No image found for collaboration:', itemId);
  return null;
};
