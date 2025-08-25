// artwork-service: 统一作品数据源 + 事件系统
// 单一数据源，统一事件广播，规范化数据

const KEY_PREFIX = 'tag.artwork.';
const storageKey = userId => `${KEY_PREFIX}${userId}`;

// 数据模型
/**
 * @typedef {Object} Artwork
 * @property {string} id - 作品ID（自动生成）
 * @property {string} userId - 用户ID
 * @property {string} title - 作品标题（必填）
 * @property {string} category - 作品分类
 * @property {string} description - 作品描述
 * @property {string[]} tags - 标签数组
 * @property {string[]} imageUrls - 图片URL数组
 * @property {string} thumbnailUrl - 缩略图URL
 * @property {string} createdAt - 创建时间（ISO格式）
 * @property {string} updatedAt - 更新时间（ISO格式）
 * @property {boolean} isPublic - 是否公开（默认true）
 */

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 规范化数组字段：去重、去空
function normalizeArrayField(array) {
  if (!Array.isArray(array)) return [];

  return array
    .filter(item => item && item.trim()) // 去空
    .map(item => item.trim()) // 去空格
    .filter((item, index, arr) => arr.indexOf(item) === index); // 去重
}

// 规范化 Artwork 数据
function normalizeArtwork(artwork) {
  return {
    id: artwork.id || generateId(),
    userId: artwork.userId || '',
    title: (artwork.title || '').trim(),
    category: (artwork.category || '').trim(),
    description: (artwork.description || '').trim(),
    tags: normalizeArrayField(artwork.tags || []),
    imageUrls: normalizeArrayField(artwork.imageUrls || []),
    thumbnailUrl: artwork.thumbnailUrl || '',
    createdAt: artwork.createdAt || new Date().toISOString(),
    updatedAt: artwork.updatedAt || new Date().toISOString(),
    isPublic: artwork.isPublic !== false, // 默认公开
  };
}

// 获取默认 Artwork
function getDefaultArtwork(userId) {
  return {
    id: generateId(),
    userId: userId,
    title: '',
    category: '',
    description: '',
    tags: [],
    imageUrls: [],
    thumbnailUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: true,
  };
}

// 读取用户作品数据
function readUserArtworksData(userId) {
  try {
    if (typeof window === 'undefined') return [];
    const data = window.localStorage.getItem(storageKey(userId));
    const artworks = data ? JSON.parse(data) : [];
    console.log(
      `[artworkService] Read artworks for user ${userId}:`,
      artworks.length,
      'artworks'
    );
    return artworks;
  } catch (error) {
    console.warn('Failed to read user artworks data:', error);
    return [];
  }
}

// 写入用户作品数据
function writeUserArtworksData(userId, artworks) {
  try {
    if (typeof window !== 'undefined') {
      const key = storageKey(userId);
      const data = JSON.stringify(artworks);
      window.localStorage.setItem(key, data);
      console.log(
        `[artworkService] Saved ${artworks.length} artworks for user ${userId} to localStorage key: ${key}`
      );
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Failed to write user artworks data:', error);
    return false;
  }
}

// 广播 artwork:updated 事件
function broadcastArtworkUpdated(artwork, action = 'updated') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('artwork:updated', {
        detail: { artwork, action },
      })
    );
  }
}

