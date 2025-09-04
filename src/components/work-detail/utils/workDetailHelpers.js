// work-detail-helpers v1: 作品详情页工具函数集合

import { workService } from '../../../services/index.js';
import { getProfile } from '../../../services/mock/userProfileService.js';
import { getPortfolioImageUrl } from '../../../services/supabase/portfolio.js';
import { getArtistById } from '../../artist-profile/utils/artistHelpers.js';

/**
 * 根据作品ID获取作品数据
 * @param {string} workId - 作品ID
 * @returns {Promise<Object|null>} 作品数据对象或null
 */
export const getWorkDataById = async workId => {
  try {
    console.log(`[WorkDetail] Loading work data for ID: ${workId}`);

    // 使用新的workService获取作品数据
    const result = await workService.getWorkById(workId);

    if (!result.success) {
      console.error('[WorkDetail] Failed to load work data:', result.error);
      return null;
    }

    const work = result.data;

    if (!work) {
      console.warn(`[WorkDetail] Work not found with ID: ${workId}`);
      return null;
    }

    console.log(`[WorkDetail] Found work:`, work);

    // 获取最新的作者信息
    const authorId = work.author?.id || work.profiles?.id || work.userId;
    let authorInfo = null;
    let profileData = null;
    let userWorks = null;

    if (authorId) {
      try {
        // 使用与艺术家档案页面相同的数据源获取作品数量
        const worksResult = await workService.getUserWorks(authorId);
        if (worksResult.success) {
          userWorks = worksResult.data;
          console.log(
            `[WorkDetail] Retrieved ${userWorks.length} works for ${authorId}`
          );
        }

        // 使用与艺术家档案页面相同的数据源
        const profileResult = await getProfile(authorId);
        if (profileResult.success) {
          profileData = profileResult.data;
          console.log(`[WorkDetail] Retrieved profile data for ${authorId}`);
        }

        // 获取艺术家信息（用于其他字段）
        authorInfo = await getArtistById(authorId);
        console.log(`[WorkDetail] Retrieved author info for ${authorId}`);
      } catch (error) {
        console.warn(
          `[WorkDetail] Failed to get author info for ${authorId}:`,
          error
        );
      }
    }

    // 转换数据格式以匹配详情页需要的结构
    const workData = {
      id: work.id,
      title: work.title || 'Untitled',
      description: work.description || '',
      category: work.category || 'Design',
      date: work.createdAt
        ? new Date(work.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Unknown',
      likes: 124, // 暂时使用默认值，后续可以从API获取
      views: 1247, // 暂时使用默认值，后续可以从API获取
      tags: work.tags || [],
      // 转换图片路径为公开URL
      mainImage:
        work.mainImageUrl ||
        work.thumbnailPath ||
        (work.imagePaths && work.imagePaths[0]) ||
        '',
      // 添加所有图片数组，用于多图片展示
      // 注意：这里传递的是文件路径，WorkImageGallery 会调用 getPortfolioImageUrl 转换
      allImages: work.allImages || work.imagePaths || [],
      author: {
        id: authorId || 'unknown',
        name:
          authorInfo?.name ||
          work.author?.name ||
          work.profiles?.full_name ||
          'Unknown Artist',
        role:
          authorInfo?.title || work.author?.role || work.category || 'Design',
        avatar:
          authorInfo?.avatar ||
          work.author?.avatar ||
          work.profiles?.avatar_url ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        works:
          userWorks?.length ||
          profileData?.portfolio?.length ||
          authorInfo?.works?.length ||
          0, // 优先使用workService数据，与艺术家档案页面保持一致
        followers: authorInfo?.stats?.followers?.toString() || '0', // 使用统一数据源的统计数据，默认为0
        following: authorInfo?.stats?.following?.toString() || 0, // 使用统一数据源的统计数据，默认为0（数字类型）
      },
      relatedWorks: [], // 暂时为空，后续可以从API获取相关作品
    };

    console.log(`[WorkDetail] Transformed work data:`, workData);
    console.log(`[WorkDetail] Tags data:`, workData.tags);
    return workData;
  } catch (error) {
    console.error('[WorkDetail] Error loading work data:', error);
    return null;
  }
};

/**
 * 获取作品数据（保留用于兼容性）
 * @returns {Object} 作品数据对象
 */
export const getWorkData = () => {
  return {
    title: 'Typography Exploration',
    description:
      'Minimalist typography design exploring balance between negative space and bold letterforms.',
    category: 'Graphic Design',
    date: 'Mar 15, 2024',
    likes: 124,
    views: 1247,
    tags: ['Typography', 'Graphic Design', 'Minimalist'],
    mainImage:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=600&fit=crop',
    author: {
      name: 'Emma Thompson',
      role: 'Graphic Design',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      works: 24,
      followers: '1.2k',
      following: 89,
    },
    relatedWorks: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop',
        title: 'Abstract Logo',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1599305445671-ac291c9a87bb?w=200&h=200&fit=crop',
        title: 'Product Packaging',
      },
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=200&h=200&fit=crop',
        title: 'UI Design',
      },
    ],
  };
};

/**
 * 获取默认评论数据
 * @returns {Array} 评论数据数组
 */
