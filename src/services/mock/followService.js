// mock-follow-service v1: Mock模式关注服务

import { getArtistById } from '../../components/artist-profile/utils/artistHelpers.js';
import { MOCK_USERS, getUserInfo } from '../../utils/mockUsers.js';
import { notificationService } from '../notificationService/index.js';

const STORAGE_KEY = 'tag_artist_follows';

/**
 * 获取存储的关注数据
 */
const getStoredFollowData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Failed to get stored follow data:', error);
    return {};
  }
};

/**
 * 保存关注数据
 */
const saveFollowData = data => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save follow data:', error);
  }
};

/**
 * 初始化关注关系基线（如果不存在）
 */
const initializeFollowBaseline = () => {
  const followData = getStoredFollowData();

  // 如果已经有数据，不重复初始化
  if (Object.keys(followData).length > 0) {
    return;
  }

  // 预设关注关系基线
  const baselineData = {
    bryan: {
      followers: ['alice', 'alex'], // bryan 被 alice 和 alex 关注
      followersCount: 2,
    },
    alice: {
      followers: ['bryan'], // alice 被 bryan 关注
      followersCount: 1,
    },
    alex: {
      followers: [], // alex 没有被任何人关注
      followersCount: 0,
    },
  };

  saveFollowData(baselineData);
  console.log('[MockFollow] Initialized follow baseline data');
};

/**
 * 切换关注状态
 * @param {string} followerId - 关注者ID
 * @param {string} artistId - 被关注艺术家ID
 * @returns {Object} 结果对象
 */
