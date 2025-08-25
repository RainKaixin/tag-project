import { supabase } from './client.js';

/**
 * 协作数据服务
 * 提供协作项目管理、申请审批、里程碑管理等功能
 */

// 获取协作项目列表
export const getCollaborations = async (options = {}) => {
  try {
    const { page = 1, limit = 12, status, category, searchTerm } = options;

    let query = supabase
      .from('collaborations')
      .select(
        `
        *,
        creator:users(
          id,
          name,
          avatar_url,
          role
        ),
        applications:collaboration_applications(count),
        milestones:milestones(count)
      `
      )
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
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

// 获取单个协作项目详情
export const getCollaboration = async collaborationId => {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .select(
        `
        *,
        creator:users(
          id,
          name,
          avatar_url,
          role,
          bio
        ),
        applications:collaboration_applications(
          id,
          status,
          message,
          created_at,
          user:users(
            id,
            name,
            avatar_url,
            role
          )
        ),
        milestones:milestones(
          id,
          title,
          description,
          status,
          due_date,
          created_at
        )
      `
      )
      .eq('id', collaborationId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 创建协作项目
export const createCollaboration = async collaborationData => {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .insert(collaborationData)
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

// 更新协作项目
export const updateCollaboration = async (collaborationId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .update(updateData)
      .eq('id', collaborationId)
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

// 删除协作项目
export const deleteCollaboration = async collaborationId => {
  try {
    const { error } = await supabase
      .from('collaborations')
      .delete()
      .eq('id', collaborationId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 申请加入协作项目
export const applyToCollaboration = async (
  collaborationId,
  userId,
  applicationData
) => {
  try {
    const { data, error } = await supabase
      .from('collaboration_applications')
      .insert({
        collaboration_id: collaborationId,
        user_id: userId,
        ...applicationData,
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

// 审批申请
export const approveApplication = async (applicationId, status) => {
  try {
    const { data, error } = await supabase
      .from('collaboration_applications')
      .update({ status })
      .eq('id', applicationId)
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

// 获取用户申请状态
export const getUserApplicationStatus = async (collaborationId, userId) => {
  try {
    const { data, error } = await supabase
      .from('collaboration_applications')
      .select('*')
      .eq('collaboration_id', collaborationId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 创建里程碑
export const createMilestone = async milestoneData => {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .insert(milestoneData)
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

// 更新里程碑
export const updateMilestone = async (milestoneId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .update(updateData)
      .eq('id', milestoneId)
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

// 删除里程碑
export const deleteMilestone = async milestoneId => {
  try {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', milestoneId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取项目里程碑
export const getProjectMilestones = async collaborationId => {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('collaboration_id', collaborationId)
      .order('due_date', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 搜索协作项目
export const searchCollaborations = async (searchTerm, options = {}) => {
  try {
    const { page = 1, limit = 12, category } = options;

    let query = supabase
      .from('collaborations')
      .select(
        `
        *,
        creator:users(
          id,
          name,
          avatar_url,
          role
        )
      `
      )
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
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

// 获取用户参与的协作项目
export const getUserCollaborations = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 12, role = 'all' } = options;

    let query = supabase
      .from('collaborations')
      .select(
        `
        *,
        creator:users(
          id,
          name,
          avatar_url,
          role
        ),
        applications:collaboration_applications(
          id,
          status,
          user_id
        )
      `
      )
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (role === 'creator') {
      query = query.eq('creator_id', userId);
    } else if (role === 'member') {
      query = query.eq('applications.user_id', userId);
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
