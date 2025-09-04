import { supabase } from '../supabase/client';
import { getPortfolioImageUrl } from '../supabase/portfolio';

// 获取所有公开作品（用于公共画廊）
export const getAllPublicWorks = async () => {
  console.log('[Supabase WorkService] Getting all public works');

  try {
    // 从 Supabase 数据库读取所有公开作品
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase WorkService] Database error:', error);
      throw error;
    }

    console.log(`[Supabase WorkService] Found ${data.length} public works`);

    // 转换数据格式并处理图片URL
    const worksWithImages = await Promise.all(
      data.map(async item => {
        // 获取主图片URL（使用thumbnail_path或第一个image_path）
        let mainImageUrl = null;
        if (item.thumbnail_path) {
          const imageResult = await getPortfolioImageUrl(item.thumbnail_path);
          if (imageResult.success) {
            mainImageUrl = imageResult.data.url;
          }
        } else if (item.image_paths && item.image_paths.length > 0) {
          const imageResult = await getPortfolioImageUrl(item.image_paths[0]);
          if (imageResult.success) {
            mainImageUrl = imageResult.data.url;
          }
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          tags: item.tags || [],
          mainImageUrl: mainImageUrl,
          allImages: item.image_paths || [],
          thumbnailPath: item.thumbnail_path,
          isPublic: item.is_public,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          userId: item.user_id,
          // 添加作者信息（暂时使用默认值，后续可以从profiles表获取）
          author: {
            id: item.user_id,
            name: 'Unknown Artist',
            avatar: '',
            role: 'Design',
          },
        };
      })
    );

    return {
      success: true,
      data: worksWithImages,
    };
  } catch (error) {
    console.error('[Supabase WorkService] Error getting public works:', error);
    throw error;
  }
};

// 获取指定用户的公开作品
export const getUserWorks = async userId => {
  console.log(`[Supabase WorkService] Getting works for user ${userId}`);

  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // 从 Supabase 数据库读取指定用户的公开作品
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase WorkService] Database error:', error);
      throw error;
    }

    console.log(
      `[Supabase WorkService] Found ${data.length} works for user ${userId}`
    );

    // 转换数据格式并处理图片URL
    const worksWithImages = await Promise.all(
      data.map(async item => {
        // 获取主图片URL
        let mainImageUrl = null;
        if (item.thumbnail_path) {
          const imageResult = await getPortfolioImageUrl(item.thumbnail_path);
          if (imageResult.success) {
            mainImageUrl = imageResult.data.url;
          }
        } else if (item.image_paths && item.image_paths.length > 0) {
          const imageResult = await getPortfolioImageUrl(item.image_paths[0]);
          if (imageResult.success) {
            mainImageUrl = imageResult.data.url;
          }
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          tags: item.tags || [],
          mainImageUrl: mainImageUrl,
          allImages: item.image_paths || [],
          thumbnailPath: item.thumbnail_path,
          isPublic: item.is_public,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          userId: item.user_id,
        };
      })
    );

    return {
      success: true,
      data: worksWithImages,
    };
  } catch (error) {
    console.error('[Supabase WorkService] Error getting user works:', error);
    throw error;
  }
};

// 根据ID获取作品详情
export const getWorkById = async (workId, userId = null) => {
  console.log(`[Supabase WorkService] Getting work by ID: ${workId}`);

  if (!workId) {
    throw new Error('Work ID is required');
  }

  try {
    // 从 Supabase 数据库读取作品详情
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', workId)
      .eq('is_public', true)
      .single();

    if (error) {
      console.error('[Supabase WorkService] Database error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Work not found');
    }

    console.log(`[Supabase WorkService] Found work: ${data.title}`);

    // 处理图片URL
    let mainImageUrl = null;
    let allImageUrls = [];

    if (data.thumbnail_path) {
      const imageResult = await getPortfolioImageUrl(data.thumbnail_path);
      if (imageResult.success) {
        mainImageUrl = imageResult.data.url;
      }
    }

    // 处理所有图片
    if (data.image_paths && data.image_paths.length > 0) {
      const imagePromises = data.image_paths.map(async imagePath => {
        const imageResult = await getPortfolioImageUrl(imagePath);
        if (imageResult.success) {
          return imageResult.data.url;
        }
        return null;
      });

      allImageUrls = (await Promise.all(imagePromises)).filter(
        url => url !== null
      );

      // 如果没有主图片，使用第一张图片
      if (!mainImageUrl && allImageUrls.length > 0) {
        mainImageUrl = allImageUrls[0];
      }
    }

    return {
      success: true,
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        mainImageUrl: mainImageUrl,
        allImages: allImageUrls,
        thumbnailPath: data.thumbnail_path,
        isPublic: data.is_public,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id,
      },
    };
  } catch (error) {
    console.error('[Supabase WorkService] Error getting work by ID:', error);
    throw error;
  }
};

// 创建新作品
export const createWork = async workData => {
  console.log('[Supabase WorkService] Creating new work');

  try {
    const { data, error } = await supabase
      .from('portfolio')
      .insert({
        user_id: workData.userId,
        title: workData.title,
        description: workData.description,
        category: workData.category,
        tags: workData.tags,
        image_paths: workData.imagePaths,
        thumbnail_path: workData.thumbnailPath,
        is_public: workData.isPublic !== false,
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase WorkService] Create error:', error);
      throw error;
    }

    return {
      success: true,
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags,
        imagePaths: data.image_paths,
        thumbnailPath: data.thumbnail_path,
        isPublic: data.is_public,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id,
      },
    };
  } catch (error) {
    console.error('[Supabase WorkService] Error creating work:', error);
    throw error;
  }
};

// 更新作品
export const updateWork = async (workId, updates, userId) => {
  console.log(`[Supabase WorkService] Updating work: ${workId}`);

  try {
    const { data, error } = await supabase
      .from('portfolio')
      .update({
        title: updates.title,
        description: updates.description,
        category: updates.category,
        tags: updates.tags,
        image_paths: updates.imagePaths,
        thumbnail_path: updates.thumbnailPath,
        is_public: updates.isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('[Supabase WorkService] Update error:', error);
      throw error;
    }

    return {
      success: true,
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags,
        imagePaths: data.image_paths,
        thumbnailPath: data.thumbnail_path,
        isPublic: data.is_public,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id,
      },
    };
  } catch (error) {
    console.error('[Supabase WorkService] Error updating work:', error);
    throw error;
  }
};

// 删除作品
export const deleteWork = async (workId, userId) => {
  console.log(`[Supabase WorkService] Deleting work: ${workId}`);

  try {
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', workId)
      .eq('user_id', userId);

    if (error) {
      console.error('[Supabase WorkService] Delete error:', error);
      throw error;
    }

    return {
      success: true,
      data: { id: workId },
    };
  } catch (error) {
    console.error('[Supabase WorkService] Error deleting work:', error);
    throw error;
  }
};

// 默认导出所有函数作为supabaseAdapter对象
const supabaseAdapter = {
  getAllPublicWorks,
  getUserWorks,
  getWorkById,
  createWork,
  updateWork,
  deleteWork,
};

export default supabaseAdapter;
