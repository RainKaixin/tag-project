// artist-helpers v1: 艺术家档案工具函数集合

import { getUnifiedAvatar } from '../../../services/avatarService.js';
import { getProfile } from '../../../services/supabase/userProfileService.js';
import {
  getFollowers,
  getFollowing,
} from '../../../services/supabase/users.js';
import { getCachedAvatar } from '../../../utils/avatarCache.js';
import avatarStorage from '../../../utils/avatarStorage.js';
import { MOCK_USERS } from '../../../utils/mockUsers.js';

// 简单的内存缓存，用于存储艺术家数据
const artistCache = new Map();

/**
 * 缓存失效机制
 * @param {Array} keys - 缓存键数组，如 ['artist', id]
 */
export const invalidate = keys => {
  if (!Array.isArray(keys) || keys.length === 0) {
    console.warn('[invalidate] Invalid keys provided:', keys);
    return;
  }

  const [type, id] = keys;

  if (type === 'artist' && id) {
    // 清除特定艺术家的缓存
    const cacheKey = `artist_${id}`;
    if (artistCache.has(cacheKey)) {
      artistCache.delete(cacheKey);
      console.log(`[invalidate] Cleared cache for artist: ${id}`);
    }
  } else if (type === 'artist') {
    // 清除所有艺术家缓存
    for (const [key] of artistCache) {
      if (key.startsWith('artist_')) {
        artistCache.delete(key);
      }
    }
    console.log('[invalidate] Cleared all artist cache');
  }
};

/**
 * 艺术家视图数据选择器
 * 将原始 profile 数据转换为 UI 友好的格式
 * 这是 UI 和数据源的解耦层，未来 Supabase schema 变化时只需更新此函数
 *
 * @param {Object} profile - 原始 profile 数据
 * @param {Object} mockUser - MOCK_USERS 中的默认数据（可选）
 * @returns {Object} UI 友好的艺术家数据
 */
export const selectArtistView = (
  profile,
  mockUser = null,
  followStats = null
) => {
  // 防御性编程：确保 profile 存在
  if (!profile) {
    console.warn('[selectArtistView] No profile provided');
    return null;
  }

  // 获取作品数据
  const works = mockUser?.portfolio
    ? mockUser.portfolio.map((item, index) => ({
        id: item.id,
        title: item.title,
        image: item.thumb,
        category: item.category,
      }))
    : [];

  // 统一的数据转换逻辑
  return {
    // 基础信息
    id: profile.id || '',
    name: profile.fullName || profile.name || 'Unknown Artist',

    // 角色信息 - 这是关键字段，未来可能从不同来源获取
    title: profile.title || profile.role || 'Artist',
    discipline: profile.title || profile.role || 'Artist',
    roleIcon: getRoleIcon(profile.title || profile.role),

    // 个人资料
    avatar: profile.avatar || mockUser?.avatar || '',
    bio: profile.bio || mockUser?.bio || '',
    school: profile.school || mockUser?.school || '',
    pronouns: profile.pronouns || mockUser?.pronouns || '',

    // 专业信息
    majors: Array.isArray(profile.majors) ? profile.majors : [],
    minors: Array.isArray(profile.minors) ? profile.minors : [],
    skills: Array.isArray(profile.skills) ? profile.skills : [],

    // 作品数据
    works: works,

    // 统计数据 - 使用实时数据
    stats: {
      following: followStats?.following || 0,
      followers: followStats?.followers || 0,
      collaborations: 12,
    },

    // 社交链接 - 只使用 profile 数据，不提供默认链接
    socialLinks: {
      instagram: profile.socialLinks?.instagram || '',
      portfolio: profile.socialLinks?.portfolio || '',
      discord: profile.socialLinks?.discord || '',
      otherLinks: profile.socialLinks?.otherLinks || [],
    },

    // 元数据
    updatedAt: profile.updatedAt || new Date().toISOString(),
  };
};

/**
 * 根据角色获取对应的图标
 * @param {string} role - 角色名称
 * @returns {string} 角色图标
 */
const getRoleIcon = role => {
  const roleIcons = {
    Photographer: '📷',
    'Visual Designer': '🎨',
    Illustrator: '🎨',
    'Concept Artist': '🎭',
    'Graphic Designer': '🎨',
    'Digital Artist': '🎨',
    '3D Artist': '🎭',
    Animator: '🎬',
    default: '🎨',
  };

  return roleIcons[role] || roleIcons.default;
};

