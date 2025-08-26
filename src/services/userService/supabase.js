// userService/supabase.js - Supabase 适配器 (预留)

/**
 * Supabase 用户数据适配器
 * 为未来迁移到 Supabase 预留接口
 * @todo 实现 Supabase 用户数据操作
 */
export const supabaseAdapter = {
  /**
   * 获取当前用户信息
   * @returns {Promise<Object|null>} 当前用户数据
   */
  getCurrentUser: async () => {
    // TODO: 实现 Supabase 用户获取
    console.log('[supabaseAdapter] getCurrentUser not implemented yet');
    return null;
  },

  /**
   * 根据用户ID获取用户信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Object|null>} 用户数据
   */
  getUserById: async userId => {
    // TODO: 实现 Supabase 用户获取
    console.log(
      `[supabaseAdapter] getUserById not implemented yet for ${userId}`
    );
    return null;
  },

  /**
   * 创建用户
   * @param {string} userId - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 创建结果
   */
  createUser: async (userId, userData) => {
    // TODO: 实现 Supabase 用户创建
    console.log(
      `[supabaseAdapter] createUser not implemented yet for ${userId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },

  /**
   * 更新用户信息
   * @param {string} userId - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 更新结果
   */
  updateUser: async (userId, userData) => {
    // TODO: 实现 Supabase 用户更新
    console.log(
      `[supabaseAdapter] updateUser not implemented yet for ${userId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },

  /**
   * 获取所有用户列表
   * @returns {Promise<Array>} 用户列表
   */
  getAllUsers: async () => {
    // TODO: 实现 Supabase 用户列表获取
    console.log('[supabaseAdapter] getAllUsers not implemented yet');
    return [];
  },

  /**
   * 删除用户
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteUser: async userId => {
    // TODO: 实现 Supabase 用户删除
    console.log(
      `[supabaseAdapter] deleteUser not implemented yet for ${userId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },
};
