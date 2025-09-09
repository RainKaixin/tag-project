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
    // 先尝试删除可能存在的记录（避免重复）
    const { error: deleteError } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    // 删除操作失败不影响后续插入（记录可能不存在）
    if (deleteError) {
      console.warn(
        '[followUser] Delete warning (record may not exist):',
        deleteError
      );
    }

    // 然后插入新记录
    const { data, error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
      })
      .select()
      .single();

    if (error) throw error;

    console.log('[followUser] Successfully followed user:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[followUser] Error:', error);
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

    if (error) throw error;

    console.log('[unfollowUser] Successfully unfollowed');
    return { success: true };
  } catch (error) {
    console.error('[unfollowUser] Error:', error);
    return { success: false, error: error.message };
  }
};

// 清理關注狀態 - 檢查數據一致性
export const cleanupFollowStatus = async (followerId, followingId) => {
  try {
    // 先检查是否真的有记录
    const { data } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (!data) {
      console.log('[cleanupFollowStatus] No follow record exists');
      return { success: true, exists: false };
    }

    return { success: true, exists: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 检查是否关注
export const isFollowing = async (followerId, followingId) => {
  try {
    console.log(
      `[isFollowing] Checking follow status: ${followerId} -> ${followingId}`
    );

    // 使用簡單直接的查詢方式
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) {
      console.error(`[isFollowing] Query error:`, error);
      return { success: false, error: error.message };
    }

    const isFollowingResult = !!data;
    console.log(`[isFollowing] Query result:`, {
      data,
      isFollowing: isFollowingResult,
    });

    return {
      success: true,
      isFollowing: isFollowingResult, // 確保返回布爾值
    };
  } catch (error) {
    console.error(`[isFollowing] Exception:`, error);
    return { success: false, error: error.message };
  }
};

// 获取关注者列表
export const getFollowers = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20 } = options;

    console.log(`[getFollowers] Getting followers for user: ${userId}`);

    // 使用 count 查詢來獲取關注者數量，避免 RLS 策略限制
    const { count, error: countError } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);

    if (countError) {
      console.error(`[getFollowers] Count query error:`, countError);
      return { success: false, error: countError.message };
    }

    console.log(`[getFollowers] Found ${count} followers for user ${userId}`);

    // 如果需要詳細列表，再查詢具體數據
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error(`[getFollowers] Data query error:`, error);
      // 即使詳細查詢失敗，也返回 count 結果
      return {
        success: true,
        data: Array(count)
          .fill(null)
          .map((_, index) => ({ id: `follower_${index}` })),
        count: count,
      };
    }

    return {
      success: true,
      data: data.map(item => ({ id: item.follower_id })),
      count: count,
    };
  } catch (error) {
    console.error(`[getFollowers] Exception:`, error);
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
