// tag-service-supabase v1: Supabase標籤服務實現

import { supabase } from '../supabase/client';

/**
 * 獲取標籤統計信息
 * @param {string} slug - 標籤slug
 * @returns {Promise<Object>} 標籤統計數據
 */
export const getTagStats = async slug => {
  try {
    console.log(`[TagService] Getting stats for tag: ${slug}`);

    // 支持雙重查詢：同時匹配帶#前綴和不帶#前綴的標籤
    // 新作品存儲格式：["#house"]，舊作品存儲格式：["castle"]
    const tagWithHash = `#${slug}`;
    const tagWithoutHash = slug;

    // 查詢包含該標籤的公開作品數量（支持兩種格式）
    const { data: worksData, error: worksError } = await supabase
      .from('portfolio')
      .select('id', { count: 'exact' })
      .eq('is_public', true)
      .or(`tags.cs.{${tagWithHash}},tags.cs.{${tagWithoutHash}}`);

    if (worksError) {
      console.error('[TagService] Error getting works count:', worksError);
      throw worksError;
    }

    // 查詢使用該標籤的用戶數量（支持兩種格式）
    const { data: usersData, error: usersError } = await supabase
      .from('portfolio')
      .select('user_id', { count: 'exact' })
      .eq('is_public', true)
      .or(`tags.cs.{${tagWithHash}},tags.cs.{${tagWithoutHash}}`);

    if (usersError) {
      console.error('[TagService] Error getting users count:', usersError);
      throw usersError;
    }

    // 計算唯一用戶數量
    const uniqueUsers = new Set(usersData?.map(item => item.user_id) || [])
      .size;

    const stats = {
      works: worksData?.length || 0,
      users: uniqueUsers,
      projects: 0, // 暫時設為0，後續可以擴展協作項目標籤
    };

    console.log(`[TagService] Tag stats for ${slug}:`, stats);
    return stats;
  } catch (error) {
    console.error('[TagService] Error getting tag stats:', error);
    return {
      works: 0,
      users: 0,
      projects: 0,
    };
  }
};

/**
 * 根據標籤獲取作品列表
 * @param {string} slug - 標籤slug
 * @param {Object} options - 查詢選項
 * @returns {Promise<Object>} 作品列表和分頁信息
 */
export const getWorksByTag = async (slug, options = {}) => {
  try {
    const { limit = 12, cursor = null } = options;
    console.log(
      `[TagService] Getting works for tag: ${slug}, limit: ${limit}, cursor: ${cursor}`
    );

    // 支持雙重查詢：同時匹配帶#前綴和不帶#前綴的標籤
    // 新作品存儲格式：["#house"]，舊作品存儲格式：["castle"]
    const tagWithHash = `#${slug}`;
    const tagWithoutHash = slug;

    let query = supabase
      .from('portfolio')
      .select(
        `
        id,
        title,
        description,
        tags,
        thumbnail_path,
        image_paths,
        created_at,
        user_id,
        profiles!fk_portfolio_profiles (
          id,
          full_name,
          avatar_url,
          title
        )
      `
      )
      .eq('is_public', true)
      .or(`tags.cs.{${tagWithHash}},tags.cs.{${tagWithoutHash}}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    // 如果有cursor，添加偏移
    if (cursor) {
      // 這裡可以使用更精確的cursor-based分頁，暫時使用簡單的offset
      const { data: cursorData } = await supabase
        .from('portfolio')
        .select('created_at')
        .eq('id', cursor)
        .single();

      if (cursorData) {
        query = query.lt('created_at', cursorData.created_at);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('[TagService] Error getting works by tag:', error);
      throw error;
    }

    // 轉換數據格式以匹配前端期望的結構
    const items = await Promise.all(
      (data || []).map(async item => {
        // 獲取圖片URL
        let imageUrl = '/assets/placeholder.svg';
        if (item.thumbnail_path) {
          try {
            const { data: imageData } = supabase.storage
              .from('portfolio')
              .getPublicUrl(item.thumbnail_path);
            imageUrl = imageData?.publicUrl || imageUrl;
          } catch (imageError) {
            console.warn('[TagService] Failed to get image URL:', imageError);
          }
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description || `Tagged with #${slug}`,
          author: {
            id: item.user_id,
            name: item.profiles?.full_name || 'Unknown Artist',
            avatar: item.profiles?.avatar_url || '',
            role: item.profiles?.title || '',
          },
          image: imageUrl,
          tags: item.tags || [],
          createdAt: item.created_at,
        };
      })
    );

    // 確定是否有更多數據
    const hasMore = items.length === limit;

    // 獲取下一個cursor（使用最後一項的ID）
    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1].id : null;

    const result = {
      items,
      cursor: nextCursor,
      hasMore,
    };

    console.log(`[TagService] Found ${items.length} works for tag ${slug}`);
    return result;
  } catch (error) {
    console.error('[TagService] Error getting works by tag:', error);
    return {
      items: [],
      cursor: null,
      hasMore: false,
    };
  }
};

