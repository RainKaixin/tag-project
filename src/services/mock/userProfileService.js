// user-profile-service v2: 统一数据源 + 事件系统
// 单一数据源，统一事件广播，规范化数据

import avatarStorage from '../../utils/avatarStorage';

const KEY_PREFIX = 'tag.userProfile.';
const storageKey = userId => `${KEY_PREFIX}${userId}`;

// 数据模型
/**
 * @typedef {Object} Profile
 * @property {string} id - 用户ID
 * @property {string} fullName - 全名（必填）
 * @property {string} [title] - 职称
 * @property {string} [school] - 学校
 * @property {string} [pronouns] - 代词
 * @property {string[]} [majors] - 专业（最多3个，去重去空）
 * @property {string[]} [minors] - 副修（最多3个，去重去空）
 * @property {string[]} [skills] - 技能（最多12个，去重去空）
 * @property {string} [bio] - 个人简介/关于
 * @property {string} updatedAt - 更新时间（ISO格式）
 */

// 规范化数组字段：去重、去空、截断为3个
function normalizeArrayField(array, maxLength = 3) {
  if (!Array.isArray(array)) return [];

  return array
    .filter(item => item && item.trim()) // 去空
    .map(item => item.trim()) // 去空格
    .filter((item, index, arr) => arr.indexOf(item) === index) // 去重
    .slice(0, maxLength); // 截断
}

// 规范化 Profile 数据
function normalizeProfile(profile) {
  return {
    id: profile.id || '',
    fullName: (profile.fullName || '').trim(),
    title: (profile.title || '').trim(),
    school: (profile.school || '').trim(),
    pronouns: (profile.pronouns || '').trim(),
    majors: normalizeArrayField(profile.majors, 3),
    minors: normalizeArrayField(profile.minors, 3),
    skills: normalizeArrayField(profile.skills, 12),
    bio: (profile.bio || '').trim(),
    avatar: profile.avatar || null, // 添加头像字段
    socialLinks: {
      instagram: (profile.socialLinks?.instagram || '').trim(),
      portfolio: (profile.socialLinks?.portfolio || '').trim(),
      discord: (profile.socialLinks?.discord || '').trim(),
      otherLinks: Array.isArray(profile.socialLinks?.otherLinks)
        ? profile.socialLinks.otherLinks.filter(
            link => link && link.label && link.url
          )
        : [],
    },
    updatedAt: profile.updatedAt || new Date().toISOString(),
  };
}

// 获取默认 Profile
function getDefaultProfile(userId) {
  // 为Mock用户（alice, bryan等）返回空白档案，而不是测试数据
  return {
    id: userId,
    fullName: '',
    title: 'Artist',
    school: '',
    pronouns: '',
    majors: [],
    minors: [],
    skills: [],
    bio: '',
    avatar: null, // 添加头像字段
    socialLinks: {
      instagram: '',
      portfolio: '',
      discord: '',
      otherLinks: [],
    },
    updatedAt: new Date().toISOString(),
  };
}

// 读取用户档案数据
function readUserProfileData(userId) {
  try {
    if (typeof window === 'undefined') return null;
    const data = window.localStorage.getItem(storageKey(userId));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Failed to read user profile data:', error);
    return null;
  }
}

// 写入用户档案数据
function writeUserProfileData(userId, data) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey(userId), JSON.stringify(data));
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Failed to write user profile data:', error);
    return false;
  }
}

// 广播 profile:updated 事件
function broadcastProfileUpdated(profile) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('profile:updated', {
        detail: profile,
      })
    );
  }
}

