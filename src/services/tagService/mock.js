// tag-service-mock v1: Mock 標籤服務實現

import { getCurrentUserId } from '../../utils/currentUser';
import imageStorage from '../../utils/indexedDB';
import { MOCK_USERS } from '../../utils/mockUsers';
import { extractTags } from '../../utils/tagParser';
import { storage } from '../storage/index';

// Mock 數據存儲
const STORAGE_KEY = 'tag_service_data';

// 從真實的 portfolio 數據源讀取作品數據
const getPortfolioDataById = async workId => {
  try {
    // 遍歷所有用戶的 portfolio 數據
    const users = ['alice', 'bryan', 'alex'];

    for (const userId of users) {
      const portfolioKey = `portfolio_${userId}`;
      const portfolioData = await storage.getItem(portfolioKey);

      if (portfolioData) {
        try {
          const portfolio = JSON.parse(portfolioData);
          if (Array.isArray(portfolio)) {
            const work = portfolio.find(item => item.id === workId);
            if (work) {
              // 獲取用戶信息
              const userInfo = MOCK_USERS[userId];
              return {
                ...work,
                userId: userId,
                authorName: userInfo?.displayName || userId,
              };
            }
          }
        } catch (parseError) {
          console.warn(
            `Failed to parse portfolio data for ${userId}:`,
            parseError
          );
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting portfolio data by ID:', error);
    return null;
  }
};

// 初始化 Mock 數據
const initializeMockData = async () => {
  const existing = await storage.getItem(STORAGE_KEY);
  if (!existing) {
    const mockData = {
      // 標籤統計
      tagStats: {
        design: { works: 15, users: 8, projects: 3 },
        illustration: { works: 12, users: 6, projects: 2 },
        photography: { works: 8, users: 4, projects: 1 },
        '3d': { works: 6, users: 3, projects: 2 },
        animation: { works: 4, users: 2, projects: 1 },
        ui: { works: 10, users: 5, projects: 4 },
        ux: { works: 7, users: 4, projects: 3 },
        branding: { works: 9, users: 5, projects: 2 },
        typography: { works: 5, users: 3, projects: 1 },
        'digital-art': { works: 11, users: 6, projects: 2 },
        photo: { works: 1, users: 1, projects: 0 },
        landscape: { works: 1, users: 1, projects: 0 },
      },
      // 作品標籤關聯
      workTags: {
        work1: ['design', 'ui', 'branding'],
        work2: ['illustration', 'digital-art'],
        work3: ['photography', 'design'],
        work4: ['3d', 'animation'],
        work5: ['ux', 'ui', 'design'],
        pf_alice_01: ['photo', 'landscape'],
        pf_bryan_01: ['illustration', 'digital-art'],
        pf_alex_01: ['design', 'ui'],
      },
      // 用戶標籤關聯（技能）
      userTags: {
        alex: ['design', 'ui', 'ux'],
        bryan: ['illustration', 'digital-art', 'typography'],
        alice: ['photography', 'design', 'branding', 'photo', 'landscape'],
      },
      // 項目標籤關聯（需求）
      projectTags: {
        project1: ['design', 'ui', 'branding'],
        project2: ['illustration', 'digital-art'],
        project3: ['3d', 'animation'],
      },
    };
    await storage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  }
};

// 獲取 Mock 數據
const getMockData = async () => {
  await initializeMockData();
  const data = await storage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

// 保存 Mock 數據
const saveMockData = async data => {
  await storage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// 模擬延遲
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 獲取標籤統計信息
 */
export const getTagStats = async slug => {
  await delay();

  // 優先從真實數據計算統計
  let worksCount = 0;
  const users = ['alice', 'bryan', 'alex'];

  for (const userId of users) {
    const portfolioKey = `portfolio_${userId}`;
    const portfolioData = await storage.getItem(portfolioKey);

    if (portfolioData) {
      try {
        const portfolio = JSON.parse(portfolioData);
        if (Array.isArray(portfolio)) {
          for (const work of portfolio) {
            if (
              work.tags &&
              work.tags.some(
                tag =>
                  tag.toLowerCase() === slug.toLowerCase() ||
                  tag.toLowerCase().includes(slug.toLowerCase())
              )
            ) {
              worksCount++;
            }
          }
        }
      } catch (parseError) {
        console.warn(
          `Failed to parse portfolio data for ${userId}:`,
          parseError
        );
      }
    }
  }

  // 如果沒有找到真實數據，回退到 Mock 數據
  if (worksCount === 0) {
    const data = await getMockData();
    const mockStats = data?.tagStats?.[slug] || {
      works: 0,
      users: 0,
      projects: 0,
    };
    return mockStats;
  }

  return { works: worksCount, users: 0, projects: 0 };
};

/**
 * 根據標籤獲取作品列表
 */
export const getWorksByTag = async (slug, options = {}) => {
  await delay();
  const { limit = 10, cursor = null } = options;

  // 優先從真實的 portfolio 數據源讀取所有作品
  const allWorks = [];
  const users = ['alice', 'bryan', 'alex'];

  for (const userId of users) {
    const portfolioKey = `portfolio_${userId}`;
    const portfolioData = await storage.getItem(portfolioKey);

    if (portfolioData) {
      try {
        const portfolio = JSON.parse(portfolioData);
        if (Array.isArray(portfolio)) {
          // 獲取用戶信息
          const userInfo = MOCK_USERS[userId];

          for (const work of portfolio) {
            // 檢查作品是否包含該標籤
            if (
              work.tags &&
              work.tags.some(
                tag =>
                  tag.toLowerCase() === slug.toLowerCase() ||
                  tag.toLowerCase().includes(slug.toLowerCase())
              )
            ) {
              // 獲取封面圖片 - 優先使用統一的imageKey
              let coverUrl = '';
              if (work.imageKey) {
                coverUrl = await imageStorage.getImageUrl(work.imageKey);
              } else if (work.thumbnailPath) {
                coverUrl = await imageStorage.getImageUrl(work.thumbnailPath);
              } else if (work.imagePaths && work.imagePaths[0]) {
                coverUrl = await imageStorage.getImageUrl(work.imagePaths[0]);
              }

              allWorks.push({
                id: work.id,
                title: work.title,
                description: work.description || `Tagged with #${slug}`,
                author: {
                  id: userId,
                  name: userInfo?.displayName || userId,
                },
                image: coverUrl || '',
              });
            }
          }
        }
      } catch (parseError) {
        console.warn(
          `Failed to parse portfolio data for ${userId}:`,
          parseError
        );
      }
    }
  }

  // 如果沒有找到真實數據，回退到 Mock 數據
  if (allWorks.length === 0) {
    const data = await getMockData();
    const workIds = Object.entries(data?.workTags || {})
      .filter(([_, tags]) => tags.includes(slug))
      .map(([id]) => id);

    for (const id of workIds) {
      const portfolioData = await getPortfolioDataById(id);
      if (portfolioData) {
        let coverUrl = '';
        if (portfolioData.imageKey) {
          coverUrl = await imageStorage.getImageUrl(portfolioData.imageKey);
        } else if (portfolioData.thumbnailPath) {
          coverUrl = await imageStorage.getImageUrl(
            portfolioData.thumbnailPath
          );
        } else if (portfolioData.imagePaths && portfolioData.imagePaths[0]) {
          coverUrl = await imageStorage.getImageUrl(
            portfolioData.imagePaths[0]
          );
        }

        allWorks.push({
          id: portfolioData.id,
          title: portfolioData.title,
          description: portfolioData.description || `Tagged with #${slug}`,
          author: {
            id: portfolioData.userId,
            name: portfolioData.authorName,
          },
          image: coverUrl || '',
        });
      }
    }
  }

  // 模擬分頁
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + limit;
  const items = allWorks.slice(startIndex, endIndex);
  const hasMore = endIndex < allWorks.length;
  const nextCursor = hasMore ? endIndex.toString() : null;

  return {
    items,
    hasMore,
    cursor: nextCursor,
  };
};

/**
 * 根據標籤獲取用戶列表
 */
export const getUsersByTag = async (slug, options = {}) => {
  await delay();
  const { limit = 10, cursor = null } = options;
  const data = await getMockData();

  // 找到包含該標籤的用戶
  const userIds = Object.entries(data?.userTags || {})
    .filter(([_, tags]) => tags.includes(slug))
    .map(([id]) => id);

  // 模擬分頁
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + limit;
  const items = userIds.slice(startIndex, endIndex);
  const hasMore = endIndex < userIds.length;
  const nextCursor = hasMore ? endIndex.toString() : null;

  return {
    items: items.map(id => {
      // 從 MOCK_USERS 獲取真實的用戶信息
      const userInfo = MOCK_USERS[id];
      if (userInfo) {
        return {
          id: userInfo.id,
          name: userInfo.displayName,
          avatar: userInfo.avatar,
          title: userInfo.role,
          school: userInfo.school,
        };
      }

      // 如果找不到用戶信息，返回占位數據
      return {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        avatar: `/avatars/${id}.jpg`,
        title: 'Artist',
        school: 'Art School',
      };
    }),
    hasMore,
    cursor: nextCursor,
  };
};

/**
 * 根據標籤獲取項目列表
 */
export const getProjectsByTag = async (slug, options = {}) => {
  await delay();
  const { limit = 10, cursor = null } = options;
  const data = await getMockData();

  // 找到包含該標籤的項目
  const projectIds = Object.entries(data?.projectTags || {})
    .filter(([_, tags]) => tags.includes(slug))
    .map(([id]) => id);

  // 模擬分頁
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + limit;
  const items = projectIds.slice(startIndex, endIndex);
  const hasMore = endIndex < projectIds.length;
  const nextCursor = hasMore ? endIndex.toString() : null;

  return {
    items: items.map(id => ({
      id,
      title: `Project ${id}`,
      description: `This is a project tagged with #${slug}`,
      owner: { id: 'alex', name: 'Alex' },
      status: 'active',
    })),
    hasMore,
    cursor: nextCursor,
  };
};

/**
 * 搜索標籤（自動補全）
 */
export const searchTags = async (query, limit = 10) => {
  await delay();
  const data = await getMockData();
  const allTags = Object.keys(data?.tagStats || {});

  const filtered = allTags
    .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit);

  return filtered.map(tag => ({
    name: tag,
    slug: tag,
    count: data?.tagStats?.[tag]?.works || 0,
  }));
};

/**
 * 獲取熱門標籤
 */
export const getPopularTags = async (limit = 20) => {
  await delay();
  const data = await getMockData();

  return Object.entries(data?.tagStats || {})
    .map(([tag, stats]) => ({
      name: tag,
      slug: tag,
      count: stats.works + stats.users + stats.projects,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * 為作品添加標籤
 */
export const attachTagsToWork = async (workId, tags) => {
  await delay();
  const data = getMockData();

  if (!data.workTags[workId]) {
    data.workTags[workId] = [];
  }

  // 添加新標籤
  tags.forEach(tag => {
    if (!data.workTags[workId].includes(tag.slug)) {
      data.workTags[workId].push(tag.slug);
    }

    // 更新統計
    if (!data.tagStats[tag.slug]) {
      data.tagStats[tag.slug] = { works: 0, users: 0, projects: 0 };
    }
    data.tagStats[tag.slug].works++;
  });

  saveMockData(data);
  return true;
};

/**
 * 為用戶添加標籤（技能）
 */
export const attachTagsToUser = async (userId, tags) => {
  await delay();
  const data = getMockData();

  if (!data.userTags[userId]) {
    data.userTags[userId] = [];
  }

  // 添加新標籤
  tags.forEach(tag => {
    if (!data.userTags[userId].includes(tag.slug)) {
      data.userTags[userId].push(tag.slug);
    }

    // 更新統計
    if (!data.tagStats[tag.slug]) {
      data.tagStats[tag.slug] = { works: 0, users: 0, projects: 0 };
    }
    data.tagStats[tag.slug].users++;
  });

  saveMockData(data);
  return true;
};

/**
 * 為項目添加標籤（需求）
 */
export const attachTagsToProject = async (projectId, tags) => {
  await delay();
  const data = getMockData();

  if (!data.projectTags[projectId]) {
    data.projectTags[projectId] = [];
  }

  // 添加新標籤
  tags.forEach(tag => {
    if (!data.projectTags[projectId].includes(tag.slug)) {
      data.projectTags[projectId].push(tag.slug);
    }

    // 更新統計
    if (!data.tagStats[tag.slug]) {
      data.tagStats[tag.slug] = { works: 0, users: 0, projects: 0 };
    }
    data.tagStats[tag.slug].projects++;
  });

  saveMockData(data);
  return true;
};
