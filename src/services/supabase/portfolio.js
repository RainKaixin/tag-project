import imageStorage from '../../utils/indexedDB.js';

import { supabase } from './client';

// Portfolio 表结构
/**
 * CREATE TABLE portfolio (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   title TEXT NOT NULL,
 *   description TEXT,
 *   category TEXT,
 *   tags TEXT[],
 *   image_paths TEXT[],
 *   thumbnail_path TEXT,
 *   is_public BOOLEAN DEFAULT true,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- RLS 策略
 * ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
 *
 * -- 允许认证用户插入自己的作品
 * CREATE POLICY "Users can insert their own portfolio items" ON portfolio
 *   FOR INSERT WITH CHECK (auth.uid() = user_id);
 *
 * -- 允许认证用户更新自己的作品
 * CREATE POLICY "Users can update their own portfolio items" ON portfolio
 *   FOR UPDATE USING (auth.uid() = user_id);
 *
 * -- 允许认证用户删除自己的作品
 * CREATE POLICY "Users can delete their own portfolio items" ON portfolio
 *   FOR DELETE USING (auth.uid() = user_id);
 *
 * -- 允许任何人查询公开的作品
 * CREATE POLICY "Anyone can view public portfolio items" ON portfolio
 *   FOR SELECT USING (is_public = true);
 *
 * -- 允许认证用户查看自己的所有作品（包括私有的）
 * CREATE POLICY "Users can view their own portfolio items" ON portfolio
 *   FOR SELECT USING (auth.uid() = user_id);
 */

