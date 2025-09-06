// major-service v1: 专业筛选服务

import { getArtistById } from '../components/artist-profile/utils/artistHelpers';

import { getPublicPortfolio, getPortfolioImageUrl } from './supabase/portfolio';

/**
 * 根据专业筛选获取作品
 * @param {Object} options - 筛选选项
 * @param {Array} options.majors - 专业列表
 * @param {Array} options.software - 软件列表
 * @param {string} options.sortBy - 排序方式 ('latest' | 'popular')
 * @param {number} options.limit - 每页数量
 * @param {string} options.cursor - 分页游标
 * @returns {Promise<Object>} 作品列表和分页信息
 */
export const getArtworksByMajor = async (options = {}) => {
  try {
    const {
      majors = [],
      software = [],
      sortBy = 'latest',
      limit = 12,
      cursor = null,
    } = options;

    console.log('[majorService] Filtering by:', { majors, software, sortBy });

    // 获取所有艺术家的作品
    const allWorks = [];
    // 使用真實的用戶 ID 而不是 Mock 用戶名
    const artistIds = [
      '9da7c012-2b80-4597-b138-4f5c0c7fdcd1', // R
      '512411b2-adac-4dec-8fe5-63fb405f756b', // A
    ];

    // 获取每个艺术家的作品
    for (const artistId of artistIds) {
      try {
        const portfolioResult = await getPublicPortfolio(artistId);
        if (portfolioResult.success && portfolioResult.data) {
          // 获取艺术家信息
          const artist = await getArtistById(artistId);

          // 为每个作品添加艺术家信息
          const worksWithArtist = portfolioResult.data.map(work => ({
            ...work,
            author: {
              id: artist?.id || artistId,
              name: artist?.name || artistId,
              majors: artist?.majors || [],
              minors: artist?.minors || [],
            },
          }));

          allWorks.push(...worksWithArtist);
        }
      } catch (error) {
        console.warn(
          `[majorService] Failed to get works for artist ${artistId}:`,
          error
        );
      }
    }

    // 根据专业筛选作品
    let filteredWorks = allWorks;

    if (majors.length > 0) {
      filteredWorks = filteredWorks.filter(work => {
        const artistMajors = [
          ...(work.author.majors || []),
          ...(work.author.minors || []),
        ];

        // 检查是否满足所有选中的专业条件 (AND 逻辑)
        return majors.every(major =>
          artistMajors.some(
            artistMajor => artistMajor.toLowerCase() === major.toLowerCase()
          )
        );
      });
    }

    // 根据软件筛选作品（查询作品的 software 字段，不是 tags 字段）
    if (software.length > 0) {
      filteredWorks = filteredWorks.filter(work => {
        const workSoftware = work.software || [];
        return software.every(sw =>
          workSoftware.some(soft =>
            soft.toLowerCase().includes(sw.toLowerCase())
          )
        );
      });
    }

    // 排序
    if (sortBy === 'latest') {
      filteredWorks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === 'popular') {
      // 这里可以根据点赞数、浏览量等排序
      // 暂时按创建时间排序
      filteredWorks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // 分页处理
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = filteredWorks.findIndex(work => work.id === cursor);
      startIndex = cursorIndex + 1;
    }

    const endIndex = startIndex + limit;
    const paginatedWorks = filteredWorks.slice(startIndex, endIndex);

    // 转换作品格式以匹配聚合页面的期望格式
    const formattedWorks = await Promise.all(
      paginatedWorks.map(async work => {
        // 生成完整的圖片 URL
        let imageUrl = '/assets/placeholder.svg';
        if (work.thumbnailPath) {
          const imageResult = await getPortfolioImageUrl(work.thumbnailPath);
          if (imageResult.success) {
            imageUrl = imageResult.data.url;
          }
        } else if (work.imagePaths && work.imagePaths[0]) {
          const imageResult = await getPortfolioImageUrl(work.imagePaths[0]);
          if (imageResult.success) {
            imageUrl = imageResult.data.url;
          }
        }

        return {
          id: work.id,
          title: work.title,
          image: imageUrl,
          author: work.author,
          category: work.category,
          tags: work.tags || [],
          description: work.description,
          createdAt: work.createdAt,
        };
      })
    );

    const hasMore = endIndex < filteredWorks.length;
    const nextCursor = hasMore
      ? paginatedWorks[paginatedWorks.length - 1]?.id
      : null;

    console.log(
      `[majorService] Found ${filteredWorks.length} works, returning ${formattedWorks.length}`
    );

    return {
      items: formattedWorks,
      cursor: nextCursor,
      hasMore,
      total: filteredWorks.length,
    };
  } catch (error) {
    console.error('[majorService] Error getting works by major:', error);
    throw error;
  }
};

/**
 * 获取专业统计信息
 * @param {Array} majors - 专业列表
 * @returns {Promise<Object>} 统计信息
 */
export const getMajorStats = async (majors = []) => {
  try {
    const result = await getArtworksByMajor({ majors, limit: 1000 });

    return {
      works: result.total,
      artists: new Set(result.items.map(work => work.author.id)).size,
    };
  } catch (error) {
    console.error('[majorService] Error getting major stats:', error);
    return { works: 0, artists: 0 };
  }
};
