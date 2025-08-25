import { getCurrentUserId } from '../../utils/currentUser.js';
import imageStorage from '../../utils/indexedDB.js';
import { getUserInfo } from '../../utils/mockUsers.js';
import { storage } from '../storage/index';

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

// 从 IndexedDB 获取图片 URL
export const getPortfolioImageUrl = async filePath => {
  // Mock API: 从 IndexedDB 读取 Data URL
  console.log(`[Portfolio] Mock API: Getting image URL for ${filePath}`);

  // 安全检查：如果 filePath 为空或 undefined，直接返回错误
  if (!filePath) {
    console.warn('[Portfolio] Mock API: filePath is empty or undefined');
    return {
      success: false,
      error: 'Invalid file path',
    };
  }

  try {
    const url = await imageStorage.getImageUrl(filePath);

    if (!url) {
      console.log(`[Portfolio] Mock API: 未命中 - queryKey: ${filePath}`);
      return {
        success: false,
        error: 'Image not found',
      };
    }

    console.log(
      `[Portfolio] Mock API: 命中 - queryKey: ${filePath}, url: ${url.substring(
        0,
        32
      )}...`
    );

    return {
      success: true,
      data: {
        url: url,
        path: filePath,
      },
    };
  } catch (error) {
    console.error('[Portfolio] Mock API: Error getting image URL:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 批量获取图片 URL（用于作品列表显示）
export const getPortfolioImageUrls = async imagePaths => {
  // Mock API: 批量从 IndexedDB 读取 Data URL

  // 安全检查：如果 imagePaths 为空或 undefined，返回空数组
  if (!imagePaths || !Array.isArray(imagePaths)) {
    console.warn('[Portfolio] Mock API: imagePaths is empty or not an array');
    return {
      success: true,
      data: [],
    };
  }

  console.log(
    `[Portfolio] Mock API: Getting image URLs for ${imagePaths.length} images`
  );

  try {
    const imageUrls = [];

    for (const imagePath of imagePaths) {
      const result = await getPortfolioImageUrl(imagePath);
      if (result.success) {
        imageUrls.push(result.data.url);
      } else {
        console.warn(
          `[Portfolio] Mock API: Failed to get image for ${imagePath}`
        );
        imageUrls.push(''); // 使用空字符串作为占位符
      }
    }

    console.log(
      `[Portfolio] Mock API: Retrieved ${imageUrls.length} image URLs`
    );

    return {
      success: true,
      data: imageUrls,
    };
  } catch (error) {
    console.error('[Portfolio] Mock API: Error getting image URLs:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取当前用户的所有作品
export const getMyPortfolio = async () => {
  // Mock API: 从 localStorage 读取数据
  console.log('[Portfolio] Mock API: Reading from localStorage');

  try {
    const userId = getCurrentUserId();
    const key = `portfolio_${userId}`;
    const data = await storage.getItem(key);

    // 安全地解析 JSON 数据
    let portfolio = [];
    try {
      portfolio = data ? JSON.parse(data) : [];
    } catch (parseError) {
      console.warn(
        `[Portfolio] Mock API: Failed to parse portfolio data for user ${userId}:`,
        parseError
      );
      // 如果解析失败，返回空数组
      portfolio = [];
    }

    // 确保 portfolio 是数组
    if (!Array.isArray(portfolio)) {
      console.warn(
        `[Portfolio] Mock API: Portfolio data for user ${userId} is not an array`
      );
      portfolio = [];
    }

    console.log(
      `[Portfolio] Mock API: Found ${portfolio.length} items for user ${userId}`
    );

    // 为每个作品获取正确的图片 URL
    const portfolioWithImages = await Promise.all(
      portfolio.map(async item => {
        if (
          item.imagePaths &&
          item.imagePaths.length > 0 &&
          item.imagePaths[0]
        ) {
          // 获取第一张图片作为缩略图
          const thumbnailResult = await getPortfolioImageUrl(
            item.imagePaths[0]
          );
          if (thumbnailResult.success) {
            return {
              ...item,
              thumbnailPath: thumbnailResult.data.url,
            };
          }
        }
        return item;
      })
    );

    return {
      success: true,
      data: portfolioWithImages,
    };
  } catch (error) {
    console.error('[Portfolio] Mock API: Error reading portfolio:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取指定用户的公开作品
export const getPublicPortfolio = async userId => {
  // Mock API: 从 localStorage 读取公开数据
  console.log(
    `[Portfolio] Mock API: Reading public portfolio for user ${userId}`
  );

  try {
    const key = `portfolio_${userId}`;
    const data = await storage.getItem(key);

    // 安全地解析 JSON 数据
    let portfolio = [];
    try {
      portfolio = data ? JSON.parse(data) : [];
    } catch (parseError) {
      console.warn(
        `[Portfolio] Mock API: Failed to parse portfolio data for user ${userId}:`,
        parseError
      );
      // 如果解析失败，返回空数组
      portfolio = [];
    }

    // 确保 portfolio 是数组
    if (!Array.isArray(portfolio)) {
      console.warn(
        `[Portfolio] Mock API: Portfolio data for user ${userId} is not an array`
      );
      portfolio = [];
    }

    // 过滤出公开的作品
    const publicPortfolio = portfolio.filter(item => item.isPublic !== false);

    console.log(
      `[Portfolio] Mock API: Found ${publicPortfolio.length} public items for user ${userId}`
    );

    // 为每个作品获取正确的图片 URL
    const publicPortfolioWithImages = await Promise.all(
      publicPortfolio.map(async item => {
        if (
          item.imagePaths &&
          item.imagePaths.length > 0 &&
          item.imagePaths[0]
        ) {
          // 获取第一张图片作为缩略图
          const thumbnailResult = await getPortfolioImageUrl(
            item.imagePaths[0]
          );
          if (thumbnailResult.success) {
            return {
              ...item,
              thumbnailPath: thumbnailResult.data.url,
            };
          }
        }
        return item;
      })
    );

    return {
      success: true,
      data: publicPortfolioWithImages,
    };
  } catch (error) {
    console.error(
      '[Portfolio] Mock API: Error reading public portfolio:',
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取所有公开作品（用于公共画廊）
export const getAllPublicPortfolios = async () => {
  // Mock API: 从 localStorage 读取所有用户的公开数据
  console.log('[Portfolio] Mock API: Reading all public portfolios');

  try {
    const allPortfolios = [];

    // 获取所有存储键
    const keys = await storage.keys();

    // 遍历所有 portfolio 相关的键
    for (const key of keys) {
      // 只处理 portfolio 数据，跳过图片数据
      if (key && key.startsWith('portfolio_') && !key.includes('image_')) {
        const userId = key.replace('portfolio_', '');
        const data = await storage.getItem(key);

        // 安全地解析 JSON 数据
        let portfolio = [];
        try {
          portfolio = data ? JSON.parse(data) : [];
        } catch (parseError) {
          console.warn(
            `[Portfolio] Mock API: Failed to parse portfolio data for user ${userId}:`,
            parseError
          );
          // 如果解析失败，跳过这个用户的数据
          continue;
        }

        // 确保 portfolio 是数组
        if (!Array.isArray(portfolio)) {
          console.warn(
            `[Portfolio] Mock API: Portfolio data for user ${userId} is not an array`
          );
          continue;
        }

        // 过滤出公开的作品并添加用户信息
        const publicItemsPromises = portfolio
          .filter(item => item && item.id && item.isPublic !== false) // 确保项目有效
          .map(async item => {
            // 获取用户档案数据
            const { getProfile } = await import(
              '../mock/userProfileService.js'
            );
            const profileResult = await getProfile(userId);
            const profile = profileResult.success ? profileResult.data : null;

            return {
              ...item,
              profiles: {
                id: userId,
                full_name:
                  profile?.fullName ||
                  getUserInfo(userId)?.name ||
                  'Unknown Artist',
                avatar_url: getUserInfo(userId)?.avatar || '',
                role: profile?.title || getUserInfo(userId)?.role || 'Design',
              },
            };
          });

        const publicItems = await Promise.all(publicItemsPromises);
        allPortfolios.push(...publicItems);
      }
    }

    // 为每个作品获取正确的图片 URL
    const allPortfoliosWithImages = await Promise.all(
      allPortfolios.map(async item => {
        if (item.imagePaths && item.imagePaths.length > 0) {
          // 获取第一张图片作为缩略图
          const thumbnailResult = await getPortfolioImageUrl(
            item.imagePaths[0]
          );
          if (thumbnailResult.success) {
            return {
              ...item,
              thumbnailPath: thumbnailResult.data.url,
            };
          }
        }
        return item;
      })
    );

    // 按创建时间排序
    allPortfoliosWithImages.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    console.log(
      `[Portfolio] Mock API: Found ${allPortfoliosWithImages.length} total public items`
    );

    return {
      success: true,
      data: allPortfoliosWithImages,
    };
  } catch (error) {
    console.error(
      '[Portfolio] Mock API: Error reading all public portfolios:',
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

// 创建新作品
export const createPortfolioItem = async portfolioData => {
  // Mock API: 保存到 localStorage
  console.log('[Portfolio] Mock API: Creating new portfolio item');

  try {
    const userId = getCurrentUserId();
    const key = `portfolio_${userId}`;

    // 读取现有数据
    const existingData = await storage.getItem(key);

    // 安全地解析 JSON 数据
    let portfolio = [];
    try {
      portfolio = existingData ? JSON.parse(existingData) : [];
    } catch (parseError) {
      console.warn(
        `[Portfolio] Mock API: Failed to parse portfolio data for user ${userId}:`,
        parseError
      );
      // 如果解析失败，使用空数组
      portfolio = [];
    }

    // 确保 portfolio 是数组
    if (!Array.isArray(portfolio)) {
      console.warn(
        `[Portfolio] Mock API: Portfolio data for user ${userId} is not an array`
      );
      portfolio = [];
    }

    // 创建新作品
    const newItem = {
      id: `mock_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      title: portfolioData.title || 'Untitled',
      description: portfolioData.description || '',
      category: portfolioData.category || '',
      tags: portfolioData.tags || [],
      imagePaths: portfolioData.imagePaths || [],
      thumbnailPath: portfolioData.thumbnailPath || '',
      // 统一保存imageKey，确保与IndexedDB的key一致
      imageKey:
        portfolioData.imagePaths?.[0] || portfolioData.thumbnailPath || '',
      isPublic: portfolioData.isPublic !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 调试信息：检查标签数据
    console.log('[Portfolio] Creating item with tags:', portfolioData.tags);
    console.log('[Portfolio] New item tags:', newItem.tags);

    // 添加到数组开头
    portfolio.unshift(newItem);

    // 保存回存储
    await storage.setItem(key, JSON.stringify(portfolio));

    console.log(
      `[Portfolio] Mock API: Created item ${newItem.id} for user ${userId}`
    );

    return {
      success: true,
      data: newItem,
    };
  } catch (error) {
    console.error(
      '[Portfolio] Mock API: Error creating portfolio item:',
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

// 更新作品
export const updatePortfolioItem = async (itemId, updates) => {
  // Mock API: 更新 localStorage 中的数据
  console.log(`[Portfolio] Mock API: Updating item ${itemId}`);

  try {
    const userId = getCurrentUserId();
    const key = `portfolio_${userId}`;

    // 读取现有数据
    const existingData = await storage.getItem(key);

    // 安全地解析 JSON 数据
    let portfolio = [];
    try {
      portfolio = existingData ? JSON.parse(existingData) : [];
    } catch (parseError) {
      console.warn(
        `[Portfolio] Mock API: Failed to parse portfolio data for user ${userId}:`,
        parseError
      );
      // 如果解析失败，使用空数组
      portfolio = [];
    }

    // 确保 portfolio 是数组
    if (!Array.isArray(portfolio)) {
      console.warn(
        `[Portfolio] Mock API: Portfolio data for user ${userId} is not an array`
      );
      portfolio = [];
    }

    // 找到要更新的项目
    const itemIndex = portfolio.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Portfolio item not found');
    }

    // 更新项目
    portfolio[itemIndex] = {
      ...portfolio[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // 保存回存储
    await storage.setItem(key, JSON.stringify(portfolio));

    console.log(
      `[Portfolio] Mock API: Updated item ${itemId} for user ${userId}`
    );

    return {
      success: true,
      data: portfolio[itemIndex],
    };
  } catch (error) {
    console.error(
      '[Portfolio] Mock API: Error updating portfolio item:',
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

// 删除作品
export const deletePortfolioItem = async itemId => {
  // Mock API: 从 localStorage 删除数据
  console.log(`[Portfolio] Mock API: Deleting item ${itemId}`);

  try {
    const userId = getCurrentUserId();
    const key = `portfolio_${userId}`;

    // 读取现有数据
    const existingData = await storage.getItem(key);

    // 安全地解析 JSON 数据
    let portfolio = [];
    try {
      portfolio = existingData ? JSON.parse(existingData) : [];
    } catch (parseError) {
      console.warn(
        `[Portfolio] Mock API: Failed to parse portfolio data for user ${userId}:`,
        parseError
      );
      // 如果解析失败，使用空数组
      portfolio = [];
    }

    // 确保 portfolio 是数组
    if (!Array.isArray(portfolio)) {
      console.warn(
        `[Portfolio] Mock API: Portfolio data for user ${userId} is not an array`
      );
      portfolio = [];
    }

    // 找到要删除的项目
    const itemIndex = portfolio.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Portfolio item not found');
    }

    // 获取要删除的作品信息，用于删除相关图片
    const itemToDelete = portfolio[itemIndex];

    // 删除相关的图片文件
    if (itemToDelete.imagePaths && itemToDelete.imagePaths.length > 0) {
      for (const imagePath of itemToDelete.imagePaths) {
        await deletePortfolioImage(imagePath);
      }
    }

    // 删除项目
    portfolio.splice(itemIndex, 1);

    // 保存回存储
    await storage.setItem(key, JSON.stringify(portfolio));

    console.log(
      `[Portfolio] Mock API: Deleted item ${itemId} for user ${userId}`
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      '[Portfolio] Mock API: Error deleting portfolio item:',
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

// 上传文件并转换为 Data URL，存储到 IndexedDB
export const uploadPortfolioImage = async (file, userId) => {
  // Mock API: 将文件转换为 Data URL 并存储到 IndexedDB
  console.log(
    `[Portfolio] Mock API: Uploading image ${file.name} for user ${userId}`
  );

  try {
    // 生成文件路径（作为 key）- 統一格式
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `portfolio/${userId}/${fileName}`;

    // 将文件转换为 Data URL
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    // 驗證Data URL格式
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      throw new Error('Invalid Data URL format generated');
    }

    console.log(
      `[Portfolio] Mock API: 存儲時 - path: ${filePath}, dataUrl: ${dataUrl.substring(
        0,
        32
      )}...`
    );

    // 将 Data URL 存储到 IndexedDB
    await imageStorage.storeImage(filePath, dataUrl);

    console.log(
      `[Portfolio] Mock API: Stored Data URL to IndexedDB for ${filePath}`
    );

    return {
      success: true,
      data: {
        path: filePath, // 返回文件路径作为 key
        url: dataUrl, // 返回 Data URL（用于立即显示）
      },
    };
  } catch (error) {
    console.error('[Portfolio] Mock API: Error uploading image:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 删除文件从 IndexedDB
export const deletePortfolioImage = async filePath => {
  // Mock API: 从 IndexedDB 删除图片数据
  console.log(`[Portfolio] Mock API: Deleting image ${filePath}`);

  try {
    const result = await imageStorage.deleteImage(filePath);

    if (result.success) {
      console.log(`[Portfolio] Mock API: Deleted image ${filePath}`);
    }

    return result;
  } catch (error) {
    console.error('[Portfolio] Mock API: Error deleting image:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
