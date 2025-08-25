// mock-like-service v1: Mock模式喜欢服务

const STORAGE_KEY = 'tag_artwork_likes';

/**
 * 获取存储的喜欢数据
 */
const getStoredLikeData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Failed to get stored like data:', error);
    return {};
  }
};

/**
 * 保存喜欢数据
 */
const saveLikeData = data => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save like data:', error);
  }
};

/**
 * 切换作品喜欢状态
 * @param {string} artworkId - 作品ID
 * @param {string} userId - 用户ID
 * @returns {Object} 结果对象
 */
export const toggleArtworkLike = async (artworkId, userId) => {
  try {
    if (!artworkId || !userId) {
      return {
        success: false,
        error: 'Missing artworkId or userId',
      };
    }

    // 获取当前喜欢数据
    const likeData = getStoredLikeData();

    // 初始化作品记录
    if (!likeData[artworkId]) {
      likeData[artworkId] = {
        totalLikes: 0,
        userLikes: [],
      };
    }

    const artworkLikes = likeData[artworkId];
    const userIndex = artworkLikes.userLikes.indexOf(userId);
    let isLiked = false;

    if (userIndex === -1) {
      // 用户未点赞，添加点赞
      artworkLikes.userLikes.push(userId);
      artworkLikes.totalLikes++;
      isLiked = true;
      console.log(`[MockLike] User ${userId} liked artwork ${artworkId}`);
    } else {
      // 用户已点赞，取消点赞
      artworkLikes.userLikes.splice(userIndex, 1);
      artworkLikes.totalLikes--;
      isLiked = false;
      console.log(`[MockLike] User ${userId} unliked artwork ${artworkId}`);
    }

    // 保存数据
    saveLikeData(likeData);

    console.log(
      `[MockLike] Artwork ${artworkId} total likes: ${artworkLikes.totalLikes}`
    );

    return {
      success: true,
      data: {
        liked: isLiked,
        likes: artworkLikes.totalLikes,
      },
    };
  } catch (error) {
    console.error('[MockLike] Error toggling like:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 检查用户是否已点赞作品
 * @param {string} artworkId - 作品ID
 * @param {string} userId - 用户ID
 * @returns {Object} 结果对象
 */
export const checkUserLikeStatus = async (artworkId, userId) => {
  try {
    if (!artworkId || !userId) {
      return {
        success: false,
        error: 'Missing artworkId or userId',
      };
    }

    const likeData = getStoredLikeData();
    const artworkLikes = likeData[artworkId];

    if (!artworkLikes) {
      return {
        success: true,
        data: {
          liked: false,
          likes: 0,
        },
      };
    }

    const isLiked = artworkLikes.userLikes.includes(userId);

    return {
      success: true,
      data: {
        liked: isLiked,
        likes: artworkLikes.totalLikes,
      },
    };
  } catch (error) {
    console.error('[MockLike] Error checking like status:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 获取作品总点赞数
 * @param {string} artworkId - 作品ID
 * @returns {Object} 结果对象
 */
export const getArtworkLikeCount = async artworkId => {
  try {
    if (!artworkId) {
      return {
        success: false,
        error: 'Missing artworkId',
      };
    }

    const likeData = getStoredLikeData();
    const artworkLikes = likeData[artworkId];

    return {
      success: true,
      data: {
        likes: artworkLikes ? artworkLikes.totalLikes : 0,
      },
    };
  } catch (error) {
    console.error('[MockLike] Error getting like count:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 清除所有喜欢数据（用于测试）
 */
export const clearAllLikeData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[MockLike] All like data cleared');
  } catch (error) {
    console.warn('[MockLike] Failed to clear like data:', error);
  }
};

/**
 * 获取所有喜欢统计（用于调试）
 */
export const getAllLikeStats = () => {
  try {
    const likeData = getStoredLikeData();
    const stats = {};

    Object.keys(likeData).forEach(artworkId => {
      const artworkLikes = likeData[artworkId];
      stats[artworkId] = {
        totalLikes: artworkLikes.totalLikes,
        uniqueUsers: artworkLikes.userLikes.length,
        userList: artworkLikes.userLikes,
      };
    });

    return stats;
  } catch (error) {
    console.error('[MockLike] Error getting like stats:', error);
    return {};
  }
};

/**
 * 调试函数：打印详细的喜欢信息
 */
export const debugLikeStats = artworkId => {
  try {
    const likeData = getStoredLikeData();
    const artworkLikes = likeData[artworkId];

    if (!artworkLikes) {
      console.log(`[Debug] No like data for artwork: ${artworkId}`);
      return;
    }

    console.log(`[Debug] Like stats for artwork: ${artworkId}`);
    console.log(`  Total likes: ${artworkLikes.totalLikes}`);
    console.log(`  User likes: ${artworkLikes.userLikes.join(', ')}`);

    return artworkLikes;
  } catch (error) {
    console.error('[Debug] Error getting like stats:', error);
  }
};
