import { storage } from '../services/storage/index';

import { getCachedAvatar, cacheAvatar } from './avatarCache.js';
import { isMock } from './envCheck.js';
import { getUserInfo } from './mockUsers.js';

const KEY = 'tag.currentUserId';

async function read() {
  try {
    if (typeof window === 'undefined') return null;
    return await storage.getItem(KEY);
  } catch {
    return null;
  }
}
async function write(v) {
  try {
    if (typeof window === 'undefined') return;
    await storage.setItem(KEY, v);
  } catch (error) {
    console.warn('Failed to write current user ID:', error);
  }
}
async function remove() {
  try {
    if (typeof window === 'undefined') return;
    await storage.removeItem(KEY);
  } catch (error) {
    console.warn('Failed to remove current user ID:', error);
  }
}

export const getCurrentUserId = async () => {
  // 同步版本，用于兼容现有代码
  try {
    if (typeof window === 'undefined') return null;

    // 检查新的统一键名
    let stored = window.localStorage.getItem(KEY);

    // 如果新键名没有值，检查旧键名并迁移
    if (!stored) {
      const oldKeys = [
        'tag_current_user_id',
        'currentUserId',
        'user_id',
        'tag.userId',
      ];

      for (const oldKey of oldKeys) {
        const oldValue = window.localStorage.getItem(oldKey);
        if (oldValue) {
          console.log(
            `[currentUser] Migrating from old key: ${oldKey} = ${oldValue}`
          );
          stored = oldValue;
          // 迁移到新键名
          window.localStorage.setItem(KEY, oldValue);
          // 删除旧键名
          window.localStorage.removeItem(oldKey);
          break;
        }
      }
    }

    // 如果仍然没有值，尝试从Supabase auth session获取
    if (!stored && typeof window !== 'undefined') {
      try {
        // 检查是否有全局的supabase实例
        if (window.supabase) {
          try {
            // 尝试从当前session获取用户ID
            const {
              data: { session },
            } = window.supabase.auth.getSession();
            if (session?.user?.id) {
              console.log(
                '[currentUser] Got user ID from global Supabase session:',
                session.user.id
              );
              stored = session.user.id;
              // 保存到localStorage
              window.localStorage.setItem(KEY, stored);
            }
          } catch (error) {
            console.warn(
              '[currentUser] Failed to get Supabase session:',
              error
            );
          }
        }

        // 如果没有全局实例，尝试从导入的supabase客户端获取
        if (!stored) {
          try {
            // 动态导入supabase客户端
            const { supabase } = await import('../services/supabase/client.js');
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (session?.user?.id) {
              console.log(
                '[currentUser] Got user ID from imported Supabase client:',
                session.user.id
              );
              stored = session.user.id;
              // 保存到localStorage
              window.localStorage.setItem(KEY, stored);
            }
          } catch (error) {
            console.warn(
              '[currentUser] Failed to get Supabase session from imported client:',
              error
            );
          }
        }
      } catch (error) {
        console.warn(
          '[currentUser] Failed to get global Supabase session:',
          error
        );
      }
    }

    // 如果仍然没有值，返回 null
    if (!stored) {
      console.log('[currentUser] No user ID found, returning null');
    }

    return stored;
  } catch (error) {
    console.warn('Failed to get current user ID:', error);
    return null;
  }
};

// 获取当前艺术家ID，不再回落到默认用户
export const getCurrentArtistId = session => {
  return session?.user?.id ?? null;
};

export const getCurrentUser = async () => {
  // 优先级1: 从 AuthContext 获取用户（同步）
  if (typeof window !== 'undefined' && window.__authContextUser) {
    console.log('[getCurrentUser] Using AuthContext user');
    return window.__authContextUser;
  }

  // 优先级2: 从 Supabase 获取当前用户
  try {
    const { supabase } = await import('../services/supabase/client.js');
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.warn('[getCurrentUser] Supabase auth error:', error.message);
    } else if (supabaseUser) {
      console.log('[getCurrentUser] Using Supabase user');
      return {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name:
          supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
        avatar: supabaseUser.user_metadata?.avatar_url,
        role: 'artist',
        isVerified: supabaseUser.email_confirmed_at ? true : false,
      };
    }
  } catch (error) {
    console.warn('[getCurrentUser] Failed to get Supabase user:', error);
  }

  // 优先级3: 回退到 localStorage（兼容性）
  const userId = await getCurrentUserId();
  if (!userId) {
    console.log('[getCurrentUser] No userId found, returning null');
    return null;
  }

  const user = getUserInfo(userId);
  if (!user) {
    console.log(
      `[getCurrentUser] No user info found for userId: ${userId}, returning null`
    );
    return null;
  }

  // 优先从 localStorage 获取最新的头像数据
  if (typeof window !== 'undefined') {
    try {
      const avatarData = window.localStorage.getItem(`tag.avatars.${userId}`);
      if (avatarData) {
        const parsedData = JSON.parse(avatarData);
        if (parsedData && parsedData.avatarUrl) {
          return {
            ...user,
            avatar: parsedData.avatarUrl,
          };
        }
      }
    } catch (error) {
      console.warn('[getCurrentUser] Failed to read avatar data:', error);
    }
  }

  // 回退到缓存的头像
  const cachedAvatar = getCachedAvatar(userId);
  if (cachedAvatar) {
    return {
      ...user,
      avatar: cachedAvatar,
    };
  }

  // 缓存默认头像
  if (user.avatar) {
    cacheAvatar(userId, user.avatar);
  }

  return user;
};

export const setCurrentUserId = async userId => {
  await write(userId);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('user:changed', { detail: { userId } })
    );
  }
};

export const clearCurrentUserId = () => {
  remove();
};

export const getCurrentUserAvatar = async () => {
  try {
    // 優先使用統一的頭像服務
    const { getUnifiedAvatar } = await import('../services/avatarService.js');
    const userId = await getCurrentUserId();

    if (userId) {
      const avatarUrl = await getUnifiedAvatar(userId);
      if (avatarUrl) {
        console.log(
          `[getCurrentUserAvatar] Got avatar from unified service: ${userId}`
        );
        return avatarUrl;
      }
    }

    // 回退到原有邏輯
    const user = await getCurrentUser();
    return user?.avatar || null;
  } catch (error) {
    console.warn('[getCurrentUserAvatar] Error getting unified avatar:', error);
    // 回退到原有邏輯
    const user = await getCurrentUser();
    return user?.avatar || null;
  }
};

/**
 * 获取默认头像URL
 * @returns {string} 默认头像的 Data URL
 */
const getDefaultAvatarUrl = () => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIzMiIgeT0iMjQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOEM5Q0E2Ij4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+';
};

// 异步获取当前用户ID，优先从Supabase auth session获取
export const getCurrentUserIdAsync = async () => {
  try {
    // 优先从 Supabase auth session 获取
    if (typeof window !== 'undefined') {
      try {
        // 动态导入supabase客户端
        const { supabase } = await import('../services/supabase/client.js');
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user?.id) {
          console.log(
            '[currentUser] Got user ID from Supabase session:',
            session.user.id
          );
          // 同时保存到localStorage作为缓存
          await setCurrentUserId(session.user.id);
          return session.user.id;
        }
      } catch (error) {
        console.warn('[currentUser] Failed to get Supabase session:', error);
      }
    }

    // 回退到同步版本
    return getCurrentUserId();
  } catch (error) {
    console.warn('Failed to get current user ID async:', error);
    return null;
  }
};