// 从 Supabase Storage 获取图片 URL
export const getPortfolioImageUrl = async filePath => {
  console.log(`[Portfolio] Supabase: Getting image URL for ${filePath}`);

  // 安全检查：如果 filePath 为空或 undefined，直接返回错误
  if (!filePath) {
    console.warn('[Portfolio] filePath is empty or undefined');
    return {
      success: false,
      error: 'Invalid file path',
    };
  }

  try {
    // 直接从 Supabase Storage 获取公开URL
    console.log(
      `[Portfolio] Getting public URL from Supabase Storage: ${filePath}`
    );

    const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);

    if (data && data.publicUrl) {
      console.log(`[Portfolio] Successfully got public URL: ${filePath}`);

      return {
        success: true,
        data: {
          url: data.publicUrl,
          path: filePath,
        },
      };
    }

    console.log(`[Portfolio] Image not found in Supabase Storage: ${filePath}`);
    return {
      success: false,
      error: 'Image not found in Supabase Storage',
    };
  } catch (error) {
    console.error('[Portfolio] Error getting image URL:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 批量获取图片 URL（用于作品列表显示）
export const getPortfolioImageUrls = async imagePaths => {
  // 从 IndexedDB 批量读取图片 URL

  // 安全检查：如果 imagePaths 为空或 undefined，返回空数组
  if (!imagePaths || !Array.isArray(imagePaths)) {
    console.warn('[Portfolio] imagePaths is empty or not an array');
    return {
      success: true,
      data: [],
    };
  }

  console.log(`[Portfolio] Getting image URLs for ${imagePaths.length} images`);

  try {
    const imageUrls = [];

    for (const imagePath of imagePaths) {
      const result = await getPortfolioImageUrl(imagePath);
      if (result.success) {
        imageUrls.push(result.data.url);
      } else {
        console.warn(`[Portfolio] Failed to get image for ${imagePath}`);
        imageUrls.push(''); // 使用空字符串作为占位符
      }
    }

    console.log(`[Portfolio] Retrieved ${imageUrls.length} image URLs`);

    return {
      success: true,
      data: imageUrls,
    };
  } catch (error) {
    console.error('[Portfolio] Error getting image URLs:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取当前用户的所有作品
export const getMyPortfolio = async (userId = null) => {
  console.log('[Portfolio] Supabase: Reading portfolio from database');

  try {
    // 如果没有提供 userId，尝试从当前会话获取
    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error('[Portfolio] No authenticated user found');
        return {
          success: false,
          error: 'User not authenticated',
        };
      }
      userId = user.id;
    }

    console.log(`[Portfolio] Reading portfolio for user: ${userId}`);

    // 从 Supabase 数据库读取作品
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Portfolio] Supabase select error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`[Portfolio] Found ${data.length} items for user ${userId}`);

    // 转换数据格式以匹配现有接口
    const portfolioWithImages = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags,
      imagePaths: item.image_paths,
      thumbnailPath: item.thumbnail_path,
      isPublic: item.is_public,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return {
      success: true,
      data: portfolioWithImages,
    };
  } catch (error) {
    console.error('[Portfolio] Error reading portfolio:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取指定用户的公开作品
export const getPublicPortfolio = async userId => {
  console.log(
    `[Portfolio] Supabase: Reading public portfolio for user ${userId}`
  );

  try {
    if (!userId) {
      console.error('[Portfolio] No userId provided');
      return {
        success: false,
        error: 'User ID is required',
      };
    }

    // 从 Supabase 数据库读取指定用户的公开作品
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Portfolio] Supabase select error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(
      `[Portfolio] Found ${data.length} public items for user ${userId} from database`
    );

    // 转换数据格式以匹配现有接口
    const publicPortfolioWithImages = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags,
      imagePaths: item.image_paths,
      thumbnailPath: item.thumbnail_path,
      isPublic: item.is_public,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return {
      success: true,
      data: publicPortfolioWithImages,
    };
  } catch (error) {
    console.error('[Portfolio] Error reading public portfolio:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取所有公开作品（用于公共画廊）
export const getAllPublicPortfolios = async () => {
  console.log(
    '[Portfolio] Supabase: Reading all public portfolios from database'
  );

  try {
    // 从 Supabase 数据库读取所有公开作品
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Portfolio] Supabase select error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(
      `[Portfolio] Found ${data.length} total public items from database`
    );

    // 转换数据格式以匹配现有接口
    const allPortfoliosWithImages = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags,
      imagePaths: item.image_paths,
      thumbnailPath: item.thumbnail_path,
      isPublic: item.is_public,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      profiles: {
        id: item.user_id,
        full_name: 'Unknown Artist', // 暂时使用默认值，后续可以从 profiles 表获取
        avatar_url: '',
        role: 'Design',
      },
    }));

    return {
      success: true,
      data: allPortfoliosWithImages,
    };
  } catch (error) {
    console.error('[Portfolio] Error reading all public portfolios:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 创建新作品
export const createPortfolioItem = async portfolioData => {
  console.log('[Portfolio] Supabase: Creating new portfolio item');

  try {
    // 从 portfolioData 获取用户ID
    const userId = portfolioData.userId;
    if (!userId) {
      console.error('[Portfolio] No userId provided in portfolioData');
      return {
        success: false,
        error: 'User ID is required',
      };
    }

    // 准备插入数据
    const insertData = {
      user_id: userId,
      title: portfolioData.title || 'Untitled',
      description: portfolioData.description || '',
      category: portfolioData.category || '',
      tags: portfolioData.tags || [],
      image_paths: portfolioData.imagePaths || [],
      thumbnail_path: portfolioData.thumbnailPath || '',
      is_public: portfolioData.isPublic !== false,
    };

    console.log('[Portfolio] Inserting data:', insertData);

    // 插入到 Supabase 数据库
    const { data, error } = await supabase
      .from('portfolio')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[Portfolio] Supabase insert error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('[Portfolio] Successfully created item:', data);

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
      },
    };
  } catch (error) {
    console.error('[Portfolio] Error creating portfolio item:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 更新作品
export const updatePortfolioItem = async (itemId, updates, userId = null) => {
  console.log(`[Portfolio] Supabase: Updating item ${itemId}`);

  try {
    // 如果没有提供 userId，尝试从当前会话获取
    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error('[Portfolio] No authenticated user found');
        return {
          success: false,
          error: 'User not authenticated',
        };
      }
      userId = user.id;
    }

    // 准备更新数据
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    console.log('[Portfolio] Updating data:', updateData);

    // 更新 Supabase 数据库
    const { data, error } = await supabase
      .from('portfolio')
      .update(updateData)
      .eq('id', itemId)
      .eq('user_id', userId) // 确保只能更新自己的作品
      .select()
      .single();

    if (error) {
      console.error('[Portfolio] Supabase update error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('[Portfolio] Successfully updated item:', data);

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
      },
    };
  } catch (error) {
    console.error('[Portfolio] Error updating portfolio item:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 删除作品
export const deletePortfolioItem = async (itemId, userId = null) => {
  console.log(`[Portfolio] Supabase: Deleting item ${itemId}`);

  try {
    // 如果没有提供 userId，尝试从当前会话获取
    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error('[Portfolio] No authenticated user found');
        return {
          success: false,
          error: 'User not authenticated',
        };
      }
      userId = user.id;
    }

    console.log('[Portfolio] Deleting item:', itemId, 'for user:', userId);

    // 从 Supabase 数据库删除
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId); // 确保只能删除自己的作品

    if (error) {
      console.error('[Portfolio] Supabase delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('[Portfolio] Successfully deleted item:', itemId);

    return {
      success: true,
      data: { id: itemId },
    };
  } catch (error) {
    console.error('[Portfolio] Error deleting portfolio item:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 上传文件到 Supabase Storage
export const uploadPortfolioImage = async (file, userId) => {
  console.log(
    `[Portfolio] Supabase: Uploading image ${file.name} for user ${userId}`
  );

  try {
    // 生成文件路径（作为 key）- 統一格式，不带桶前缀
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log(`[Portfolio] Supabase: Uploading to path: ${filePath}`);

    // 上传文件到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('[Portfolio] Supabase: Upload failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`[Portfolio] Supabase: Successfully uploaded ${filePath}`);

    // 获取公开URL用于立即显示
    const { data: urlData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return {
      success: true,
      data: {
        path: filePath, // 返回文件路径作为 key
        url: urlData.publicUrl, // 返回公开URL（用于立即显示）
      },
    };
  } catch (error) {
    console.error('[Portfolio] Supabase: Error uploading image:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 删除文件从 Supabase Storage
export const deletePortfolioImage = async filePath => {
  console.log(`[Portfolio] Supabase: Deleting image ${filePath}`);

  try {
    const { error } = await supabase.storage
      .from('portfolio')
      .remove([filePath]);

    if (error) {
      console.error('[Portfolio] Supabase: Delete failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`[Portfolio] Supabase: Successfully deleted image ${filePath}`);
    return {
      success: true,
      data: { path: filePath },
    };
  } catch (error) {
    console.error('[Portfolio] Supabase: Error deleting image:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