/**
 * 根据用户ID获取艺术家数据（统一数据源）
 * @param {string} userId - 用户ID
 * @returns {Promise<Object|null>} 艺术家数据对象或null
 */
export const getArtistById = async userId => {
  try {
    if (!userId) {
      console.warn('[getArtistById] No userId provided');
      return null;
    }

    // 检查缓存
    const cacheKey = `artist_${userId}`;
    if (artistCache.has(cacheKey)) {
      console.log(`[getArtistById] Using cached data for: ${userId}`);
      return artistCache.get(cacheKey);
    }

    // 首先尝试从 Supabase 获取用户档案
    const profileResult = await getProfile(userId);
    let profile = null;
    let mockUser = null;

    if (profileResult.success && profileResult.data) {
      // 找到了 Supabase 档案，使用它
      profile = profileResult.data;
      console.log(`[getArtistById] Found Supabase profile for: ${userId}`);
    } else {
      // 没有找到 Supabase 档案，检查是否是 Mock 用户
      const idMapping = {
        1: 'alex',
        2: 'alice',
        3: 'bryan',
      };
      const mappedId = idMapping[userId] || userId;
      mockUser = MOCK_USERS[mappedId];

      if (!mockUser) {
        console.warn(
          `[getArtistById] No profile found for ID: ${userId}, creating default profile`
        );
        // 创建默认档案
        profile = createDefaultProfile(userId);
      }
    }

    // 使用統一的頭像服務獲取頭像數據
    let avatar = null;
    try {
      avatar = await getUnifiedAvatar(userId);
      console.log(
        '[getArtistById] Using unified avatar service for:',
        userId,
        avatar ? 'found' : 'not found'
      );
    } catch (error) {
      console.warn('[getArtistById] Failed to get unified avatar:', error);
      // 回退到 mockUser 的默認頭像
      avatar = mockUser?.avatar || null;
    }

    // 使用选择器统一数据格式，严格遵循单一事实来源原则
    // 优先使用 profile 数据（用户编辑的真实数据），仅在没有 profile 数据时使用 mockUser 作为默认值
    // ⚠️ 未来 Supabase 迁移时，将完全移除 mockUser 回退逻辑

    // 准备 profile 数据（合并 avatar 信息）
    const profileWithAvatar = profile
      ? {
          ...profile,
          avatar: avatar, // 使用处理过的头像
        }
      : null;

    // 获取关注统计数据
    const followStats = { following: 0, followers: 0 };
    try {
      const [followersResult, followingResult] = await Promise.all([
        getFollowers(userId),
        getFollowing(userId),
      ]);

      if (followersResult.success) {
        followStats.followers = followersResult.data.length;
      }
      if (followingResult.success) {
        followStats.following = followingResult.data.length;
      }

      console.log(`[getArtistById] Follow stats for ${userId}:`, followStats);
    } catch (error) {
      console.warn(
        `[getArtistById] Failed to get follow stats for ${userId}:`,
        error
      );
    }

    // 使用选择器转换数据
    const artistView = selectArtistView(
      profileWithAvatar,
      mockUser,
      followStats
    );

    if (!artistView) {
      console.warn(
        `[getArtistById] Failed to create artist view for ${userId}`
      );
      return null;
    }

    // 调试日志：检查 socialLinks 数据
    console.log('[getArtistById] Artist view socialLinks:', {
      userId: userId,
      profileSocialLinks: profileWithAvatar?.socialLinks,
      mockUserSocialLinks: mockUser?.socialLinks,
      finalSocialLinks: artistView.socialLinks,
    });

    // 缓存结果
    artistCache.set(cacheKey, artistView);
    console.log(`[getArtistById] Cached data for: ${userId}`);

    return artistView;
  } catch (error) {
    console.error(
      `[getArtistById] Error getting artist data for ${userId}:`,
      error
    );
    return null;
  }
};

/**
 * 根据用户ID或用户对象获取艺术家数据（保留用于兼容性）
 * @param {string|number|Object} userOrId - 用户ID或用户对象
 * @returns {Promise<Object|null>} 艺术家数据对象或null
 */