export const getDefaultComments = () => {
  return [
    {
      id: 1,
      user: 'Michael R.',
      userId: 1,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      content: 'Amazing work! Love the minimalist approach.',
      likes: 3,
      time: '2 hours ago',
    },
    {
      id: 2,
      user: 'Olivia P.',
      userId: 2,
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      content: 'What fonts did you use?',
      likes: 1,
      time: '1 hour ago',
    },
  ];
};

/**
 * 创建新评论
 * @param {string} content - 评论内容
 * @param {number} commentId - 评论ID
 * @returns {Object} 新评论对象
 */
export const createNewComment = (content, commentId) => {
  return {
    id: commentId,
    user: 'You',
    userId: 999, // 当前用户ID
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: content,
    likes: 0,
    time: 'Just now',
  };
};

/**
 * 预加载图片
 * @param {Array} imageUrls - 图片URL数组
 * @returns {Promise} 预加载Promise
 */
export const preloadImages = async imageUrls => {
  try {
    // 过滤掉无效的图片URL
    const validUrls = imageUrls.filter(
      url =>
        url &&
        url.trim() !== '' &&
        (url.startsWith('blob:') ||
          url.startsWith('http') ||
          url.startsWith('data:'))
    );

    if (validUrls.length === 0) {
      console.log('[WorkDetail] No valid image URLs to preload');
      return true;
    }

    console.log(
      `[WorkDetail] Preloading ${validUrls.length} images:`,
      validUrls
    );

    await Promise.all(
      validUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            // 简化日志，只显示文件名而不是完整URL
            const fileName = url.split('/').pop() || url.substring(0, 30);
            console.log(`[WorkDetail] Preloaded: ${fileName}`);
            resolve();
          };
          img.onerror = error => {
            // 简化错误日志
            const fileName = url.split('/').pop() || url.substring(0, 30);
            console.warn(`[WorkDetail] Failed to preload: ${fileName}`);
            // 不拒绝整个Promise，只是记录警告
            resolve();
          };
          img.src = url;
        });
      })
    );
    return true;
  } catch (error) {
    console.error('[WorkDetail] Failed to preload images:', error);
    return false;
  }
};

/**
 * 解析作品图片路径为Data URL
 * @param {Object} work - 作品数据
 * @returns {Promise<Array>} Data URL数组
 */
export const resolveImageUrls = async work => {
  if (!work || !work.imagePaths || !Array.isArray(work.imagePaths)) {
    return [];
  }

  const resolvedUrls = [];

  for (const path of work.imagePaths) {
    try {
      // 使用imageStorage解析路徑為Data URL
      const imageStorage = await import('../../../utils/indexedDB');
      const dataUrl = await imageStorage.default.getImageUrl(path);

      // 只保留有效的Data URL，失敗返回null
      if (
        dataUrl &&
        typeof dataUrl === 'string' &&
        dataUrl.startsWith('data:image/')
      ) {
        resolvedUrls.push(dataUrl);
      } else {
        resolvedUrls.push(null);
      }
    } catch (error) {
      console.warn(`[WorkDetail] Failed to resolve image path ${path}:`, error);
      resolvedUrls.push(null);
    }
  }

  return resolvedUrls;
};

/**
 * 获取需要预加载的图片URL列表
 * @param {Object} workData - 作品数据
 * @param {Array} comments - 评论数据
 * @returns {Array} 图片URL数组
 */
export const getImageUrlsToPreload = (workData, comments) => {
  const urls = [
    workData?.mainImage,
    workData?.author?.avatar,
    ...(workData?.relatedWorks?.map(work => work.image) || []),
    ...(comments?.map(comment => comment.avatar) || []),
  ];

  // 接受HTTP URL、Data URL和Blob URL
  const validUrls = urls.filter(url => {
    return (
      typeof url === 'string' &&
      (url.startsWith('data:image/') ||
        url.startsWith('http') ||
        url.startsWith('blob:'))
    );
  });

  console.log(`[WorkDetail] Preloading ${validUrls.length} images`);
  return validUrls;
};

/**
 * 获取点赞按钮样式
 * @param {boolean} isLiked - 是否已点赞
 * @returns {string} CSS类名
 */
export const getLikeButtonStyle = isLiked => {
  const baseStyle =
    'flex items-center px-4 py-2 rounded-lg transition-colors duration-200';
  return isLiked
    ? `${baseStyle} bg-red-50 text-red-600`
    : `${baseStyle} bg-gray-100 text-gray-700 hover:bg-gray-200`;
};

/**
 * 获取收藏按钮样式
 * @param {boolean} isSaved - 是否已收藏
 * @returns {string} CSS类名
 */
export const getSaveButtonStyle = isSaved => {
  const baseStyle =
    'flex items-center px-4 py-2 rounded-lg border transition-colors duration-200';
  return isSaved
    ? `${baseStyle} bg-tag-blue text-white border-tag-blue`
    : `${baseStyle} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`;
};

/**
 * 格式化查看数
 * @param {number} views - 查看数
 * @returns {string} 格式化后的查看数
 */
export const formatViewCount = views => {
  return views.toLocaleString();
};

/**
 * 检查评论内容是否有效
 * @param {string} comment - 评论内容
 * @returns {boolean} 是否有效
 */
export const isValidComment = comment => {
  return comment && comment.trim().length > 0;
};

/**
 * 获取当前用户头像
 * @returns {string} 用户头像URL
 */
export const getCurrentUserAvatar = () => {
  return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
};