/**
 * 搜索標籤
 * @param {string} query - 搜索查詢
 * @param {number} limit - 結果數量限制
 * @returns {Promise<Array>} 標籤列表
 */
export const searchTags = async (query, limit = 10) => {
  try {
    console.log(`[TagService] Searching tags with query: ${query}`);

    // 查詢包含該搜索詞的標籤
    const { data, error } = await supabase
      .from('portfolio')
      .select('tags')
      .eq('is_public', true)
      .not('tags', 'is', null);

    if (error) {
      console.error('[TagService] Error searching tags:', error);
      throw error;
    }

    // 統計標籤使用頻率
    const tagCounts = {};
    data?.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          const normalizedTag = tag.toLowerCase();
          const normalizedQuery = query.toLowerCase();

          // 只包含匹配查詢的標籤
          if (normalizedTag.includes(normalizedQuery)) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });

    // 轉換為數組並排序
    const results = Object.entries(tagCounts)
      .map(([name, count]) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    console.log(`[TagService] Found ${results.length} matching tags`);
    return results;
  } catch (error) {
    console.error('[TagService] Error searching tags:', error);
    return [];
  }
};

/**
 * 獲取熱門標籤
 * @param {number} limit - 結果數量限制
 * @returns {Promise<Array>} 熱門標籤列表
 */