export const getArtistData = async userOrId => {
  // 如果是对象，直接使用
  if (typeof userOrId === 'object' && userOrId !== null) {
    const currentUser = userOrId;
    return {
      id: currentUser.id,
      name: currentUser.name,
      title: currentUser.role,
      discipline: currentUser.role,
      avatar: currentUser.avatar,
      bio: currentUser.bio,
      school: currentUser.school || '',
      pronouns: currentUser.pronouns || '',
      majors: currentUser.majors || [],
      skills: currentUser.skills || [
        currentUser.role,
        'Digital Art',
        'Creative Design',
      ],
      stats: {
        following: 28,
        followers: 0,
        collaborations: 12,
      },
      socialLinks: {
        instagram: currentUser.socialLinks?.instagram || '',
        portfolio: currentUser.socialLinks?.portfolio || '',
        discord: currentUser.socialLinks?.discord || '',
        otherLinks: currentUser.socialLinks?.otherLinks || [],
      },
    };
  }

  // 如果是ID，统一使用 getArtistById 获取数据
  const userId = userOrId?.toString?.();
  if (!userId) {
    console.warn('[getArtistData] No userId provided');
    return null;
  }

  // 调用统一的 getArtistById 函数
  return await getArtistById(userId);
};

/**
 * 根据用户ID或用户对象获取作品数据
 * @param {string|number|Object} userOrId - 用户ID或用户对象
 * @returns {Array} 作品数据数组
 */
export const getArtworksByUser = async userOrId => {
  // 如果是对象，直接使用
  if (typeof userOrId === 'object' && userOrId !== null) {
    const currentUser = userOrId;
    if (!currentUser) {
      return getDefaultArtworks();
    }
    // 将用户的 portfolio 数据转换为作品格式
    return currentUser.portfolio.map((item, index) => ({
      id: item.id,
      title: item.title,
      image: item.thumb,
      category: item.category,
    }));
  }

  // 如果是ID，直接获取该用户的作品数据
  const userId = userOrId?.toString?.();
  if (!userId) {
    console.warn('[getArtworksByUser] No userId provided');
    return [];
  }

  // 尝试从 Supabase 获取用户档案和作品
  try {
    const profileResult = await getProfile(userId);
    if (profileResult.success && profileResult.data) {
      // 如果有档案，尝试获取作品数据
      // 这里应该调用作品服务，暂时返回空数组
      console.log(
        `[getArtworksByUser] Found profile for user: ${userId}, but portfolio service not implemented yet`
      );
      return [];
    }
  } catch (error) {
    console.log(
      `[getArtworksByUser] Error getting profile for user: ${userId}:`,
      error
    );
  }

  // 数字ID到字符串ID的映射
  const idMapping = {
    1: 'alex',
    2: 'alice',
    3: 'bryan',
  };

  // 尝试映射数字ID到字符串ID
  const mappedId = idMapping[userId] || userId;
  const user = MOCK_USERS[mappedId];

  if (!user) {
    console.log(
      '🔍 [getArtworksByUser] User not found for ID:',
      userId,
      'mapped to:',
      mappedId
    );
    return [];
  }

  console.log(
    '🔍 [getArtworksByUser] Found artworks for user:',
    user.name,
    'for ID:',
    userId,
    'mapped to:',
    mappedId
  );
  // 将用户的 portfolio 数据转换为作品格式
  return user.portfolio.map((item, index) => ({
    id: item.id,
    title: item.title,
    image: item.thumb,
    category: item.category,
  }));
};

/**
 * 获取默认作品数据
 * @returns {Array} 默认作品数据数组
 */
export const getDefaultArtworks = () => {
  return [
    {
      id: 1,
      title: 'Abstract Geometric Design',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Abstract',
    },
    {
      id: 2,
      title: 'Mountain Landscape',
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      category: 'Landscape',
    },
    {
      id: 3,
      title: 'Urban Street Scene',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      category: 'Photography',
    },
    {
      id: 4,
      title: 'Color Burst',
      image:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop',
      category: 'Abstract',
    },
    {
      id: 5,
      title: 'Sunset Mountains',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Landscape',
    },
    {
      id: 6,
      title: 'Teal Design',
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      category: 'Design',
    },
    {
      id: 7,
      title: 'Cute Character',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      category: 'Illustration',
    },
    {
      id: 8,
      title: 'Modern Building',
      image:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop',
      category: 'Architecture',
    },
    {
      id: 9,
      title: 'Watercolor Flowers',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Fine Art',
    },
  ];
};

/**
 * 获取合作项目数据
 * @param {string|number} userId - 用户ID（可选）
 * @returns {Array} 合作项目数据数组
 */
