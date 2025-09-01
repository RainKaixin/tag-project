// seed.ts - Mock数据种子化工具
// 确保开发环境中Mock数据的一致性

import { MOCK_USERS } from './mockUsers';

const SEED_VERSION_KEY = 'tag_seed_v1';
const SEED_VERSION = '1.0.0';

// Mock作品数据
const MOCK_WORKS = {
  alice: [
    {
      id: 'pf_alice_01',
      title: 'Snow Landscape',
      description: 'A beautiful winter landscape captured in the mountains',
      category: 'Photography',
      tags: ['photo', 'landscape', 'winter'],
      thumbnailPath: 'portfolio/alice/snow_landscape.jpg',
      imagePaths: ['portfolio/alice/snow_landscape.jpg'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ],
  bryan: [
    {
      id: 'pf_bryan_01',
      title: 'Digital Illustration',
      description: 'A vibrant digital illustration with modern aesthetics',
      category: 'Illustration',
      tags: ['illustration', 'digital-art', 'modern'],
      thumbnailPath: 'portfolio/bryan/digital_art.jpg',
      imagePaths: ['portfolio/bryan/digital_art.jpg'],
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
    },
  ],
  alex: [
    {
      id: 'pf_alex_01',
      title: 'UI Design System',
      description: 'A comprehensive UI design system for modern applications',
      category: 'UI/UX',
      tags: ['design', 'ui', 'system'],
      thumbnailPath: 'portfolio/alex/ui_system.jpg',
      imagePaths: ['portfolio/alex/ui_system.jpg'],
      createdAt: '2024-01-12T09:15:00Z',
      updatedAt: '2024-01-12T09:15:00Z',
    },
  ],
};

// Mock收藏数据 - 移除预设数据，确保收藏完全基于用户真实操作
const MOCK_FAVORITES = {
  // 所有用户从空白收藏开始，不预设任何收藏数据
};

// Mock关注数据
const MOCK_FOLLOWS = {
  alice: ['bryan', 'alex'],
  bryan: ['alice'],
  alex: ['alice', 'bryan'],
};

/**
 * 检查是否已经种子化
 */
export const isSeeded = (): boolean => {
  try {
    const seedVersion = localStorage.getItem(SEED_VERSION_KEY);
    return seedVersion === SEED_VERSION;
  } catch (error) {
    console.warn('[Seed] Failed to check seed status:', error);
    return false;
  }
};

/**
 * 标记为已种子化
 */
const markAsSeeded = (): void => {
  try {
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
    console.log('[Seed] Marked as seeded');
  } catch (error) {
    console.warn('[Seed] Failed to mark as seeded:', error);
  }
};

/**
 * 种子化用户数据
 */
const seedUsers = (): void => {
  try {
    Object.entries(MOCK_USERS).forEach(([userId, userData]) => {
      const key = `user_${userId}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(userData));
        console.log(`[Seed] Seeded user: ${userId}`);
      }
    });
  } catch (error) {
    console.warn('[Seed] Failed to seed users:', error);
  }
};

/**
 * 种子化作品数据
 */
const seedWorks = (): void => {
  try {
    Object.entries(MOCK_WORKS).forEach(([userId, works]) => {
      const key = `portfolio_${userId}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(works));
        console.log(`[Seed] Seeded works for user: ${userId}`);
      }
    });
  } catch (error) {
    console.warn('[Seed] Failed to seed works:', error);
  }
};

/**
 * 种子化收藏数据
 * 不再预设任何收藏数据，确保收藏完全基于用户真实操作
 */
const seedFavorites = (): void => {
  try {
    // 清理可能存在的旧种子数据
    const usersToClean = ['alice', 'bryan', 'alex'];
    usersToClean.forEach(userId => {
      const key = `tag_favorites_${userId}`;
      const existingData = localStorage.getItem(key);
      if (existingData) {
        // 检查是否为旧格式数据（字符串数组）
        try {
          const parsed = JSON.parse(existingData);
          if (Array.isArray(parsed)) {
            // 删除旧格式的种子数据
            localStorage.removeItem(key);
            console.log(
              `[Seed] Cleaned old favorites data for user: ${userId}`
            );
          }
        } catch (e) {
          // 如果解析失败，也删除
          localStorage.removeItem(key);
          console.log(
            `[Seed] Cleaned invalid favorites data for user: ${userId}`
          );
        }
      }
    });
    console.log('[Seed] Favorites seeding completed - no preset data');
  } catch (error) {
    console.warn('[Seed] Failed to clean favorites data:', error);
  }
};

/**
 * 种子化关注数据
 */
const seedFollows = (): void => {
  try {
    const followData = {};
    Object.entries(MOCK_FOLLOWS).forEach(([userId, follows]) => {
      followData[userId] = {
        followers: follows,
        followersCount: follows.length,
        following: Object.keys(MOCK_FOLLOWS).filter(id => id !== userId),
        followingCount: Object.keys(MOCK_FOLLOWS).length - 1,
      };
    });

    localStorage.setItem('tag_follows', JSON.stringify(followData));
    console.log('[Seed] Seeded follow data');
  } catch (error) {
    console.warn('[Seed] Failed to seed follows:', error);
  }
};

/**
 * 确保Mock数据种子化（幂等操作）
 */
export const ensureMockSeed = (): void => {
  try {
    console.log('[Seed] Checking if data is seeded...');

    if (isSeeded()) {
      console.log('[Seed] Data already seeded, skipping...');
      return;
    }

    console.log('[Seed] Starting data seeding...');

    // 按顺序种子化数据
    seedUsers();
    seedWorks();
    seedFavorites();
    seedFollows();

    // 标记为已种子化
    markAsSeeded();

    console.log('[Seed] Data seeding completed successfully');
  } catch (error) {
    console.error('[Seed] Failed to seed data:', error);
  }
};

/**
 * 重置Mock数据（开发用）
 */
export const resetMockData = (): void => {
  try {
    console.log('[Seed] Resetting mock data...');

    // 清除种子版本标记
    localStorage.removeItem(SEED_VERSION_KEY);

    // 清除相关数据
    const keysToRemove = [
      'user_alice',
      'user_bryan',
      'user_alex',
      'portfolio_alice',
      'portfolio_bryan',
      'portfolio_alex',
      'tag_favorites_alice',
      'tag_favorites_bryan',
      'tag_favorites_alex',
      'tag_follows',
      // 同时清理新的收藏服务数据
      'tag_favorites',
      'tag_favorite_counters',
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('[Seed] Mock data reset completed');
  } catch (error) {
    console.error('[Seed] Failed to reset mock data:', error);
  }
};

export default {
  ensureMockSeed,
  resetMockData,
  isSeeded,
};