export const getPopularTags = async (limit = 20) => {
  try {
    console.log(`[TagService] Getting popular tags, limit: ${limit}`);

    // 查詢所有公開作品的標籤
    const { data, error } = await supabase
      .from('portfolio')
      .select('tags')
      .eq('is_public', true)
      .not('tags', 'is', null);

    if (error) {
      console.error('[TagService] Error getting popular tags:', error);
      throw error;
    }

    // 統計標籤使用頻率
    const tagCounts = {};
    data?.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // 轉換為數組並排序
    const results = Object.entries(tagCounts)
      .map(([name, count]) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    console.log(`[TagService] Found ${results.length} popular tags`);
    return results;
  } catch (error) {
    console.error('[TagService] Error getting popular tags:', error);
    return [];
  }
};

/**
 * 根據專業獲取作品統計
 * @param {string} major - 專業名稱
 * @returns {Promise<Object>} 統計信息
 */
export const getMajorStats = async major => {
  try {
    console.log(`[TagService] Getting stats for major: ${major}`);

    // 查詢包含該專業的作品數量
    const { data: worksData, error: worksError } = await supabase
      .from('portfolio')
      .select('id', { count: 'exact' })
      .eq('is_public', true)
      .in(
        'user_id',
        supabase
          .from('profiles')
          .select('id')
          .or(`majors.cs.{${major}},minors.cs.{${major}}`)
      );

    if (worksError) {
      console.error(
        '[TagService] Error getting works count for major:',
        worksError
      );
      throw worksError;
    }

    // 查詢使用該專業的用戶數量
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .or(`majors.cs.{${major}},minors.cs.{${major}}`);

    if (usersError) {
      console.error(
        '[TagService] Error getting users count for major:',
        usersError
      );
      throw usersError;
    }

    const result = {
      works: worksData?.length || 0,
      users: usersData?.length || 0,
      projects: 0, // 暫時設為0，後續可擴展
    };

    console.log(`[TagService] Major stats for ${major}:`, result);
    return result;
  } catch (error) {
    console.error('[TagService] Error getting major stats:', error);
    return { works: 0, users: 0, projects: 0 };
  }
};

/**
 * 根據軟件獲取作品統計
 * @param {string} software - 軟件名稱
 * @returns {Promise<Object>} 統計信息
 */
export const getSoftwareStats = async software => {
  try {
    console.log(`[TagService] Getting stats for software: ${software}`);

    // 查詢包含該軟件的公開作品數量
    const { data: worksData, error: worksError } = await supabase
      .from('portfolio')
      .select('id', { count: 'exact' })
      .eq('is_public', true)
      .contains('software', [software]);

    if (worksError) {
      console.error(
        '[TagService] Error getting works count for software:',
        worksError
      );
      throw worksError;
    }

    // 查詢使用該軟件的用戶數量
    const { data: usersData, error: usersError } = await supabase
      .from('portfolio')
      .select('user_id', { count: 'exact' })
      .eq('is_public', true)
      .contains('software', [software]);

    if (usersError) {
      console.error(
        '[TagService] Error getting users count for software:',
        usersError
      );
      throw usersError;
    }

    const result = {
      works: worksData?.length || 0,
      users: usersData?.length || 0,
      projects: 0, // 暫時設為0，後續可擴展
    };

    console.log(`[TagService] Software stats for ${software}:`, result);
    return result;
  } catch (error) {
    console.error('[TagService] Error getting software stats:', error);
    return { works: 0, users: 0, projects: 0 };
  }
};

/**
 * 根據專業獲取作品列表
 * @param {string} major - 專業名稱
 * @param {Object} options - 查詢選項
 * @returns {Promise<Object>} 作品列表和分頁信息
 */
export const getWorksByMajor = async (major, options = {}) => {
  const { limit = 12, cursor = null } = options;

  try {
    console.log(
      `[TagService] Getting works for major: ${major}, limit: ${limit}, cursor: ${cursor}`
    );

    // 構建查詢
    let query = supabase
      .from('portfolio')
      .select(
        `
        id,
        title,
        description,
        tags,
        software,
        thumbnail_path,
        image_paths,
        created_at,
        user_id,
        profiles!fk_portfolio_profiles (
          id,
          full_name,
          avatar_url,
          title
        )
      `
      )
      .eq('is_public', true)
      .in(
        'user_id',
        supabase
          .from('profiles')
          .select('id')
          .or(`majors.cs.{${major}},minors.cs.{${major}}`)
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    // 如果有cursor，添加偏移
    if (cursor) {
      const { data: cursorData } = await supabase
        .from('portfolio')
        .select('created_at')
        .eq('id', cursor)
        .single();

      if (cursorData) {
        query = query.lt('created_at', cursorData.created_at);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('[TagService] Error getting works by major:', error);
      throw error;
    }

    console.log(
      `[TagService] Found ${data?.length || 0} works for major ${major}`
    );

    // 處理圖片URL
    const items = await Promise.all(
      data?.map(async item => {
        let imageUrl = '';
        if (item.thumbnail_path) {
          try {
            const { data: urlData } = await supabase.storage
              .from('portfolio')
              .getPublicUrl(item.thumbnail_path);
            imageUrl = urlData?.publicUrl || '';
          } catch (imageError) {
            console.warn('[TagService] Failed to get image URL:', imageError);
          }
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description || `Works by ${major} professionals`,
          author: {
            id: item.user_id,
            name: item.profiles?.full_name || 'Unknown Artist',
            avatar: item.profiles?.avatar_url || '',
            role: item.profiles?.title || '',
          },
          image: imageUrl,
          tags: item.tags || [],
          software: item.software || [],
          createdAt: item.created_at,
        };
      }) || []
    );

    // 確定是否有更多數據
    const hasMore = items.length === limit;
    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1].id : null;

    return {
      items,
      hasMore,
      cursor: nextCursor,
    };
  } catch (error) {
    console.error('[TagService] Error getting works by major:', error);
    return { items: [], hasMore: false, cursor: null };
  }
};

/**
 * 根據軟件獲取作品列表
 * @param {string} software - 軟件名稱
 * @param {Object} options - 查詢選項
 * @returns {Promise<Object>} 作品列表和分頁信息
 */
export const getWorksBySoftware = async (software, options = {}) => {
  const { limit = 12, cursor = null } = options;

  try {
    console.log(
      `[TagService] Getting works for software: ${software}, limit: ${limit}, cursor: ${cursor}`
    );

    // 構建查詢
    let query = supabase
      .from('portfolio')
      .select(
        `
        id,
        title,
        description,
        tags,
        software,
        thumbnail_path,
        image_paths,
        created_at,
        user_id,
        profiles!fk_portfolio_profiles (
          id,
          full_name,
          avatar_url,
          title
        )
      `
      )
      .eq('is_public', true)
      .contains('software', [software])
      .order('created_at', { ascending: false })
      .limit(limit);

    // 如果有cursor，添加偏移
    if (cursor) {
      const { data: cursorData } = await supabase
        .from('portfolio')
        .select('created_at')
        .eq('id', cursor)
        .single();

      if (cursorData) {
        query = query.lt('created_at', cursorData.created_at);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('[TagService] Error getting works by software:', error);
      throw error;
    }

    console.log(
      `[TagService] Found ${data?.length || 0} works for software ${software}`
    );

    // 處理圖片URL
    const items = await Promise.all(
      data?.map(async item => {
        let imageUrl = '';
        if (item.thumbnail_path) {
          try {
            const { data: urlData } = await supabase.storage
              .from('portfolio')
              .getPublicUrl(item.thumbnail_path);
            imageUrl = urlData?.publicUrl || '';
          } catch (imageError) {
            console.warn('[TagService] Failed to get image URL:', imageError);
          }
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description || `Created with ${software}`,
          author: {
            id: item.user_id,
            name: item.profiles?.full_name || 'Unknown Artist',
            avatar: item.profiles?.avatar_url || '',
            role: item.profiles?.title || '',
          },
          image: imageUrl,
          tags: item.tags || [],
          software: item.software || [],
          createdAt: item.created_at,
        };
      }) || []
    );

    // 確定是否有更多數據
    const hasMore = items.length === limit;
    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1].id : null;

    return {
      items,
      hasMore,
      cursor: nextCursor,
    };
  } catch (error) {
    console.error('[TagService] Error getting works by software:', error);
    return { items: [], hasMore: false, cursor: null };
  }
};

/**
 * 組合查詢：根據多個條件獲取作品
 * @param {Object} filters - 篩選條件
 * @param {Object} options - 查詢選項
 * @returns {Promise<Object>} 作品列表和分頁信息
 */
export const getWorksByCombination = async (filters = {}, options = {}) => {
  const { major = null, software = [], tags = [] } = filters;

  const { limit = 12, cursor = null } = options;

  try {
    console.log(`[TagService] Getting works by combination:`, {
      major,
      software,
      tags,
    });

    // 構建基礎查詢
    let query = supabase
      .from('portfolio')
      .select(
        `
        id,
        title,
        description,
        tags,
        software,
        thumbnail_path,
        image_paths,
        created_at,
        user_id,
        profiles!fk_portfolio_profiles (
          id,
          full_name,
          avatar_url,
          title
        )
      `
      )
      .eq('is_public', true);

    // 添加專業篩選
    if (major) {
      query = query.in(
        'user_id',
        supabase
          .from('profiles')
          .select('id')
          .or(`majors.cs.{${major}},minors.cs.{${major}}`)
      );
    }

    // 添加軟件篩選
    if (software && software.length > 0) {
      query = query.contains('software', software);
    }

    // 添加標籤篩選
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }

    query = query.order('created_at', { ascending: false }).limit(limit);

    // 如果有cursor，添加偏移
    if (cursor) {
      const { data: cursorData } = await supabase
        .from('portfolio')
        .select('created_at')
        .eq('id', cursor)
        .single();

      if (cursorData) {
        query = query.lt('created_at', cursorData.created_at);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('[TagService] Error getting works by combination:', error);
      throw error;
    }

    console.log(`[TagService] Found ${data?.length || 0} works by combination`);

    // 處理圖片URL
    const items = await Promise.all(
      data?.map(async item => {
        let imageUrl = '';
        if (item.thumbnail_path) {
          try {
            const { data: urlData } = await supabase.storage
              .from('portfolio')
              .getPublicUrl(item.thumbnail_path);
            imageUrl = urlData?.publicUrl || '';
          } catch (imageError) {
            console.warn('[TagService] Failed to get image URL:', imageError);
          }
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description || 'Combined filter results',
          author: {
            id: item.user_id,
            name: item.profiles?.full_name || 'Unknown Artist',
            avatar: item.profiles?.avatar_url || '',
            role: item.profiles?.title || '',
          },
          image: imageUrl,
          tags: item.tags || [],
          software: item.software || [],
          createdAt: item.created_at,
        };
      }) || []
    );

    // 確定是否有更多數據
    const hasMore = items.length === limit;
    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1].id : null;

    return {
      items,
      hasMore,
      cursor: nextCursor,
    };
  } catch (error) {
    console.error('[TagService] Error getting works by combination:', error);
    return { items: [], hasMore: false, cursor: null };
  }
};

/**
 * 為作品添加標籤
 * @param {string} workId - 作品ID
 * @param {Array} tags - 標籤數組
 * @returns {Promise<boolean>} 是否成功
 */
export const attachTagsToWork = async (workId, tags) => {
  try {
    console.log(`[TagService] Attaching tags to work ${workId}:`, tags);

    // 獲取現有標籤
    const { data: existingWork, error: fetchError } = await supabase
      .from('portfolio')
      .select('tags')
      .eq('id', workId)
      .single();

    if (fetchError) {
      console.error('[TagService] Error fetching existing work:', fetchError);
      throw fetchError;
    }

    // 合併新標籤和現有標籤
    const existingTags = existingWork?.tags || [];
    const newTags = tags.map(tag => tag.slug || tag);
    const updatedTags = [...new Set([...existingTags, ...newTags])];

    // 更新作品標籤
    const { error: updateError } = await supabase
      .from('portfolio')
      .update({ tags: updatedTags })
      .eq('id', workId);

    if (updateError) {
      console.error('[TagService] Error updating work tags:', updateError);
      throw updateError;
    }

    console.log(`[TagService] Successfully attached tags to work ${workId}`);
    return true;
  } catch (error) {
    console.error('[TagService] Error attaching tags to work:', error);
    return false;
  }
};

/**
 * 為用戶添加標籤（技能）
 * @param {string} userId - 用戶ID
 * @param {Array} tags - 標籤數組
 * @returns {Promise<boolean>} 是否成功
 */
export const attachTagsToUser = async (userId, tags) => {
  try {
    console.log(`[TagService] Attaching tags to user ${userId}:`, tags);

    // 這裡可以擴展到用戶資料表的技能標籤字段
    // 目前暫時返回成功，後續可以實現
    console.log(`[TagService] User tag attachment not implemented yet`);
    return true;
  } catch (error) {
    console.error('[TagService] Error attaching tags to user:', error);
    return false;
  }
};

/**
 * 為項目添加標籤（需求）
 * @param {string} projectId - 項目ID
 * @param {Array} tags - 標籤數組
 * @returns {Promise<boolean>} 是否成功
 */
export const attachTagsToProject = async (projectId, tags) => {
  try {
    console.log(`[TagService] Attaching tags to project ${projectId}:`, tags);

    // 這裡可以擴展到協作項目表的標籤字段
    // 目前暫時返回成功，後續可以實現
    console.log(`[TagService] Project tag attachment not implemented yet`);
    return true;
  } catch (error) {
    console.error('[TagService] Error attaching tags to project:', error);
    return false;
  }
};
