import { notificationService } from '../notificationService/index.js';

import { supabase } from './client.js';

/**
 * 用户数据服务
 * 提供用户资料管理、关注关系等功能
 */

// 获取用户资料
export const getUserProfile = async userId => {
  try {
    // 从 profiles 表获取用户信息
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'User not found' };
    }

    // 获取关注统计
    const [followersResult, followingResult] = await Promise.all([
      supabase
        .from('follows')
        .select('id', { count: 'exact' })
        .eq('following_id', userId),
      supabase
        .from('follows')
        .select('id', { count: 'exact' })
        .eq('follower_id', userId),
    ]);

    const followersCount = followersResult.count || 0;
    const followingCount = followingResult.count || 0;

    // 构造用户资料对象
    const userProfile = {
      id: data.id,
      name: data.full_name || 'Unknown User',
      username: data.full_name || 'unknown',
      avatar_url: data.avatar_url || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      followers_count: followersCount,
      following_count: followingCount,
    };

    return { success: true, data: userProfile };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 更新用户资料
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取用户作品列表
export const getUserArtworks = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 12, category } = options;

    let query = supabase
      .from('artworks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取用户协作项目
export const getUserCollaborations = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 10, status } = options;

    let query = supabase
      .from('collaborations')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 关注用户
export const followUser = async (followerId, followingId) => {
  try {
    const { data, error } = await supabase.from('follows').insert({
      follower_id: followerId,
      following_id: followingId,
    });

    if (error) {
      // 检查是否是重复键错误（已经关注了）
      if (error.code === '23505') {
        console.log(`User ${followerId} already follows ${followingId}`);
        return { success: false, error: 'Already following this user' };
      } else {
        return { success: false, error: error.message };
      }
    }

    // 通知由数据库触发器自动创建，不需要前端手动创建
    console.log(
      '[SupabaseUsers] Follow successful - notification will be created by database trigger'
    );

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 取消关注用户
export const unfollowUser = async (followerId, followingId) => {
  try {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 检查是否关注
export const isFollowing = async (followerId, followingId) => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, isFollowing: !!data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取关注者列表
export const getFollowers = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20 } = options;

    const { data, error } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data.map(item => ({ id: item.follower_id })),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取关注列表
export const getFollowing = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20 } = options;

    const { data, error } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data.map(item => ({ id: item.following_id })),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 搜索用户
export const searchUsers = async (searchTerm, options = {}) => {
  try {
    const { page = 1, limit = 20 } = options;

    const { data, error } = await supabase
      .from('users')
      .select('id, name, avatar_url, role, bio')
      .ilike('name', `%${searchTerm}%`)
      .order('name')
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
