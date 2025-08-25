import { supabase } from './client.js';

/**
 * 评论数据服务
 * 提供评论CRUD操作、回复功能、点赞等功能
 */

// 获取评论列表
export const getComments = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      targetType,
      targetId,
      parentId = null,
      orderBy = 'created_at',
      orderDirection = 'desc',
    } = options;

    let query = supabase
      .from('comments')
      .select(
        `
        *,
        user:users(
          id,
          name,
          avatar_url,
          role
        ),
        likes:comment_likes(count),
        replies:comments(count)
      `
      )
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    if (targetType) {
      query = query.eq('target_type', targetType);
    }

    if (targetId) {
      query = query.eq('target_id', targetId);
    }

    if (parentId === null) {
      query = query.is('parent_id', null);
    } else if (parentId !== undefined) {
      query = query.eq('parent_id', parentId);
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

// 获取单个评论详情
export const getComment = async commentId => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        *,
        user:users(
          id,
          name,
          avatar_url,
          role
        ),
        likes:comment_likes(count),
        replies:comments(
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
      .eq('id', commentId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 创建评论
export const createComment = async commentData => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
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
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 更新评论
export const updateComment = async (commentId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .update(updateData)
      .eq('id', commentId)
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
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 删除评论
export const deleteComment = async commentId => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 点赞评论
export const likeComment = async (commentId, userId) => {
  try {
    const { data, error } = await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
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

// 取消点赞评论
export const unlikeComment = async (commentId, userId) => {
  try {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 检查是否已点赞评论
export const isCommentLiked = async (commentId, userId) => {
  try {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
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

// 获取评论回复
export const getCommentReplies = async (commentId, options = {}) => {
  try {
    const { page = 1, limit = 10 } = options;

    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        *,
        user:users(
          id,
          name,
          avatar_url,
          role
        ),
        likes:comment_likes(count)
      `
      )
      .eq('parent_id', commentId)
      .order('created_at', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 回复评论
export const replyToComment = async (parentId, replyData) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        ...replyData,
        parent_id: parentId,
      })
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
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取用户评论
export const getUserComments = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, targetType } = options;

    let query = supabase
      .from('comments')
      .select(
        `
        *,
        user:users(
          id,
          name,
          avatar_url,
          role
        ),
        likes:comment_likes(count)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (targetType) {
      query = query.eq('target_type', targetType);
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

// 获取目标对象的评论统计
export const getCommentStats = async (targetType, targetId) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('id')
      .eq('target_type', targetType)
      .eq('target_id', targetId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, count: data.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 搜索评论
export const searchComments = async (searchTerm, options = {}) => {
  try {
    const { page = 1, limit = 20, targetType } = options;

    let query = supabase
      .from('comments')
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
      .ilike('content', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (targetType) {
      query = query.eq('target_type', targetType);
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