export const getCollaborationsData = async userId => {
  try {
    console.log(
      '[getCollaborationsData] Getting collaborations for userId:',
      userId
    );

    // 从 localStorage 获取真实的协作数据
    const stored = localStorage.getItem('mock_collaborations');
    if (!stored) {
      console.log('[getCollaborationsData] No collaborations found in storage');
      return [];
    }

    const collaborations = JSON.parse(stored);
    console.log(
      '[getCollaborationsData] Found collaborations:',
      collaborations.length
    );

    // 过滤出当前用户创建的协作项目（作为 initiator）
    const userCollaborations = collaborations.filter(
      collab => collab.author && collab.author.id === userId
    );

    console.log(
      '[getCollaborationsData] User collaborations:',
      userCollaborations.length
    );

    // 转换为艺术家档案页面需要的格式
    const formattedCollaborations = userCollaborations.map(collab => {
      // 计算日期范围（从创建时间到现在）
      const createdAt = new Date(collab.createdAt);
      const now = new Date();
      const monthsDiff = Math.floor(
        (now - createdAt) / (1000 * 60 * 60 * 24 * 30)
      );

      let dateRange;
      if (monthsDiff === 0) {
        dateRange = 'This month';
      } else if (monthsDiff === 1) {
        dateRange = 'Last month';
      } else {
        dateRange = `${monthsDiff} months ago`;
      }

      // 获取项目图片（如果有的话）
      let image = '';
      if (collab.heroImage) {
        // 如果是图片 key，需要转换为 URL
        if (collab.heroImage.startsWith('collaboration_')) {
          // 使用占位图片，实际项目中应该从 IndexedDB 获取
          image =
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
        } else {
          image = collab.heroImage;
        }
      } else {
        // 使用默认占位图片
        image =
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
      }

      return {
        id: collab.id,
        title: collab.title,
        description: collab.description,
        image: image,
        partner: 'Team Members', // 协作项目中的团队成员
        partnerAvatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        completionDate: `Created ${dateRange}`,
        category: collab.projectType || 'Collaboration',
        isInitiator: true, // 在艺术家档案中显示的都是用户创建的
        role: 'Project Owner • Initiator',
        dateRange: dateRange,
        responsibility: '', // 默认为空，鼓励用户填写
        teamFeedback: {
          feedbacker: 'Team',
          feedbackerRole: 'Collaborators',
          content:
            'This project is currently in progress. Team feedback will be available once the project is completed.',
        },
      };
    });

    console.log(
      '[getCollaborationsData] Formatted collaborations:',
      formattedCollaborations
    );
    return formattedCollaborations;
  } catch (error) {
    console.error(
      '[getCollaborationsData] Error getting collaborations:',
      error
    );
    return [];
  }
};

/**
 * 检查艺术家是否存在
 * @param {Object} artist - 艺术家对象
 * @returns {boolean} 是否存在
 */
export const isArtistExists = artist => {
  return artist && artist.id && artist.name;
};

/**
 * 获取角色标签样式
 * @param {boolean} isInitiator - 是否为发起者
 * @returns {string} CSS类名
 */
export const getRoleBadgeStyle = isInitiator => {
  const baseStyle = 'px-2 py-1 text-xs font-medium rounded-full';
  return isInitiator
    ? `${baseStyle} bg-purple-100 text-purple-800 border border-purple-200`
    : `${baseStyle} bg-blue-100 text-blue-700 border border-blue-200`;
};

/**
 * 获取关注按钮样式
 * @param {boolean} isFollowing - 是否已关注
 * @returns {string} CSS类名
 */
export const getFollowButtonStyle = isFollowing => {
  const baseStyle =
    'px-4 py-2 rounded-md font-medium transition-colors duration-200';

  // 如果狀態為 null（未加載），顯示加載狀態
  if (isFollowing === null) {
    return `${baseStyle} bg-gray-300 text-gray-500 cursor-not-allowed`;
  }

  return isFollowing
    ? `${baseStyle} bg-gray-200 text-gray-700 hover:bg-gray-300`
    : `${baseStyle} bg-blue-500 text-white hover:bg-blue-600`;
};

/**
 * 创建默认艺术家档案
 * @param {string} userId - 用户ID
 * @returns {Object} 默认档案数据
 */
const createDefaultProfile = userId => {
  return {
    id: userId,
    fullName: 'Artist',
    title: 'Artist',
    school: '',
    pronouns: '',
    majors: [],
    minors: [],
    skills: [],
    bio: '',
    socialLinks: {
      instagram: '',
      portfolio: '',
      discord: '',
      otherLinks: [],
    },
    avatar: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
