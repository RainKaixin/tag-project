// applicationService/supabase.js - Supabase 适配器 (预留)

/**
 * Supabase 申请数据适配器
 * 为未来迁移到 Supabase 预留接口
 * @todo 实现 Supabase 申请数据操作
 */
export const supabaseAdapter = {
  /**
   * 获取申请记录
   * @param {string} collaborationId - 协作项目ID
   * @returns {Promise<Object|null>} 申请记录数据
   */
  getApplicationsData: async collaborationId => {
    // TODO: 实现 Supabase 申请数据获取
    console.log(
      `[supabaseAdapter] getApplicationsData not implemented yet for collaboration ${collaborationId}`
    );
    return null;
  },

  /**
   * 保存申请记录
   * @param {string} collaborationId - 协作项目ID
   * @param {Object} applicationsData - 申请记录数据
   * @returns {Promise<Object>} 保存结果
   */
  saveApplicationsData: async (collaborationId, applicationsData) => {
    // TODO: 实现 Supabase 申请数据保存
    console.log(
      `[supabaseAdapter] saveApplicationsData not implemented yet for collaboration ${collaborationId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },

  /**
   * 添加申请记录
   * @param {string} collaborationId - 协作项目ID
   * @param {number} positionId - 职位ID
   * @param {Object} application - 申请记录
   * @returns {Promise<Object>} 添加结果
   */
  addApplication: async (collaborationId, positionId, application) => {
    // TODO: 实现 Supabase 申请添加
    console.log(
      `[supabaseAdapter] addApplication not implemented yet for position ${positionId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },

  /**
   * 更新申请状态
   * @param {string} collaborationId - 协作项目ID
   * @param {number} positionId - 职位ID
   * @param {string} userId - 用户ID
   * @param {string} status - 新状态 ('pending', 'approved', 'rejected')
   * @returns {Promise<Object>} 更新结果
   */
  updateApplicationStatus: async (
    collaborationId,
    positionId,
    userId,
    status
  ) => {
    // TODO: 实现 Supabase 申请状态更新
    console.log(
      `[supabaseAdapter] updateApplicationStatus not implemented yet for user ${userId} in position ${positionId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },

  /**
   * 移除申请记录
   * @param {string} collaborationId - 协作项目ID
   * @param {number} positionId - 职位ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 移除结果
   */
  removeApplication: async (collaborationId, positionId, userId) => {
    // TODO: 实现 Supabase 申请移除
    console.log(
      `[supabaseAdapter] removeApplication not implemented yet for user ${userId} in position ${positionId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },

  /**
   * 更新申请记录中的用户姓名
   * @param {string} userId - 用户ID
   * @param {string} newName - 新的用户姓名
   * @returns {Promise<Object>} 更新结果
   */
  updateApplicationUserName: async (userId, newName) => {
    // TODO: 实现 Supabase 申请用户姓名更新
    console.log(
      `[supabaseAdapter] updateApplicationUserName not implemented yet for user ${userId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },
};
