import { supabase } from './client.js';

/**
 * 作品数据服务
 * 提供作品CRUD操作、搜索筛选、点赞收藏等功能
 */

// 获取作品列表
export const getArtworks = async (options = {}) => {
  try {
    const { page = 1, limit = 12, category, searchTerm, userId } = options;

    let query = supabase
      .from('artworks')
      .select(
        `
        *,
        user:users(
          id,
          name,
          avatar_url,
          role
        ),
        likes:artwork_likes(count),
        comments:comments(count)
      `
      )
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
      );
    }

    if (userId) {
      query = query.eq('user_id', userId);
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

// 获取单个作品详情
export const getArtwork = async artworkId => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(
        `
        *,
        user:users(
          id,
          name,
          avatar_url,
          role,
          bio
        ),
        likes:artwork_likes(count),
        comments:comments(
          id,
          content,
          created_at,
          user:users(
            id,
            name,
            avatar_url
          )
        )
      `
      )
      .eq('id', artworkId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 创建新作品
export const createArtwork = async artworkData => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .insert(artworkData)
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

// 更新作品
export const updateArtwork = async (artworkId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .update(updateData)
      .eq('id', artworkId)
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

// 删除作品
export const deleteArtwork = async artworkId => {
  try {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', artworkId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 点赞作品
export const likeArtwork = async (artworkId, userId) => {
  try {
    const { data, error } = await supabase
      .from('artwork_likes')
      .insert({
        artwork_id: artworkId,
        user_id: userId,
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

// 取消点赞
export const unlikeArtwork = async (artworkId, userId) => {
  try {
    const { error } = await supabase
      .from('artwork_likes')
      .delete()
      .eq('artwork_id', artworkId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 检查是否已点赞
export const isLiked = async (artworkId, userId) => {
  try {
    const { data, error } = await supabase
      .from('artwork_likes')
      .select('id')
      .eq('artwork_id', artworkId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { success: false, error: error.message };
    }

    return { success: true, isLiked: !!data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 收藏作品
export const bookmarkArtwork = async (artworkId, userId) => {
  try {
    const { data, error } = await supabase
      .from('artwork_bookmarks')
      .insert({
        artwork_id: artworkId,
        user_id: userId,
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

// 取消收藏
export const unbookmarkArtwork = async (artworkId, userId) => {
  try {
    const { error } = await supabase
      .from('artwork_bookmarks')
      .delete()
      .eq('artwork_id', artworkId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 检查是否已收藏
export const isBookmarked = async (artworkId, userId) => {
  try {
    const { data, error } = await supabase
      .from('artwork_bookmarks')
      .select('id')
      .eq('artwork_id', artworkId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { success: false, error: error.message };
    }

    return { success: true, isBookmarked: !!data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取用户收藏的作品
export const getUserBookmarks = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 12 } = options;

    const { data, error } = await supabase
      .from('artwork_bookmarks')
      .select(
        `
        artwork:artworks(
          *,
          user:users(
            id,
            name,
            avatar_url,
            role
          )
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data.map(item => item.artwork) };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 记录作品浏览并返回最新浏览量
export const recordArtworkView = async (artworkId, options = {}) => {
  try {
    const {
      userId = null,
      visitorFingerprint = null,
      ipAddress = null,
      userAgent = null,
    } = options;

    // 调用数据库函数记录浏览
    const { data, error } = await supabase.rpc('increment_artwork_views', {
      p_artwork_id: artworkId,
      p_user_id: userId,
      p_visitor_fingerprint: visitorFingerprint,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    });

    if (error) {
      console.error('Failed to record artwork view:', error);
      return { success: false, error: error.message };
    }

    // 返回结果 - 處理數組或單個對象
    if (data) {
      const result = Array.isArray(data) ? data[0] : data;
      return {
        success: result.success,
        viewCount: result.view_count || result.count,
        error: result.error_message,
      };
    }

    return { success: false, error: 'No data returned from database function' };
  } catch (error) {
    console.error('Error recording artwork view:', error);
    return { success: false, error: error.message };
  }
};

// 获取作品浏览量
export const getArtworkViewCount = async artworkId => {
  try {
    const { data, error } = await supabase.rpc('get_artwork_view_count', {
      p_artwork_id: artworkId,
    });

    if (error) {
      console.error('Failed to get artwork view count:', error);
      return { success: false, error: error.message };
    }

    // 處理數據結構：data可能是數字或對象
    const viewCount =
      typeof data === 'object' && data !== null ? data.count : data;
    return { success: true, viewCount: viewCount || 0 };
  } catch (error) {
    console.error('Error getting artwork view count:', error);
    return { success: false, error: error.message };
  }
};

// 检查用户是否已浏览过作品
export const hasUserViewedArtwork = async (artworkId, options = {}) => {
  try {
    const { userId = null, visitorFingerprint = null } = options;

    const { data, error } = await supabase.rpc('has_user_viewed_artwork', {
      p_artwork_id: artworkId,
      p_user_id: userId,
      p_visitor_fingerprint: visitorFingerprint,
    });

    if (error) {
      console.error('Failed to check if user viewed artwork:', error);
      return { success: false, error: error.message };
    }

    return { success: true, hasViewed: data || false };
  } catch (error) {
    console.error('Error checking if user viewed artwork:', error);
    return { success: false, error: error.message };
  }
};

// 搜索作品
export const searchArtworks = async (searchTerm, options = {}) => {
  try {
    const { page = 1, limit = 12, category } = options;

    let query = supabase
      .from('artworks')
      .select(
        `
        *,
        user:users(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
      )
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