// 验证 Profile 数据
function validateProfile(profile) {
  const errors = {};

  if (!profile.fullName || !profile.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// 获取用户档案（读）
export const getProfile = async userId => {
  try {
    // Phase 2.1: 优先尝试Supabase，失败时回退到Mock API
    try {
      const { getProfile: supabaseGetProfile, checkSupabaseConnection } =
        await import('../supabase/userProfileService.js');

      // 检查Supabase连接
      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        console.log(
          '[userProfileService] Attempting to get profile from Supabase...'
        );
        const supabaseResult = await supabaseGetProfile(userId);

        if (supabaseResult.success) {
          console.log(
            '[userProfileService] Successfully retrieved profile from Supabase'
          );

          // 尝试从头像存储中读取头像数据（保持现有逻辑）
          try {
            const avatarData = window.localStorage.getItem(
              `tag.avatars.${userId}`
            );
            if (avatarData) {
              const parsedAvatarData = JSON.parse(avatarData);
              if (parsedAvatarData && parsedAvatarData.avatarUrl) {
                supabaseResult.data.avatar = parsedAvatarData.avatarUrl;
                console.log(
                  '[userProfileService] Loaded avatar from tag.avatars storage'
                );
              }
            }
          } catch (error) {
            console.warn(
              '[userProfileService] Failed to load avatar from tag.avatars storage:',
              error
            );
          }

          return supabaseResult;
        }
      }
    } catch (supabaseError) {
      console.warn(
        '[userProfileService] Supabase fallback failed, using Mock API:',
        supabaseError.message
      );
    }

    // 回退到Mock API（原有逻辑）
    console.log('[userProfileService] Using Mock API fallback');
    const existingData = readUserProfileData(userId);
    const defaultProfile = getDefaultProfile(userId);

    if (!existingData) {
      // 如果没有数据，返回默认值
      return {
        success: true,
        data: defaultProfile,
      };
    }

    // 合并现有数据和默认值，确保字段完整
    const mergedProfile = {
      ...defaultProfile,
      ...existingData,
      // 确保 socialLinks 结构完整
      socialLinks: {
        ...defaultProfile.socialLinks,
        ...(existingData.socialLinks || {}),
      },
    };

    // 尝试从头像存储中读取头像数据
    try {
      const avatarData = window.localStorage.getItem(`tag.avatars.${userId}`);
      if (avatarData) {
        const parsedAvatarData = JSON.parse(avatarData);
        if (parsedAvatarData && parsedAvatarData.avatarUrl) {
          mergedProfile.avatar = parsedAvatarData.avatarUrl;
          console.log(
            '[userProfileService] Loaded avatar from tag.avatars storage'
          );
        }
      }
    } catch (error) {
      console.warn(
        '[userProfileService] Failed to load avatar from tag.avatars storage:',
        error
      );
    }

    const normalizedProfile = normalizeProfile(mergedProfile);

    console.log('[userProfileService] Loading profile data from Mock API:', {
      userId,
      socialLinks: normalizedProfile.socialLinks,
      fullProfile: normalizedProfile,
    });

    return {
      success: true,
      data: normalizedProfile,
    };
  } catch (error) {
    console.error('Failed to get profile:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 保存用户档案（写）
export const saveProfile = async (userId, patch) => {
  try {
    // 获取现有数据
    const existingResult = await getProfile(userId);
    if (!existingResult.success) {
      return existingResult;
    }

    const existingProfile = existingResult.data;

    // 合并数据
    const mergedProfile = {
      ...existingProfile,
      ...patch,
      // 确保 socialLinks 正确合并
      socialLinks: {
        ...existingProfile.socialLinks,
        ...(patch.socialLinks || {}),
      },
      id: userId, // 确保 ID 正确
      updatedAt: new Date().toISOString(), // 更新时间
    };

    // 规范化数据
    const normalizedProfile = normalizeProfile(mergedProfile);

    // 验证数据
    const validation = validateProfile(normalizedProfile);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // Phase 2.1: 优先尝试保存到Supabase，失败时回退到Mock API
    try {
      const { saveProfile: supabaseSaveProfile, checkSupabaseConnection } =
        await import('../supabase/userProfileService.js');

      // 检查Supabase连接
      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        console.log(
          '[userProfileService] Attempting to save profile to Supabase...'
        );
        const supabaseResult = await supabaseSaveProfile(
          userId,
          normalizedProfile
        );

        if (supabaseResult.success) {
          console.log(
            '[userProfileService] Successfully saved profile to Supabase'
          );

          // 同时保存到Mock API作为备份
          const writeSuccess = writeUserProfileData(userId, normalizedProfile);
          if (!writeSuccess) {
            console.warn('[userProfileService] Failed to backup to Mock API');
          }

          // 处理头像存储和事件广播（保持现有逻辑）
          await handleAvatarStorageAndEvents(userId, normalizedProfile);

          return supabaseResult;
        }
      }
    } catch (supabaseError) {
      console.warn(
        '[userProfileService] Supabase save failed, using Mock API:',
        supabaseError.message
      );
    }

    // 回退到Mock API（原有逻辑）
    console.log('[userProfileService] Using Mock API fallback for save');

    // 写入持久化存储
    console.log('[userProfileService] Saving profile data to Mock API:', {
      userId,
      socialLinks: normalizedProfile.socialLinks,
      fullProfile: normalizedProfile,
    });

    const writeSuccess = writeUserProfileData(userId, normalizedProfile);
    if (!writeSuccess) {
      return {
        success: false,
        error: 'Failed to save profile data',
      };
    }

    console.log(
      '[userProfileService] Profile data saved successfully to Mock API'
    );

    // 处理头像存储和事件广播
    await handleAvatarStorageAndEvents(userId, normalizedProfile);

    return {
      success: true,
      data: normalizedProfile,
    };
  } catch (error) {
    console.error('Failed to save profile:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 订阅 profile:updated 事件
export const subscribeProfileUpdated = callback => {
  if (typeof window === 'undefined') {
    return () => {}; // 服务端渲染时返回空函数
  }

  const handleEvent = event => {
    callback(event.detail);
  };

  window.addEventListener('profile:updated', handleEvent);

  // 返回解绑函数
  return () => {
    window.removeEventListener('profile:updated', handleEvent);
  };
};

// 兼容性：保留旧的 getUserProfile 函数
export const getUserProfile = async userId => {
  const result = await getProfile(userId);
  if (result.success) {
    // 转换为旧格式
    return {
      success: true,
      data: {
        fullName: result.data.fullName,
        title: result.data.title,
        school: result.data.school,
        pronouns: result.data.pronouns,
        majors: result.data.majors,
        bio: '', // 旧字段，暂时保留
        socialLinks: {
          instagram: '',
          portfolio: '',
          discord: '',
          otherLinks: [],
        },
        skills: [],
      },
    };
  }
  return result;
};

// 兼容性：保留旧的 updateUserProfile 函数
export const updateUserProfile = async (userId, profileData) => {
  // 转换为新格式
  const patch = {
    fullName: profileData.fullName || '',
    title: profileData.title || '',
    school: profileData.school || '',
    pronouns: profileData.pronouns || '',
    majors: profileData.majors || [],
    minors: profileData.minors || [],
  };

  return await saveProfile(userId, patch);
};

// 处理头像存储和事件广播的辅助函数
const handleAvatarStorageAndEvents = async (userId, normalizedProfile) => {
  // 如果有头像数据，使用 IndexedDB 和 localStorage 存储
  if (normalizedProfile.avatar) {
    try {
      // 使用新的头像存储系统存储到 IndexedDB
      const result = await avatarStorage.storeAvatar(
        userId,
        normalizedProfile.avatar
      );
      if (result.success) {
        console.log(
          `[userProfileService] Avatar stored in IndexedDB for user: ${userId}`
        );
      } else {
        console.warn(
          `[userProfileService] Failed to store avatar in IndexedDB for user: ${userId}`
        );
      }

      // 同时存储到 localStorage，确保右上角头像能正确显示
      const avatarData = {
        avatarUrl: normalizedProfile.avatar,
        timestamp: Date.now(),
      };
      localStorage.setItem(`tag.avatars.${userId}`, JSON.stringify(avatarData));
      console.log(
        `[userProfileService] Avatar stored in localStorage for user: ${userId}`
      );
    } catch (error) {
      console.error(`[userProfileService] Error storing avatar: ${error}`);
    }
  }

  // 广播事件
  broadcastProfileUpdated(normalizedProfile);
};
