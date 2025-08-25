// artist-helpers v1: 艺术家档案工具函数集合

import { getProfile } from '../../../services/mock/userProfileService.js';
import { getCachedAvatar } from '../../../utils/avatarCache.js';
import avatarStorage from '../../../utils/avatarStorage.js';
import { getCurrentUser } from '../../../utils/currentUser.js';
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
export const selectArtistView = (profile, mockUser = null) => {
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
      following: 0, // 将在组件中通过useFollowCount更新
      followers: 0, // 将在组件中通过useFollowCount更新
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

    // 数字ID到字符串ID的映射
    const idMapping = {
      1: 'alex',
      2: 'alice',
      3: 'bryan',
    };

    // 尝试映射数字ID到字符串ID
    const mappedId = idMapping[userId] || userId;

    // 检查缓存
    const cacheKey = `artist_${mappedId}`;
    if (artistCache.has(cacheKey)) {
      console.log(`[getArtistById] Using cached data for: ${mappedId}`);
      return artistCache.get(cacheKey);
    }

    const mockUser = MOCK_USERS[mappedId];

    if (!mockUser) {
      console.warn(`[getArtistById] User not found for ID: ${userId}`);
      return null;
    }

    // 获取用户档案数据
    const profileResult = await getProfile(mappedId);
    const profile = profileResult.success ? profileResult.data : null;

    // 优先从 localStorage 获取最新的头像数据（与右上角头像使用相同数据源）
    let avatar = null;
    if (typeof window !== 'undefined') {
      try {
        // 首先尝试从 localStorage 获取头像（与 getCurrentUser 使用相同逻辑）
        const avatarData = window.localStorage.getItem(
          `tag.avatars.${mappedId}`
        );
        if (avatarData) {
          const parsedData = JSON.parse(avatarData);
          if (parsedData && parsedData.avatarUrl) {
            avatar = parsedData.avatarUrl;
            console.log(
              '[getArtistById] Using avatar from localStorage:',
              avatar?.substring(0, 50)
            );
          }
        }

        // 如果没有 localStorage 数据，尝试从 IndexedDB 获取
        if (!avatar) {
          const avatarUrl = await avatarStorage.getAvatarUrl(mappedId);
          if (avatarUrl) {
            avatar = avatarUrl;
            console.log(
              '[getArtistById] Using avatar from IndexedDB:',
              avatar?.substring(0, 50)
            );
          } else {
            console.log(
              '[getArtistById] No avatar found in IndexedDB for:',
              mappedId
            );
          }
        }

        // 如果仍然没有头像，尝试从 profile 数据获取（兼容性）
        if (!avatar && profile && profile.avatar) {
          avatar = profile.avatar;
          console.log(
            '[getArtistById] Using avatar from profile data:',
            avatar?.substring(0, 30)
          );
        }

        // 最后回退到 mockUser 的默认头像
        if (!avatar) {
          avatar = mockUser.avatar;
          console.log('[getArtistById] Using default mockUser avatar');
        }

        // 调试：记录浏览器信息
        console.log(
          '[getArtistById] Avatar resolution for Chrome compatibility:',
          {
            userId: mappedId,
            hasLocalStorageAvatar: !!window.localStorage.getItem(
              `tag.avatars.${mappedId}`
            ),
            hasIndexedDBAvatar: !!(await avatarStorage.getAvatarUrl(mappedId)),
            hasProfileAvatar: !!(profile && profile.avatar),
            hasMockUserAvatar: !!mockUser.avatar,
            finalAvatar: avatar ? 'found' : 'null',
            browser: navigator.userAgent,
          }
        );
      } catch (error) {
        console.warn('[getArtistById] Failed to read avatar data:', error);
        avatar = mockUser.avatar;
      }
    } else {
      avatar = mockUser.avatar;
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

    // 使用选择器转换数据
    const artistView = selectArtistView(profileWithAvatar, mockUser);

    if (!artistView) {
      console.warn(
        `[getArtistById] Failed to create artist view for ${userId}`
      );
      return null;
    }

    // 调试日志：检查 socialLinks 数据
    console.log('[getArtistById] Artist view socialLinks:', {
      userId: mappedId,
      profileSocialLinks: profileWithAvatar?.socialLinks,
      mockUserSocialLinks: mockUser?.socialLinks,
      finalSocialLinks: artistView.socialLinks,
    });

    // 缓存结果
    artistCache.set(cacheKey, artistView);
    console.log(`[getArtistById] Cached data for: ${mappedId}`);

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
        followers: 156,
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

  // 如果是ID，先检查是否是当前登录用户
  const userId = userOrId?.toString?.();
  const currentUser = getCurrentUser();

  // 如果请求的是当前登录用户的ID，直接返回当前用户的作品数据
  if (
    currentUser &&
    (userId === currentUser.id || userId === currentUser.id.toString())
  ) {
    if (!currentUser.portfolio) {
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
  // 目前返回固定的合作数据，未来可以根据userId过滤
  return [
    {
      id: 1,
      title: 'Animation Project with Jason K.',
      description:
        'Collaborated on character design and background illustrations for a short animated film project.',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      partner: 'Jason K.',
      partnerAvatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      completionDate: 'Completed May 2023',
      category: 'Animation',
      isInitiator: false,
      role: 'Character Designer',
      dateRange: 'March 2023 - May 2023',
      responsibility:
        'Responsible for visual design and facial animation of main characters, created complete design schemes for 5 core characters, and participated in unifying the background art style.',
      teamFeedback: {
        feedbacker: 'Jason K.',
        feedbackerRole: 'Project Director',
        content:
          'Alex demonstrated excellent creativity and technical skills in character design. His designs are not only beautiful but also serve the narrative well. He has a positive team collaboration attitude and is an important contributor to the project.',
      },
    },
    {
      id: 2,
      title: 'Brand Identity with Studio X',
      description:
        'Worked together on a complete brand identity system for a tech startup.',
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      partner: 'Studio X',
      partnerAvatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      completionDate: 'Completed March 2023',
      category: 'Branding',
      isInitiator: true,
      role: 'Project Owner',
      dateRange: 'January 2023 - March 2023',
      responsibility:
        'As project initiator, responsible for overall brand strategy development, leading the design team to complete the full visual identity system from logo design to brand guidelines.',
      teamFeedback: {
        feedbacker: 'Studio X Team',
        feedbackerRole: 'Creative Director',
        content:
          'Alex demonstrated excellent project leadership and design professionalism, accurately understanding client needs and transforming them into outstanding design solutions. The entire brand system received high recognition from clients.',
      },
    },
    {
      id: 3,
      title: 'UI Design with Mobile Team',
      description:
        'Collaborated on user interface design for a mobile application.',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      partner: 'Mobile Team',
      partnerAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      completionDate: 'Completed January 2023',
      category: 'UI/UX',
      isInitiator: false,
      role: 'UI Designer',
      dateRange: 'November 2022 - January 2023',
      responsibility:
        'Responsible for main interface design of mobile applications, including user flow optimization, component library establishment, and interactive prototype creation, ensuring excellent user experience.',
      teamFeedback: {
        feedbacker: 'Sarah Chen',
        feedbackerRole: 'Product Manager',
        content:
          "Alex's UI design is both beautiful and practical, balancing visual effects and functional requirements well. His design thinking and technical implementation capabilities left a deep impression on the team.",
      },
    },
  ];
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
    : `${baseStyle} bg-gray-100 text-gray-700`;
};

/**
 * 获取关注按钮样式
 * @param {boolean} isFollowing - 是否已关注
 * @returns {string} CSS类名
 */
export const getFollowButtonStyle = isFollowing => {
  const baseStyle =
    'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  return isFollowing
    ? `${baseStyle} bg-gray-200 text-gray-700 hover:bg-gray-300`
    : `${baseStyle} bg-blue-500 text-white hover:bg-blue-600`;
};
