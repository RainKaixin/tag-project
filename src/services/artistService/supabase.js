// artistService/supabase.js - Supabase 适配器

import { supabase } from '../supabase/client.js';

/**
 * Supabase 艺术家数据适配器
 * 提供基于 Supabase 的艺术家数据操作
 */
export const supabaseAdapter = {
  /**
   * 获取公开艺术家列表
   * @returns {Promise<Object>} 艺术家列表
   */
  getPublicArtists: async () => {
    try {
      console.log(
        '[supabaseAdapter] Getting all registered artists from Supabase'
      );

      // 从 profiles 表获取所有艺术家信息
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error(
          '[supabaseAdapter] Error fetching profiles:',
          profilesError
        );
        return { success: false, error: profilesError.message };
      }

      if (!profiles || profiles.length === 0) {
        console.log('[supabaseAdapter] No profiles found');
        return { success: true, data: [] };
      }

      // 获取所有用户ID
      const userIds = profiles.map(profile => profile.id);

      // 批量获取关注统计
      const [followersResult, followingResult, worksResult] = await Promise.all(
        [
          // 获取关注者统计
          supabase
            .from('follows')
            .select('following_id')
            .in('following_id', userIds),
          // 获取关注统计
          supabase
            .from('follows')
            .select('follower_id')
            .in('follower_id', userIds),
          // 获取作品统计
          supabase
            .from('portfolio')
            .select('user_id')
            .in('user_id', userIds)
            .eq('is_public', true),
        ]
      );

      // 构建统计映射
      const followersMap = new Map();
      const followingMap = new Map();
      const worksMap = new Map();

      // 统计关注者数量
      if (followersResult.data) {
        followersResult.data.forEach(follow => {
          const count = followersMap.get(follow.following_id) || 0;
          followersMap.set(follow.following_id, count + 1);
        });
      }

      // 统计关注数量
      if (followingResult.data) {
        followingResult.data.forEach(follow => {
          const count = followingMap.get(follow.follower_id) || 0;
          followingMap.set(follow.follower_id, count + 1);
        });
      }

      // 统计作品数量
      if (worksResult.data) {
        worksResult.data.forEach(work => {
          const count = worksMap.get(work.user_id) || 0;
          worksMap.set(work.user_id, count + 1);
        });
      }

      // 构建艺术家数据
      const artists = profiles.map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Unknown Artist',
        title: profile.title || 'Artist',
        school: profile.school || '',
        majors: profile.majors || [],
        minors: profile.minors || [],
        avatar: profile.avatar_url || null,
        worksCount: worksMap.get(profile.id) || 0,
        followers: followersMap.get(profile.id) || 0,
        following: followingMap.get(profile.id) || 0,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        // 为了兼容前端组件，添加 role 字段
        role: profile.title || 'Artist',
      }));

      console.log(
        `[supabaseAdapter] Found ${artists.length} registered artists`
      );

      return {
        success: true,
        data: artists,
      };
    } catch (error) {
      console.error('[supabaseAdapter] Error getting public artists:', error);
      return {
        success: false,
        error: error.message,
      };
    }
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
