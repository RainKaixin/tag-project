// artistService/supabase.js - Supabase 适配器 (预留)

/**
 * Supabase 艺术家数据适配器
 * 为未来迁移到 Supabase 预留接口
 * @todo 实现 Supabase 艺术家数据操作
 */
export const supabaseAdapter = {
  /**
   * 获取公开艺术家列表
   * @returns {Promise<Object>} 艺术家列表
   */
  getPublicArtists: async () => {
    // TODO: 实现 Supabase 艺术家列表获取
    console.log('[supabaseAdapter] getPublicArtists not implemented yet');
    return { success: false, data: [] };
  },

  /**
   * 获取艺术家详情
   * @param {string} artistId - 艺术家ID
   * @returns {Promise<Object>} 艺术家详情
   */
  getArtistProfile: async artistId => {
    // TODO: 实现 Supabase 艺术家详情获取
    console.log(
      `[supabaseAdapter] getArtistProfile not implemented yet for ${artistId}`
    );
    return { success: false, data: null };
  },

  /**
   * 创建艺术家
   * @param {string} artistId - 艺术家ID
   * @param {Object} artistData - 艺术家数据
   * @returns {Promise<Object>} 创建结果
   */
  createArtist: async (artistId, artistData) => {
    // TODO: 实现 Supabase 艺术家创建
    console.log(
      `[supabaseAdapter] createArtist not implemented yet for ${artistId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },

  /**
   * 更新艺术家信息
   * @param {string} artistId - 艺术家ID
   * @param {Object} artistData - 艺术家数据
   * @returns {Promise<Object>} 更新结果
   */
  updateArtist: async (artistId, artistData) => {
    // TODO: 实现 Supabase 艺术家更新
    console.log(
      `[supabaseAdapter] updateArtist not implemented yet for ${artistId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },

  /**
   * 删除艺术家
   * @param {string} artistId - 艺术家ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteArtist: async artistId => {
    // TODO: 实现 Supabase 艺术家删除
    console.log(
      `[supabaseAdapter] deleteArtist not implemented yet for ${artistId}`
    );
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },

  /**
   * 保存艺术家索引
   * @param {Array} artists - 艺术家数组
   * @returns {Promise<Object>} 保存结果
   */
  saveArtistIndex: async artists => {
    // TODO: 实现 Supabase 艺术家索引保存
    console.log(`[supabaseAdapter] saveArtistIndex not implemented yet`);
    return { success: false, error: 'Supabase adapter not implemented yet' };
  },
};