// 验证 Artwork 数据
function validateArtwork(artwork) {
  const errors = {};

  if (!artwork.title || !artwork.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!artwork.userId || !artwork.userId.trim()) {
    errors.userId = 'User ID is required';
  }

  if (!artwork.category || !artwork.category.trim()) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// 获取用户的所有作品
export const getUserArtworks = async userId => {
  try {
    const artworks = readUserArtworksData(userId);
    return {
      success: true,
      data: artworks.map(artwork => normalizeArtwork(artwork)),
    };
  } catch (error) {
    console.error('Failed to get user artworks:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取单个作品
export const getArtwork = async (userId, artworkId) => {
  try {
    const artworks = readUserArtworksData(userId);
    const artwork = artworks.find(a => a.id === artworkId);

    if (!artwork) {
      return {
        success: false,
        error: 'Artwork not found',
      };
    }

    return {
      success: true,
      data: normalizeArtwork(artwork),
    };
  } catch (error) {
    console.error('Failed to get artwork:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 创建新作品
export const createArtwork = async (userId, artworkData) => {
  try {
    const newArtwork = {
      ...getDefaultArtwork(userId),
      ...artworkData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const normalizedArtwork = normalizeArtwork(newArtwork);

    // 验证数据
    const validation = validateArtwork(normalizedArtwork);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // 读取现有数据
    const existingArtworks = readUserArtworksData(userId);
    const updatedArtworks = [...existingArtworks, normalizedArtwork];

    // 写入持久化存储
    const writeSuccess = writeUserArtworksData(userId, updatedArtworks);
    if (!writeSuccess) {
      return {
        success: false,
        error: 'Failed to save artwork data',
      };
    }

    // 广播事件
    broadcastArtworkUpdated(normalizedArtwork, 'created');

    return {
      success: true,
      data: normalizedArtwork,
    };
  } catch (error) {
    console.error('Failed to create artwork:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 更新作品
export const updateArtwork = async (userId, artworkId, patch) => {
  try {
    // 读取现有数据
    const existingArtworks = readUserArtworksData(userId);
    const artworkIndex = existingArtworks.findIndex(a => a.id === artworkId);

    if (artworkIndex === -1) {
      return {
        success: false,
        error: 'Artwork not found',
      };
    }

    const existingArtwork = existingArtworks[artworkIndex];

    // 合并数据
    const updatedArtwork = {
      ...existingArtwork,
      ...patch,
      id: artworkId, // 确保 ID 不变
      userId: userId, // 确保用户ID不变
      updatedAt: new Date().toISOString(), // 更新时间
    };

    const normalizedArtwork = normalizeArtwork(updatedArtwork);

    // 验证数据
    const validation = validateArtwork(normalizedArtwork);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // 更新数组
    const updatedArtworks = [...existingArtworks];
    updatedArtworks[artworkIndex] = normalizedArtwork;

    // 写入持久化存储
    const writeSuccess = writeUserArtworksData(userId, updatedArtworks);
    if (!writeSuccess) {
      return {
        success: false,
        error: 'Failed to save artwork data',
      };
    }

    // 广播事件
    broadcastArtworkUpdated(normalizedArtwork, 'updated');

    return {
      success: true,
      data: normalizedArtwork,
    };
  } catch (error) {
    console.error('Failed to update artwork:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 删除作品
export const deleteArtwork = async (userId, artworkId) => {
  try {
    // 读取现有数据
    const existingArtworks = readUserArtworksData(userId);
    const artworkIndex = existingArtworks.findIndex(a => a.id === artworkId);

    if (artworkIndex === -1) {
      return {
        success: false,
        error: 'Artwork not found',
      };
    }

    const deletedArtwork = existingArtworks[artworkIndex];

    // 移除作品
    const updatedArtworks = existingArtworks.filter(a => a.id !== artworkId);

    // 写入持久化存储
    const writeSuccess = writeUserArtworksData(userId, updatedArtworks);
    if (!writeSuccess) {
      return {
        success: false,
        error: 'Failed to delete artwork data',
      };
    }

    // 广播事件
    broadcastArtworkUpdated(deletedArtwork, 'deleted');

    return {
      success: true,
      data: deletedArtwork,
    };
  } catch (error) {
    console.error('Failed to delete artwork:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取所有公开作品（用于公共画廊）
export const getAllPublicArtworks = async () => {
  try {
    if (typeof window === 'undefined') return { success: true, data: [] };

    const allArtworks = [];
    const keys = Object.keys(window.localStorage);

    // 查找所有作品相关的存储键
    const artworkKeys = keys.filter(key => key.startsWith(KEY_PREFIX));

    for (const key of artworkKeys) {
      try {
        const artworks = JSON.parse(window.localStorage.getItem(key));
        if (Array.isArray(artworks)) {
          // 只添加公开的作品
          const publicArtworks = artworks.filter(
            artwork => artwork.isPublic !== false
          );
          allArtworks.push(...publicArtworks);
        }
      } catch (error) {
        console.warn('Failed to parse artworks from key:', key, error);
      }
    }

    return {
      success: true,
      data: allArtworks.map(artwork => normalizeArtwork(artwork)),
    };
  } catch (error) {
    console.error('Failed to get all public artworks:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 订阅 artwork:updated 事件
export const subscribeArtworkUpdated = callback => {
  if (typeof window === 'undefined') {
    return () => {}; // 服务端渲染时返回空函数
  }

  const handleEvent = event => {
    callback(event.detail);
  };

  window.addEventListener('artwork:updated', handleEvent);

  // 返回解绑函数
  return () => {
    window.removeEventListener('artwork:updated', handleEvent);
  };
};

// 调试函数：检查所有作品数据
export const debugArtworkStorage = () => {
  if (typeof window === 'undefined') return;

  console.log('[artworkService] Debug: Checking all artwork storage...');
  const keys = Object.keys(window.localStorage);
  const artworkKeys = keys.filter(key => key.startsWith(KEY_PREFIX));

  console.log('[artworkService] Debug: Found artwork keys:', artworkKeys);

  artworkKeys.forEach(key => {
    try {
      const data = window.localStorage.getItem(key);
      const artworks = JSON.parse(data);
      console.log(
        `[artworkService] Debug: ${key} contains ${artworks.length} artworks:`,
        artworks
      );
    } catch (error) {
      console.error(`[artworkService] Debug: Error reading ${key}:`, error);
    }
  });
};
