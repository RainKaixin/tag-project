import { supabase } from './client.js';

/**
 * 用户数据服务
 * 提供用户资料管理、关注关系等功能
 */

// 获取用户资料
export const getUserProfile = async userId => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(
        `
        *,
        followers:follows!follows_following_id_fkey(count),
        following:follows!follows_follower_id_fkey(count),
        artworks:artworks(count)
      `
      )
      .eq('id', userId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
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
    const { data, error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
      })
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
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = 没有找到记录
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
      .select(
        `
        follower:users!follows_follower_id_fkey(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data.map(item => item.follower) };
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
      .select(
        `
        following:users!follows_following_id_fkey(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data.map(item => item.following) };
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
