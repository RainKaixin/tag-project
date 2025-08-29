// adminService.js - 超级管理员数据管理服务
// 提供最高权限的数据清理和管理功能

/**
 * 管理员数据管理服务
 */
export const adminService = {
  /**
   * 清理所有Collaborations数据
   */
  clearAllCollaborations: async () => {
    try {
      const collaborationKeys = [
        'mock_collaborations',
        'mock_collaboration_applications',
        'mock_collaboration_likes',
        'mock_collaboration_views',
        'mock_collaboration_favorites',
        'tag.collaboration_requests',
      ];

      let clearedCount = 0;
      collaborationKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          clearedCount++;
        }
      });

      // 兜底清理所有包含collaboration的键
      const allKeys = Object.keys(localStorage);
      const additionalKeys = allKeys.filter(
        key =>
          key.toLowerCase().includes('collaboration') &&
          !collaborationKeys.includes(key)
      );

      additionalKeys.forEach(key => {
        localStorage.removeItem(key);
        clearedCount++;
      });

      return {
        success: true,
        clearedCount,
        message: `成功清理 ${clearedCount} 个Collaborations相关数据项`,
      };
    } catch (error) {
      console.error('Error clearing collaborations:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 清理所有作品数据
   */
  clearAllPortfolios: async () => {
    try {
      const allKeys = Object.keys(localStorage);
      const portfolioKeys = allKeys.filter(key => key.startsWith('portfolio_'));

      let clearedCount = 0;
      portfolioKeys.forEach(key => {
        localStorage.removeItem(key);
        clearedCount++;
      });

      return {
        success: true,
        clearedCount,
        message: `成功清理 ${clearedCount} 个作品数据项`,
      };
    } catch (error) {
      console.error('Error clearing portfolios:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 清理所有评论数据
   */
  clearAllComments: async () => {
    try {
      const allKeys = Object.keys(localStorage);
      const commentKeys = allKeys.filter(key => key.includes('comment'));

      let clearedCount = 0;
      commentKeys.forEach(key => {
        localStorage.removeItem(key);
        clearedCount++;
      });

      return {
        success: true,
        clearedCount,
        message: `成功清理 ${clearedCount} 个评论数据项`,
      };
    } catch (error) {
      console.error('Error clearing comments:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 清理所有通知数据
   */
  clearAllNotifications: async () => {
    try {
      const allKeys = Object.keys(localStorage);
      const notificationKeys = allKeys.filter(key =>
        key.includes('notification')
      );

      let clearedCount = 0;
      notificationKeys.forEach(key => {
        localStorage.removeItem(key);
        clearedCount++;
      });

      return {
        success: true,
        clearedCount,
        message: `成功清理 ${clearedCount} 个通知数据项`,
      };
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 清理所有点赞数据
   */
  clearAllLikes: async () => {
    try {
      const allKeys = Object.keys(localStorage);
      const likeKeys = allKeys.filter(key => key.includes('like'));

      let clearedCount = 0;
      likeKeys.forEach(key => {
        localStorage.removeItem(key);
        clearedCount++;
      });

      return {
        success: true,
        clearedCount,
        message: `成功清理 ${clearedCount} 个点赞数据项`,
      };
    } catch (error) {
      console.error('Error clearing likes:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 清理所有浏览记录数据
   */
  clearAllViews: async () => {
    try {
      const allKeys = Object.keys(localStorage);
      const viewKeys = allKeys.filter(key => key.includes('view'));

      let clearedCount = 0;
      viewKeys.forEach(key => {
        localStorage.removeItem(key);
        clearedCount++;
      });

      return {
        success: true,
        clearedCount,
        message: `成功清理 ${clearedCount} 个浏览记录数据项`,
      };
    } catch (error) {
      console.error('Error clearing views:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 清理特定用户的所有数据
   */
  clearUserData: async userId => {
    try {
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(
        key => key.includes(userId) || key.startsWith(`portfolio_${userId}`)
      );

      let clearedCount = 0;
      userKeys.forEach(key => {
        localStorage.removeItem(key);
        clearedCount++;
      });

      return {
        success: true,
        clearedCount,
        message: `成功清理用户 ${userId} 的 ${clearedCount} 个数据项`,
      };
    } catch (error) {
      console.error('Error clearing user data:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 清理所有TAG相关数据（危险操作）
   */
  clearAllTAGData: async () => {
    try {
      const allKeys = Object.keys(localStorage);
      const tagKeys = allKeys.filter(
        key =>
          key.startsWith('tag.') ||
          key.startsWith('user_') ||
          key.startsWith('artist_') ||
          key.startsWith('portfolio_') ||
          key.startsWith('tag_favorites') ||
          key.startsWith('tag_follows') ||
          key.startsWith('tag_service_data') ||
          key.includes('comment') ||
          key.includes('notification') ||
          key.includes('view') ||
          key.includes('like') ||
          key.includes('review') ||
          key.includes('collaboration') ||
          key.includes('avatar') ||
          key.includes('mock_')
      );

      let clearedCount = 0;
      tagKeys.forEach(key => {
        localStorage.removeItem(key);
        clearedCount++;
      });

      return {
        success: true,
        clearedCount,
        message: `成功清理 ${clearedCount} 个TAG相关数据项`,
      };
    } catch (error) {
      console.error('Error clearing all TAG data:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 获取详细的数据统计
   */
  getDetailedStats: async () => {
    try {
      const allKeys = Object.keys(localStorage);

      const stats = {
        total: allKeys.length,
        byType: {
          portfolios: 0,
          collaborations: 0,
          comments: 0,
          notifications: 0,
          likes: 0,
          views: 0,
          favorites: 0,
          users: 0,
          other: 0,
        },
        byUser: {
          alice: 0,
          bryan: 0,
          alex: 0,
          other: 0,
        },
        keys: allKeys,
      };

      allKeys.forEach(key => {
        // 按类型分类
        if (key.startsWith('portfolio_')) {
          stats.byType.portfolios++;
        } else if (key.includes('collaboration')) {
          stats.byType.collaborations++;
        } else if (key.includes('comment')) {
          stats.byType.comments++;
        } else if (key.includes('notification')) {
          stats.byType.notifications++;
        } else if (key.includes('like')) {
          stats.byType.likes++;
        } else if (key.includes('view')) {
          stats.byType.views++;
        } else if (key.includes('favorite')) {
          stats.byType.favorites++;
        } else if (key.includes('user_') || key.includes('artist_')) {
          stats.byType.users++;
        } else {
          stats.byType.other++;
        }

        // 按用户分类
        if (key.includes('alice')) {
          stats.byUser.alice++;
        } else if (key.includes('bryan')) {
          stats.byUser.bryan++;
        } else if (key.includes('alex')) {
          stats.byUser.alex++;
        } else {
          stats.byUser.other++;
        }
      });

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('Error getting detailed stats:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};
