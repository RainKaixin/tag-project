// mock-view-count-service v1: Mock模式浏览量统计服务

const STORAGE_KEY = 'tag_artwork_views';
const FINGERPRINT_KEY = 'tag_user_fingerprint';

/**
 * 生成简单的用户指纹
 */
const generateSimpleFingerprint = () => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
  ];

  let hash = 0;
  const str = components.join('|');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(36);
};

/**
 * 获取或创建用户指纹
 */
const getOrCreateUserFingerprint = () => {
  try {
    let fingerprint = localStorage.getItem(FINGERPRINT_KEY);
    if (!fingerprint) {
      fingerprint = generateSimpleFingerprint();
      localStorage.setItem(FINGERPRINT_KEY, fingerprint);
    }
    return fingerprint;
  } catch (error) {
    console.warn('Failed to access localStorage for fingerprint:', error);
    return generateSimpleFingerprint();
  }
};

/**
 * 获取存储的浏览量数据
 */
const getStoredViewData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Failed to get stored view data:', error);
    return {};
  }
};

/**
 * 保存浏览量数据
 */
const saveViewData = data => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save view data:', error);
  }
};

/**
 * 记录作品浏览
 */
export const recordArtworkView = async (artworkId, options = {}) => {
  try {
    const { userId = null, visitorFingerprint = null } = options;

    // 验证参数：确保登录用户不传递visitorFingerprint，未登录用户不传递userId
    if (userId && visitorFingerprint) {
      console.warn(
        '[MockViewCount] Warning: Both userId and visitorFingerprint provided, using userId only'
      );
    }

    // 获取当前浏览量数据
    const viewData = getStoredViewData();

    // 初始化作品记录
    if (!viewData[artworkId]) {
      viewData[artworkId] = {
        totalViews: 0,
        userViews: [],
        visitorViews: [],
      };
    }

    const artworkViews = viewData[artworkId];
    let isNewView = false;

    if (userId) {
      // 登录用户 - 只用userId去重
      if (!artworkViews.userViews.includes(userId)) {
        artworkViews.userViews.push(userId);
        artworkViews.totalViews++;
        isNewView = true;
        console.log(
          `[MockViewCount] New user view recorded for user: ${userId}`
        );
      } else {
        console.log(`[MockViewCount] User already viewed: ${userId}`);
      }
    } else if (visitorFingerprint) {
      // 未登录用户 - 只用visitorFingerprint去重
      if (!artworkViews.visitorViews.includes(visitorFingerprint)) {
        artworkViews.visitorViews.push(visitorFingerprint);
        artworkViews.totalViews++;
        isNewView = true;
        console.log(
          `[MockViewCount] New visitor view recorded for fingerprint: ${visitorFingerprint}`
        );
      } else {
        console.log(
          `[MockViewCount] Visitor already viewed: ${visitorFingerprint}`
        );
      }
    } else {
      console.warn('[MockViewCount] No userId or visitorFingerprint provided');
    }

    // 保存数据
    saveViewData(viewData);

    console.log(
      `[MockViewCount] ${
        isNewView ? 'New view recorded' : 'View already exists'
      } for artwork: ${artworkId}`
    );

    return {
      success: true,
      viewCount: artworkViews.totalViews,
      isNewView,
    };
  } catch (error) {
    console.error('[MockViewCount] Error recording view:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 获取作品浏览量
 */
export const getArtworkViewCount = async artworkId => {
  try {
    const viewData = getStoredViewData();
    const artworkViews = viewData[artworkId];

    return {
      success: true,
      viewCount: artworkViews ? artworkViews.totalViews : 0,
    };
  } catch (error) {
    console.error('[MockViewCount] Error getting view count:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 检查用户是否已浏览过作品
 */
export const hasUserViewedArtwork = async (artworkId, options = {}) => {
  try {
    const { userId = null, visitorFingerprint = null } = options;
    const viewData = getStoredViewData();
    const artworkViews = viewData[artworkId];

    if (!artworkViews) {
      return { success: true, hasViewed: false };
    }

    let hasViewed = false;
    if (userId) {
      hasViewed = artworkViews.userViews.includes(userId);
    } else if (visitorFingerprint) {
      hasViewed = artworkViews.visitorViews.includes(visitorFingerprint);
    }

    return {
      success: true,
      hasViewed,
    };
  } catch (error) {
    console.error(
      '[MockViewCount] Error checking if user viewed artwork:',
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 获取用户指纹
 */
export const getUserFingerprint = () => {
  return getOrCreateUserFingerprint();
};

/**
 * 清除所有浏览量数据（用于测试）
 */
export const clearAllViewData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FINGERPRINT_KEY);
    console.log('[MockViewCount] All view data cleared');
  } catch (error) {
    console.warn('[MockViewCount] Failed to clear view data:', error);
  }
};

/**
 * 获取所有浏览量统计（用于调试）
 */
export const getAllViewStats = () => {
  try {
    const viewData = getStoredViewData();
    const stats = {};

    Object.keys(viewData).forEach(artworkId => {
      const artworkViews = viewData[artworkId];
      stats[artworkId] = {
        totalViews: artworkViews.totalViews,
        uniqueUsers: artworkViews.userViews.length,
        uniqueVisitors: artworkViews.visitorViews.length,
      };
    });

    return stats;
  } catch (error) {
    console.error('[MockViewCount] Error getting view stats:', error);
    return {};
  }
};

/**
 * 调试函数：打印详细的浏览量信息
 */
export const debugViewStats = artworkId => {
  try {
    const viewData = getStoredViewData();
    const artworkViews = viewData[artworkId];

    if (!artworkViews) {
      console.log(`[Debug] No view data for artwork: ${artworkId}`);
      return;
    }

    console.log(`[Debug] View stats for artwork: ${artworkId}`);
    console.log(`  Total views: ${artworkViews.totalViews}`);
    console.log(`  User views: ${artworkViews.userViews.join(', ')}`);
    console.log(`  Visitor views: ${artworkViews.visitorViews.join(', ')}`);

    return artworkViews;
  } catch (error) {
    console.error('[Debug] Error getting view stats:', error);
  }
};