export const toggleFollow = async (followerId, artistId) => {
  try {
    if (!followerId || !artistId) {
      return {
        success: false,
        error: 'Missing followerId or artistId',
      };
    }

    // 不能关注自己
    if (followerId === artistId) {
      return {
        success: false,
        error: 'Cannot follow yourself',
      };
    }

    // 验证用户是否存在
    if (!MOCK_USERS[followerId] || !MOCK_USERS[artistId]) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // 获取当前关注数据
    const followData = getStoredFollowData();

    // 初始化艺术家记录
    if (!followData[artistId]) {
      followData[artistId] = {
        followers: [],
        followersCount: 0,
      };
    }

    const artistFollows = followData[artistId];
    const followerIndex = artistFollows.followers.indexOf(followerId);
    let isFollowing = false;

    if (followerIndex === -1) {
      // 用户未关注，添加关注
      artistFollows.followers.push(followerId);
      artistFollows.followersCount++;
      isFollowing = true;
      console.log(
        `[MockFollow] User ${followerId} followed artist ${artistId}`
      );
    } else {
      // 用户已关注，取消关注
      artistFollows.followers.splice(followerIndex, 1);
      artistFollows.followersCount--;
      isFollowing = false;
      console.log(
        `[MockFollow] User ${followerId} unfollowed artist ${artistId}`
      );
    }

    // 保存数据
    saveFollowData(followData);

    console.log(
      `[MockFollow] Artist ${artistId} followers count: ${artistFollows.followersCount}`
    );

    return {
      success: true,
      data: {
        isFollowing,
        followersCount: artistFollows.followersCount,
      },
    };
  } catch (error) {
    console.error('[MockFollow] Error toggling follow:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 检查用户是否已关注艺术家
 * @param {string} followerId - 关注者ID
 * @param {string} artistId - 艺术家ID
 * @returns {Object} 结果对象
 */
export const checkFollowStatus = async (followerId, artistId) => {
  try {
    if (!followerId || !artistId) {
      return {
        success: false,
        error: 'Missing followerId or artistId',
      };
    }

    const followData = getStoredFollowData();
    const artistFollows = followData[artistId];

    if (!artistFollows) {
      return {
        success: true,
        data: {
          isFollowing: false,
          followersCount: 0,
        },
      };
    }

    const isFollowing = artistFollows.followers.includes(followerId);

    return {
      success: true,
      data: {
        isFollowing,
        followersCount: artistFollows.followersCount,
      },
    };
  } catch (error) {
    console.error('[MockFollow] Error checking follow status:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 获取艺术家关注者数量
 * @param {string} artistId - 艺术家ID
 * @returns {Object} 结果对象
 */
export const getFollowersCount = async artistId => {
  try {
    if (!artistId) {
      return {
        success: false,
        error: 'Missing artistId',
      };
    }

    const followData = getStoredFollowData();
    const artistFollows = followData[artistId];

    return {
      success: true,
      data: {
        followersCount: artistFollows ? artistFollows.followersCount : 0,
      },
    };
  } catch (error) {
    console.error('[MockFollow] Error getting followers count:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 获取用户关注的艺术家列表
 * @param {string} userId - 用户ID
 * @returns {Object} 结果对象
 */
export const getFollowingList = async userId => {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'Missing userId',
      };
    }

    const followData = getStoredFollowData();
    const following = [];

    Object.keys(followData).forEach(artistId => {
      if (followData[artistId].followers.includes(userId)) {
        following.push(artistId);
      }
    });

    return {
      success: true,
      data: {
        following,
        followingCount: following.length,
      },
    };
  } catch (error) {
    console.error('[MockFollow] Error getting following list:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 清除所有关注数据（用于测试）
 */
export const clearAllFollowData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[MockFollow] All follow data cleared');
  } catch (error) {
    console.warn('[MockFollow] Failed to clear follow data:', error);
  }
};

/**
 * 获取所有关注统计（用于调试）
 */
export const getAllFollowStats = () => {
  try {
    const followData = getStoredFollowData();
    const stats = {};

    Object.keys(followData).forEach(artistId => {
      const artistFollows = followData[artistId];
      stats[artistId] = {
        followersCount: artistFollows.followersCount,
        uniqueFollowers: artistFollows.followers.length,
        followerList: artistFollows.followers,
      };
    });

    return stats;
  } catch (error) {
    console.error('[MockFollow] Error getting follow stats:', error);
    return {};
  }
};

/**
 * 调试函数：打印详细的关注信息
 */
export const debugFollowStats = artistId => {
  try {
    const followData = getStoredFollowData();
    const artistFollows = followData[artistId];

    if (!artistFollows) {
      console.log(`[Debug] No follow data for artist: ${artistId}`);
      return;
    }

    console.log(`[Debug] Follow stats for artist: ${artistId}`);
    console.log(`  Followers count: ${artistFollows.followersCount}`);
    console.log(`  Followers: ${artistFollows.followers.join(', ')}`);

    return artistFollows;
  } catch (error) {
    console.error('[Debug] Error getting follow stats:', error);
  }
};

/**
 * 生成 cursor 用于分页
 * @param {number} index - 索引
 * @returns {string} cursor
 */
const generateCursor = index => {
  return btoa(`cursor_${index}`).replace(/=/g, '');
};

/**
 * 解析 cursor 获取索引
 * @param {string} cursor - cursor字符串
 * @returns {number} 索引
 */
const parseCursor = cursor => {
  try {
    const decoded = atob(cursor);
    const match = decoded.match(/cursor_(\d+)/);
    return match ? parseInt(match[1]) : 0;
  } catch {
    return 0;
  }
};

/**
 * 搜索用户数据
 * @param {Array} userIds - 用户ID数组
 * @param {string} query - 搜索关键词
 * @returns {Array} 过滤后的用户ID数组
 */
const searchUsers = (userIds, query) => {
  if (!query.trim()) return userIds;

  const searchTerm = query.toLowerCase();
  return userIds.filter(userId => {
    const user = MOCK_USERS[userId];
    if (!user) return false;

    // 搜索姓名、学校、技能
    const searchableText = [
      user.displayName,
      user.name,
      user.school,
      ...(user.skills || []),
      ...(user.majors || []),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });
};

/**
 * 获取艺术家关注者列表（支持分页和搜索）
 * @param {string} artistId - 艺术家ID
 * @param {Object} options - 选项
 * @param {number} options.limit - 每页数量，默认20
 * @param {string} options.cursor - 分页游标
 * @param {string} options.q - 搜索关键词
 * @returns {Object} 结果对象
 */
export const getFollowersList = async (
  artistId,
  { limit = 20, cursor = null, q = '', currentUserId = 'alice' } = {}
) => {
  try {
    if (!artistId) {
      return {
        success: false,
        error: 'Missing artistId',
      };
    }

    // 初始化基线数据
    initializeFollowBaseline();

    const followData = getStoredFollowData();
    const artistFollows = followData[artistId];

    if (!artistFollows || !artistFollows.followers.length) {
      return {
        success: true,
        data: {
          items: [],
          hasMore: false,
          cursor: null,
        },
      };
    }

    // 获取所有关注者ID
    let followerIds = [...artistFollows.followers];

    // 应用搜索过滤
    if (q.trim()) {
      followerIds = searchUsers(followerIds, q);
    }

    // 应用分页
    const startIndex = cursor ? parseCursor(cursor) : 0;
    const endIndex = startIndex + limit;
    const paginatedIds = followerIds.slice(startIndex, endIndex);

    // 获取用户详细信息
    const items = await Promise.all(
      paginatedIds.map(async followerId => {
        // 使用getArtistById获取完整的用户数据，包括正确的头像
        const artistData = await getArtistById(followerId);
        if (!artistData) {
          console.warn(`[MockFollow] Artist data not found: ${followerId}`);
          return null;
        }

        // 检查当前用户是否关注了这个用户
        const isFollowedByMe =
          followData[followerId]?.followers.includes(currentUserId) || false;

        return {
          id: artistData.id,
          displayName: artistData.name, // 使用name字段作为displayName
          avatar: artistData.avatar, // 使用处理过的头像
          role: artistData.title || artistData.discipline, // 使用title或discipline字段
          school: artistData.school,
          skills: artistData.skills || [],
          isFollowedByMe: isFollowedByMe,
          isMutual: false, // 需要检查是否互相关注
        };
      })
    );

    // 过滤掉null值
    const validItems = items.filter(Boolean);

    const hasMore = endIndex < followerIds.length;
    const nextCursor = hasMore ? generateCursor(endIndex) : null;

    return {
      success: true,
      data: {
        items: validItems,
        hasMore,
        cursor: nextCursor,
      },
    };
  } catch (error) {
    console.error('[MockFollow] Error getting followers list:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 获取用户正在关注的艺术家列表（支持分页和搜索）
 * @param {string} userId - 用户ID
 * @param {Object} options - 选项
 * @param {number} options.limit - 每页数量，默认20
 * @param {string} options.cursor - 分页游标
 * @param {string} options.q - 搜索关键词
 * @returns {Object} 结果对象
 */
export const getFollowingListPaginated = async (
  userId,
  { limit = 20, cursor = null, q = '' } = {}
) => {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'Missing userId',
      };
    }

    // 初始化基线数据
    initializeFollowBaseline();

    const followData = getStoredFollowData();
    const following = [];

    // 找出用户关注的所有艺术家
    Object.keys(followData).forEach(artistId => {
      if (followData[artistId].followers.includes(userId)) {
        following.push(artistId);
      }
    });

    if (!following.length) {
      return {
        success: true,
        data: {
          items: [],
          hasMore: false,
          cursor: null,
        },
      };
    }

    // 应用搜索过滤
    let filteredFollowing = following;
    if (q.trim()) {
      filteredFollowing = searchUsers(following, q);
    }

    // 应用分页
    const startIndex = cursor ? parseCursor(cursor) : 0;
    const endIndex = startIndex + limit;
    const paginatedIds = filteredFollowing.slice(startIndex, endIndex);

    // 获取艺术家详细信息
    const items = await Promise.all(
      paginatedIds.map(async artistId => {
        // 使用getArtistById获取完整的用户数据，包括正确的头像
        const artistData = await getArtistById(artistId);
        if (!artistData) {
          console.warn(`[MockFollow] Artist data not found: ${artistId}`);
          return null;
        }

        return {
          id: artistData.id,
          displayName: artistData.name, // 使用name字段作为displayName
          avatar: artistData.avatar, // 使用处理过的头像
          role: artistData.title || artistData.discipline, // 使用title或discipline字段
          school: artistData.school,
          skills: artistData.skills || [],
          isFollowedByMe: true, // 用户正在关注这个艺术家
          isMutual: false, // 需要检查是否互相关注
        };
      })
    );

    // 过滤掉null值
    const validItems = items.filter(Boolean);

    const hasMore = endIndex < filteredFollowing.length;
    const nextCursor = hasMore ? generateCursor(endIndex) : null;

    return {
      success: true,
      data: {
        items: validItems,
        hasMore,
        cursor: nextCursor,
      },
    };
  } catch (error) {
    console.error('[MockFollow] Error getting following list:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 关注用户
 * @param {string} targetUserId - 目标用户ID
 * @param {string} currentUserId - 当前用户ID（可选，默认为 alice）
 * @returns {Object} 结果对象
 */
export const follow = async (targetUserId, currentUserId = 'alice') => {
  const result = await toggleFollow(currentUserId, targetUserId);

  if (result.success) {
    // 创建关注通知（只有当关注者不是被关注者时）
    if (currentUserId !== targetUserId) {
      try {
        // 获取关注者的真实姓名
        const followerInfo = await getArtistById(currentUserId);
        const followerName =
          followerInfo?.name ||
          MOCK_USERS[currentUserId]?.name ||
          'Unknown User';

        await notificationService.createFollowNotification(
          currentUserId,
          followerName,
          targetUserId
        );
        console.log('[FollowService] Created follow notification');
      } catch (error) {
        console.error(
          '[FollowService] Failed to create follow notification:',
          error
        );
        // 通知创建失败不影响关注功能
      }
    }

    // 触发事件通知其他组件
    window.dispatchEvent(
      new CustomEvent('follow:changed', {
        detail: {
          followerId: currentUserId,
          artistId: targetUserId,
          isFollowing: true,
          operation: 'follow',
        },
      })
    );
  }

  return result;
};

/**
 * 取消关注用户
 * @param {string} targetUserId - 目标用户ID
 * @param {string} currentUserId - 当前用户ID（可选，默认为 alice）
 * @returns {Object} 结果对象
 */
export const unfollow = async (targetUserId, currentUserId = 'alice') => {
  const result = await toggleFollow(currentUserId, targetUserId);

  if (result.success) {
    // 触发事件通知其他组件
    window.dispatchEvent(
      new CustomEvent('follow:changed', {
        detail: {
          followerId: currentUserId,
          artistId: targetUserId,
          isFollowing: false,
          operation: 'unfollow',
        },
      })
    );
  }

  return result;
};
